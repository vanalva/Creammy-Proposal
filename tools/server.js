const express = require('express');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const app = express();
const ROOT = path.resolve(__dirname, '..');
const PORT = 3000;

app.use(express.json({ limit: '5mb' }));

// Serve dashboard and static files
app.use('/tools', express.static(path.join(ROOT, 'tools')));
app.use('/data', express.static(path.join(ROOT, 'data')));
app.use('/output', express.static(path.join(ROOT, 'output')));
app.use('/css', express.static(path.join(ROOT, 'css')));
app.use('/js', express.static(path.join(ROOT, 'js')));
app.use('/images', express.static(path.join(ROOT, 'images')));

// Redirect root to dashboard
app.get('/', (req, res) => res.redirect('/tools/pricing-dashboard.html'));

// ── API: Read data files ──
app.get('/api/services', (req, res) => {
  res.json(JSON.parse(fs.readFileSync(path.join(ROOT, 'data/catalog/services.json'), 'utf8')));
});
app.get('/api/retainers', (req, res) => {
  res.json(JSON.parse(fs.readFileSync(path.join(ROOT, 'data/catalog/retainers.json'), 'utf8')));
});
app.get('/api/discounts', (req, res) => {
  res.json(JSON.parse(fs.readFileSync(path.join(ROOT, 'data/catalog/discounts.json'), 'utf8')));
});

