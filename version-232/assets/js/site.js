(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
        } else {
            document.addEventListener("DOMContentLoaded", callback);
        }
    }

    function setupMenu() {
        var toggle = document.querySelector(".menu-toggle");
        var nav = document.querySelector(".mobile-nav");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            nav.classList.toggle("open");
        });
    }

    function setupImageFallbacks() {
        document.querySelectorAll("img").forEach(function (img) {
            img.addEventListener("error", function () {
                img.style.opacity = "0";
                var parent = img.parentElement;
                if (parent) {
                    parent.style.background = "linear-gradient(135deg, rgba(6, 182, 212, 0.24), rgba(37, 99, 235, 0.18)), #0f172a";
                }
            }, { once: true });
        });
    }

    function setupHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-bg"));
        var cards = Array.prototype.slice.call(document.querySelectorAll(".hero-mini-card"));
        var title = document.querySelector("[data-hero-title]");
        var desc = document.querySelector("[data-hero-desc]");
        var rating = document.querySelector("[data-hero-rating]");
        var duration = document.querySelector("[data-hero-duration]");
        var category = document.querySelector("[data-hero-category]");
        var link = document.querySelector("[data-hero-link]");
        if (!slides.length || !cards.length || !title) {
            return;
        }
        var index = 0;
        function show(next) {
            index = next % cards.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("active", i === index);
            });
            cards.forEach(function (card, i) {
                card.classList.toggle("active", i === index);
            });
            var card = cards[index];
            title.textContent = card.getAttribute("data-title") || "";
            desc.textContent = card.getAttribute("data-desc") || "";
            rating.textContent = card.getAttribute("data-rating") || "";
            duration.textContent = card.getAttribute("data-duration") || "";
            category.textContent = card.getAttribute("data-category") || "";
            link.setAttribute("href", card.getAttribute("data-link") || "#");
        }
        cards.forEach(function (card, i) {
            card.addEventListener("click", function () {
                show(i);
            });
        });
        show(0);
        window.setInterval(function () {
            show(index + 1);
        }, 5200);
    }

    function setupFilters() {
        var panel = document.querySelector("[data-filter-panel]");
        var grid = document.querySelector("[data-filter-grid]");
        if (!panel || !grid) {
            return;
        }
        var keyword = panel.querySelector("[name='keyword']");
        var year = panel.querySelector("[name='year']");
        var category = panel.querySelector("[name='category']");
        var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
        function apply() {
            var q = (keyword && keyword.value || "").trim().toLowerCase();
            var y = year && year.value || "";
            var c = category && category.value || "";
            cards.forEach(function (card) {
                var ok = true;
                if (q && (card.getAttribute("data-title") || "").toLowerCase().indexOf(q) === -1) {
                    ok = false;
                }
                if (y && card.getAttribute("data-year") !== y) {
                    ok = false;
                }
                if (c && card.getAttribute("data-category") !== c) {
                    ok = false;
                }
                card.style.display = ok ? "" : "none";
            });
        }
        panel.addEventListener("submit", function (event) {
            event.preventDefault();
            apply();
        });
        [keyword, year, category].forEach(function (control) {
            if (control) {
                control.addEventListener("input", apply);
                control.addEventListener("change", apply);
            }
        });
    }

    function setupPlayer() {
        var player = document.querySelector("[data-player]");
        if (!player) {
            return;
        }
        var video = player.querySelector("video");
        var button = player.querySelector(".player-button");
        var source = player.getAttribute("data-video-url");
        var initialized = false;
        function init() {
            if (initialized || !source || !video) {
                return;
            }
            initialized = true;
            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({ enableWorker: true });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else {
                video.src = source;
            }
        }
        function play() {
            init();
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {});
            }
            player.classList.add("playing");
        }
        if (button) {
            button.addEventListener("click", play);
        }
        video.addEventListener("play", function () {
            player.classList.add("playing");
        });
        video.addEventListener("pause", function () {
            player.classList.remove("playing");
        });
    }

    ready(function () {
        setupMenu();
        setupImageFallbacks();
        setupHero();
        setupFilters();
        setupPlayer();
    });
})();
