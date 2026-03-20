WebFont.load({  google: {    families: ["Montserrat:100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic","Inter:regular","Syne:regular"]  }});
!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);

  document.querySelectorAll('.video-container').forEach(container => {
    const video = container.querySelector('.hover-video');
    const unmuteBtn = container.querySelector('.unmute-button');
    video.addEventListener('mouseenter', () => {
      video.play();
    });
    video.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
    unmuteBtn.addEventListener('click', () => {
      video.muted = false;
      video.play();
      unmuteBtn.style.display = 'none';
    });
  });


  document.querySelectorAll('.video-container').forEach(container => {
    const video = container.querySelector('.hover-video');
    const unmuteBtn = container.querySelector('.unmute-button');
    const source = video.querySelector('source');
    // Build poster frame URL from video source
    if (source && source.src.includes('cloudinary.com')) {
      const videoURL = source.src;
      const parts = videoURL.split('/upload/');
      if (parts.length === 2) {
        const posterURL = `${parts[0]}/upload/so_0/${parts[1].replace('.mp4', '.jpg')}`;
        video.setAttribute('poster', posterURL);
      }
    }
    // Playback interaction
    video.addEventListener('mouseenter', () => {
      video.play();
    });
    video.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
    unmuteBtn.addEventListener('click', () => {
      video.muted = false;
      video.play();
      unmuteBtn.style.display = 'none';
    });
  });


  // Lottie animations for logo and portfolio button (using lottie-web directly)
  (function() {
    // Logo Lottie — clean build
    var logoEl = document.getElementById('logo-vanalva');
    var logoAnim = null;
    var logoIsForward = true;
    if (logoEl) {
      var LOGO_SRC = 'https://uploads-ssl.webflow.com/6273b2ec51c1e312622a097d/6373e4cb86d5993399f031fb_logo-vanalva.json';
      logoAnim = lottie.loadAnimation({
        container: logoEl,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: LOGO_SRC
      });

      // Safe frames (first/last may be empty in some lotties)
      var FIRST_FRAME = 1;
      var LAST_FRAME;

      // On page load: play reverse to frame 0, then clamp to safe first frame
      logoAnim.addEventListener('DOMLoaded', function() {
        LAST_FRAME = logoAnim.totalFrames - 2;
        logoAnim.goToAndStop(LAST_FRAME, true);
        logoAnim.setDirection(-1);
        logoIsForward = false;
        logoAnim.play();
      });
      logoAnim.addEventListener('complete', function() {
        // Clamp to safe frame so it never lands on an empty frame
        if (logoIsForward) {
          logoAnim.goToAndStop(LAST_FRAME, true);
        } else {
          logoAnim.goToAndStop(FIRST_FRAME, true);
        }
      });

      // Scroll: forward when scrolled down, reverse when back to top
      var logoAtTop = true;
      window.addEventListener('scroll', function() {
        if (logoAtTop && window.scrollY > 10) {
          logoAtTop = false;
          logoAnim.setDirection(1);
          logoIsForward = true;
          logoAnim.goToAndPlay(FIRST_FRAME, true);
        } else if (!logoAtTop && window.scrollY <= 10) {
          logoAtTop = true;
          logoAnim.setDirection(-1);
          logoIsForward = false;
          logoAnim.play();
        }
      }, { passive: true });

      // Hover in: play forward (→ last), hover out: play reverse (→ first)
      var logoContainer = logoEl.closest('.brand');
      if (logoContainer) {
        logoContainer.addEventListener('mouseenter', function() {
          logoAnim.setDirection(1);
          logoIsForward = true;
          logoAnim.play();
        });
        logoContainer.addEventListener('mouseleave', function() {
          logoAnim.setDirection(-1);
          logoIsForward = false;
          logoAnim.play();
        });
      }
    }

    // Portfolio Lottie — clean build
    var portfolioEl = document.getElementById('portfolio-lottie');
    var portfolioAnim = null;
    var portfolioSpinning = false;
    if (portfolioEl) {
      var PORTFOLIO_SRC = 'https://uploads-ssl.webflow.com/6273b2ec51c1e312622a097d/638d87a02c86b76882e8886a_view-portfolio.json';
      portfolioAnim = lottie.loadAnimation({
        container: portfolioEl,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: PORTFOLIO_SRC
      });

      // On page load: play intro once, then start continuous CSS spin
      portfolioAnim.addEventListener('complete', function onFirstComplete() {
        portfolioAnim.removeEventListener('complete', onFirstComplete);
        portfolioSpinning = true;
        portfolioEl.style.animation = 'portfolio-spin 8s linear infinite';
      });
      portfolioAnim.play();

      // Hover: reanimate lottie (play intro again faster), pause CSS spin
      var portfolioContainer = portfolioEl.closest('.view-portfolio');
      if (portfolioContainer) {
        portfolioContainer.addEventListener('mouseenter', function() {
          portfolioEl.style.animation = 'none';
          portfolioAnim.setSpeed(2);
          portfolioAnim.goToAndPlay(0, true);
        });
        portfolioContainer.addEventListener('mouseleave', function() {
          portfolioAnim.setSpeed(1);
          // When hover anim completes, resume CSS spin
          portfolioAnim.addEventListener('complete', function onHoverEnd() {
            portfolioAnim.removeEventListener('complete', onHoverEnd);
            portfolioEl.style.animation = 'portfolio-spin 8s linear infinite';
          });
        });
      }
    }

  })();

