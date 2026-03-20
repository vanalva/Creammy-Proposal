/**
 * Native tab switcher — replaces Webflow's w-tabs JS.
 * Works with the existing w-tabs / w-tab-link / w-tab-pane HTML structure.
 */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.w-tabs').forEach(function (tabGroup) {
    var links = tabGroup.querySelectorAll('.w-tab-link');
    var panes = tabGroup.querySelectorAll('.w-tab-pane');

    links.forEach(function (link, i) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        links.forEach(function (l) { l.classList.remove('w--current'); });
        panes.forEach(function (p) { p.classList.remove('w--tab-active'); });
        link.classList.add('w--current');
        if (panes[i]) panes[i].classList.add('w--tab-active');
      });
    });
  });
});
