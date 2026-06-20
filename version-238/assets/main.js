(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var backTop = document.querySelector('[data-back-top]');

  if (backTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 360) {
        backTop.classList.add('is-visible');
      } else {
        backTop.classList.remove('is-visible');
      }
    });

    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var globalForms = document.querySelectorAll('[data-global-search-form]');

  globalForms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('[data-global-search]');
      var query = input ? input.value.trim() : '';
      var target = 'library.html';
      if (query) {
        target += '?q=' + encodeURIComponent(query);
      }
      window.location.href = target;
    });
  });

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function readQuery() {
    var params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  }

  function setupFilters() {
    var panel = document.querySelector('[data-filter-panel]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    var empty = document.querySelector('[data-empty-state]');

    if (!panel || !cards.length) {
      return;
    }

    var searchInput = panel.querySelector('[data-search-input]');
    var typeSelect = panel.querySelector('[data-filter-type]');
    var yearSelect = panel.querySelector('[data-filter-year]');
    var categorySelect = panel.querySelector('[data-filter-category]');
    var query = readQuery();

    if (searchInput && query) {
      searchInput.value = query;
    }

    function matchYear(cardYear, selectedYear) {
      if (!selectedYear) {
        return true;
      }
      var year = parseInt(cardYear, 10) || 0;
      var selected = parseInt(selectedYear, 10) || 0;
      if (selectedYear === '2020') {
        return year >= 2020;
      }
      return year === selected;
    }

    function applyFilters() {
      var search = normalize(searchInput ? searchInput.value : '');
      var type = normalize(typeSelect ? typeSelect.value : '');
      var year = yearSelect ? yearSelect.value : '';
      var category = categorySelect ? categorySelect.value : '';
      var shown = 0;

      cards.forEach(function (card) {
        var data = normalize(card.getAttribute('data-search'));
        var cardType = normalize(card.getAttribute('data-type'));
        var cardYear = card.getAttribute('data-year') || '';
        var cardCategory = card.getAttribute('data-category') || '';
        var ok = true;

        if (search && data.indexOf(search) === -1) {
          ok = false;
        }

        if (type && cardType.indexOf(type) === -1) {
          ok = false;
        }

        if (!matchYear(cardYear, year)) {
          ok = false;
        }

        if (category && cardCategory !== category) {
          ok = false;
        }

        card.hidden = !ok;

        if (ok) {
          shown += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', shown === 0);
      }
    }

    [searchInput, typeSelect, yearSelect, categorySelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    applyFilters();
  }

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    if (slides.length < 2) {
      return;
    }

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
      });
    });

    window.setInterval(function () {
      show(current + 1);
    }, 5200);
  }

  setupFilters();
  setupHero();
})();
