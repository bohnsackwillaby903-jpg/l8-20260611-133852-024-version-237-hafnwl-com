document.addEventListener("DOMContentLoaded", function () {
  var navToggle = document.querySelector("[data-nav-toggle]");
  var navMenu = document.querySelector("[data-nav-menu]");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("is-open");
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var current = 0;

    var showSlide = function (index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    };

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
      });
    });

    setInterval(function () {
      showSlide(current + 1);
    }, 5600);
  }

  Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]")).forEach(function (scope) {
    var search = scope.querySelector("[data-search]");
    var year = scope.querySelector("[data-year]");
    var region = scope.querySelector("[data-region]");
    var sort = scope.querySelector("[data-sort]");
    var count = scope.querySelector("[data-result-count]");
    var grid = scope.querySelector(".searchable-grid");

    if (!grid) {
      return;
    }

    var cards = Array.prototype.slice.call(grid.children);

    var yearMatches = function (cardYear, value) {
      var number = parseInt(cardYear || "0", 10);
      if (value === "all") {
        return true;
      }
      if (value === "2025+") {
        return number >= 2025;
      }
      if (value === "2020+") {
        return number >= 2020;
      }
      if (value === "2010+") {
        return number >= 2010;
      }
      if (value === "2000+") {
        return number >= 2000;
      }
      if (value === "older") {
        return number > 0 && number < 2000;
      }
      return true;
    };

    var apply = function () {
      var keyword = (search && search.value ? search.value : "").trim().toLowerCase();
      var yearValue = year ? year.value : "all";
      var regionValue = region ? region.value : "all";
      var visible = 0;

      cards.forEach(function (card) {
        var text = [
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-tags")
        ].join(" ").toLowerCase();
        var okKeyword = !keyword || text.indexOf(keyword) !== -1;
        var okYear = yearMatches(card.getAttribute("data-year"), yearValue);
        var okRegion = regionValue === "all" || (card.getAttribute("data-region") || "").indexOf(regionValue) !== -1;
        var ok = okKeyword && okYear && okRegion;
        card.classList.toggle("is-hidden", !ok);
        if (ok) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = String(visible);
      }
    };

    var sortCards = function () {
      var value = sort ? sort.value : "year-desc";
      cards.sort(function (a, b) {
        var ay = parseInt(a.getAttribute("data-year") || "0", 10);
        var by = parseInt(b.getAttribute("data-year") || "0", 10);
        var at = a.getAttribute("data-title") || "";
        var bt = b.getAttribute("data-title") || "";

        if (value === "year-asc") {
          return ay - by || at.localeCompare(bt, "zh-CN");
        }
        if (value === "title-asc") {
          return at.localeCompare(bt, "zh-CN");
        }
        return by - ay || at.localeCompare(bt, "zh-CN");
      });
      cards.forEach(function (card) {
        grid.appendChild(card);
      });
      apply();
    };

    [search, year, region].forEach(function (control) {
      if (control) {
        control.addEventListener("input", apply);
        control.addEventListener("change", apply);
      }
    });

    if (sort) {
      sort.addEventListener("change", sortCards);
    }

    sortCards();
  });
});