// ── API: Save data files ──
app.put('/api/services', (req, res) => {
  try {
    const data = req.body;
    data.lastUpdated = new Date().toISOString().split('T')[0];
    fs.writeFileSync(path.join(ROOT, 'data/catalog/services.json'), JSON.stringify(data, null, 2));
    regenerateDashboardData();
    res.json({ ok: true, message: 'services.json saved' });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.put('/api/discounts', (req, res) => {
  try {
    const data = req.body;
    data.lastUpdated = new Date().toISOString().split('T')[0];
    fs.writeFileSync(path.join(ROOT, 'data/catalog/discounts.json'), JSON.stringify(data, null, 2));
    regenerateDashboardData();
    res.json({ ok: true, message: 'discounts.json saved' });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.put('/api/retainers', (req, res) => {
  try {
    const data = req.body;
    data.lastUpdated = new Date().toISOString().split('T')[0];
    fs.writeFileSync(path.join(ROOT, 'data/catalog/retainers.json'), JSON.stringify(data, null, 2));
    regenerateDashboardData();
    res.json({ ok: true, message: 'retainers.json saved' });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// ── API: Update a single service ──
app.patch('/api/services/:serviceId', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/catalog/services.json'), 'utf8'));
    const svcId = req.params.serviceId;
    if (!data.services[svcId]) {
      return res.status(404).json({ ok: false, error: `Service ${svcId} not found` });
    }

    // Deep merge the patch
    const patch = req.body;
    deepMerge(data.services[svcId], patch);
    data.lastUpdated = new Date().toISOString().split('T')[0];

    fs.writeFileSync(path.join(ROOT, 'data/catalog/services.json'), JSON.stringify(data, null, 2));
    regenerateDashboardData();
    res.json({ ok: true, message: `${svcId} updated`, service: data.services[svcId] });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// ── API: Rebuild proposals ──
app.post('/api/rebuild', (req, res) => {
  try {
    const manifestPath = req.body.manifest || 'templates/manifest.json';
    const fullPath = path.join(ROOT, manifestPath);
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ ok: false, error: `Manifest not found: ${manifestPath}` });
    }
    const output = execSync(`node build/build.js "${fullPath}"`, { cwd: ROOT, timeout: 30000 }).toString();
    res.json({ ok: true, message: 'Rebuild complete', output });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// ── API: Package Templates ──
const PKG_TEMPLATES_PATH = path.join(ROOT, 'data/catalog/package-templates.json');

function readTemplates() {
  try { return JSON.parse(fs.readFileSync(PKG_TEMPLATES_PATH, 'utf8')); }
  catch(e) { return { version: '1.0', lastUpdated: new Date().toISOString().split('T')[0], templates: [] }; }
}

function writeTemplates(data) {
  data.lastUpdated = new Date().toISOString().split('T')[0];
  fs.writeFileSync(PKG_TEMPLATES_PATH, JSON.stringify(data, null, 2));
  regenerateDashboardData();
}

app.get('/api/packages', (req, res) => {
  res.json(readTemplates());
});

app.post('/api/packages', (req, res) => {
  try {
    const data = readTemplates();
    const pkg = req.body;
    pkg.createdAt = pkg.createdAt || new Date().toISOString();
    pkg.source = pkg.source || 'manual';

    // Replace if same id exists
    const idx = data.templates.findIndex(t => t.id === pkg.id);
    if (idx >= 0) data.templates[idx] = pkg;
    else data.templates.push(pkg);

    writeTemplates(data);
    res.json({ ok: true, message: `Package ${pkg.id} saved`, total: data.templates.length });
  } catch(e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.patch('/api/packages/:id', (req, res) => {
  try {
    const data = readTemplates();
    const idx = data.templates.findIndex(t => t.id === req.params.id);
    if (idx < 0) return res.status(404).json({ ok: false, error: 'Package not found' });
    Object.assign(data.templates[idx], req.body);
    writeTemplates(data);
    res.json({ ok: true, message: `Package ${req.params.id} updated` });
  } catch(e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.delete('/api/packages/:id', (req, res) => {
  try {
    const data = readTemplates();
    data.templates = data.templates.filter(t => t.id !== req.params.id);
    writeTemplates(data);
    res.json({ ok: true, message: `Package ${req.params.id} deleted` });
  } catch(e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.post('/api/rebuild-all', (req, res) => {
  try {
    const results = [];

    // Find all manifests in output folders
    const outputDir = path.join(ROOT, 'output');
    if (fs.existsSync(outputDir)) {
      const dirs = fs.readdirSync(outputDir).filter(d =>
        fs.statSync(path.join(outputDir, d)).isDirectory() &&
        fs.existsSync(path.join(outputDir, d, 'manifest.json'))
      );
      for (const dir of dirs) {
        const mp = `output/${dir}/manifest.json`;
        try {
          execSync(`node build/build.js "${path.join(ROOT, mp)}"`, { cwd: ROOT, timeout: 30000 });
          results.push({ manifest: mp, ok: true });
        } catch (e) {
          results.push({ manifest: mp, ok: false, error: e.message });
        }
      }
    }

    // Also rebuild from templates/manifest.json if it exists
    const tplManifest = path.join(ROOT, 'templates/manifest.json');
    if (fs.existsSync(tplManifest)) {
      try {
        execSync(`node build/build.js "${tplManifest}"`, { cwd: ROOT, timeout: 30000 });
        results.push({ manifest: 'templates/manifest.json', ok: true });
      } catch (e) {
        results.push({ manifest: 'templates/manifest.json', ok: false, error: e.message });
      }
    }

    res.json({ ok: true, results });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// ── API: List proposals ──
app.get('/api/proposals', (req, res) => {
  try {
    const outputDir = path.join(ROOT, 'output');
    const proposals = [];
    if (fs.existsSync(outputDir)) {
      const dirs = fs.readdirSync(outputDir).filter(d =>
        fs.statSync(path.join(outputDir, d)).isDirectory() &&
        fs.existsSync(path.join(outputDir, d, 'manifest.json'))
      );
      for (const dir of dirs) {
        const manifest = JSON.parse(fs.readFileSync(path.join(outputDir, dir, 'manifest.json'), 'utf8'));
        proposals.push({
          id: dir,
          client: manifest.client?.name || dir,
          proposalId: manifest.proposal?.id || dir,
          path: `output/${dir}/index.html`,
          manifestPath: `output/${dir}/manifest.json`,
        });
      }
    }
    res.json(proposals);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// ── Helpers ──
function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) && target[key] && typeof target[key] === 'object') {
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

function regenerateDashboardData() {
  const svc = fs.readFileSync(path.join(ROOT, 'data/catalog/services.json'), 'utf8').trim();
  const ret = fs.readFileSync(path.join(ROOT, 'data/catalog/retainers.json'), 'utf8').trim();
  const disc = fs.readFileSync(path.join(ROOT, 'data/catalog/discounts.json'), 'utf8').trim();
  let pkg = '{"version":"1.0","templates":[]}';
  try { pkg = fs.readFileSync(PKG_TEMPLATES_PATH, 'utf8').trim(); } catch(e) {}
  const block = `const EMBEDDED_SERVICES = ${svc};\nconst EMBEDDED_RETAINERS = ${ret};\nconst EMBEDDED_DISCOUNTS = ${disc};\nconst EMBEDDED_PACKAGES = ${pkg};`;
  fs.writeFileSync(path.join(ROOT, 'tools/pricing-data.js'), block);
}

// ── Start ──
app.listen(PORT, () => {
  console.log(`\n  Van Alva Pricing Dashboard`);
  console.log(`  http://localhost:${PORT}\n`);
  console.log(`  API endpoints:`);
  console.log(`    GET  /api/services          — read catalog`);
  console.log(`    GET  /api/retainers         — read retainers`);
  console.log(`    GET  /api/discounts         — read discounts`);
  console.log(`    PUT  /api/services          — save full catalog`);
  console.log(`    PUT  /api/retainers         — save retainers`);
  console.log(`    PUT  /api/discounts         — save discounts`);
  console.log(`    PATCH /api/services/:id     — update single service`);
  console.log(`    POST /api/rebuild           — rebuild one proposal`);
  console.log(`    POST /api/rebuild-all       — rebuild all proposals`);
  console.log(`    GET  /api/proposals          — list proposals`);
  console.log(`    GET  /api/packages           — list package templates`);
  console.log(`    POST /api/packages           — save package template`);
  console.log(`    PATCH /api/packages/:id      — update (approve/edit)`);
  console.log(`    DELETE /api/packages/:id     — delete template\n`);
});
