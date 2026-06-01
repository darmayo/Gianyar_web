(function () {
  try {
    var darkMode = localStorage.getItem('darkMode');
    var prefersDark = window.matchMedia('(prefers-color-scheme:dark)').matches;
    if (darkMode === 'true' || (darkMode === null && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch (_) {}

  try {
    var nextObj;
    Object.defineProperty(window, 'next', {
      configurable: true,
      enumerable: true,
      get: function () { return nextObj; },
      set: function (value) {
        if (value && typeof value === 'object') {
          value.version = '';
          if (value.buildId) value.buildId = '';
        }
        nextObj = value;
      },
    });
  } catch (_) {
    document.addEventListener('DOMContentLoaded', function () {
      if (window.next) window.next.version = '';
    });
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    });
  }
})();
