(function () {
    function normalize(value) {
        return String(value || "").toLowerCase();
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function card(movie) {
        var title = escapeHtml(movie.title);
        var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
            return "<span>" + escapeHtml(tag) + "</span>";
        }).join("");
        return [
            "<article class="movie-card" data-title="" + title + "" data-year="" + escapeHtml(movie.year) + "" data-category="" + escapeHtml(movie.category) + "">",
            "<a class="poster" href="" + escapeHtml(movie.link) + "" aria-label="观看" + title + "">",
            "<img src="" + escapeHtml(movie.cover) + "" alt="" + title + "" loading="lazy">",
            "<span class="play-dot">▶</span>",
            "</a>",
            "<div class="movie-card-body">",
            "<a class="movie-title" href="" + escapeHtml(movie.link) + "">" + title + "</a>",
            "<div class="movie-meta"><span>" + escapeHtml(movie.year) + "</span><span>" + escapeHtml(movie.region) + "</span><span>" + escapeHtml(movie.type) + "</span></div>",
            "<p>" + escapeHtml(movie.oneLine || "") + "</p>",
            "<div class="tag-row">" + tags + "</div>",
            "</div>",
            "</article>"
        ].join("");
    }

    function runSearch() {
        var input = document.querySelector("[data-search-input]");
        var type = document.querySelector("[data-search-type]");
        var year = document.querySelector("[data-search-year]");
        var results = document.querySelector("[data-search-results]");
        var count = document.querySelector("[data-search-count]");
        if (!input || !results || !window.MOVIE_INDEX) {
            return;
        }
        function apply() {
            var q = normalize(input.value.trim());
            var t = type && type.value || "";
            var y = year && year.value || "";
            var matched = window.MOVIE_INDEX.filter(function (movie) {
                var haystack = normalize(movie.title + " " + movie.oneLine + " " + movie.genre + " " + (movie.tags || []).join(" "));
                if (q && haystack.indexOf(q) === -1) {
                    return false;
                }
                if (t && movie.type !== t) {
                    return false;
                }
                if (y && String(movie.year) !== y) {
                    return false;
                }
                return true;
            }).slice(0, 120);
            count.textContent = "找到 " + matched.length + " 条结果";
            results.innerHTML = matched.length ? matched.map(card).join("") : "<div class="empty-state">没有找到匹配影片，请尝试更换关键词。</div>";
        }
        var params = new URLSearchParams(window.location.search);
        if (params.get("q")) {
            input.value = params.get("q");
        }
        [input, type, year].forEach(function (control) {
            if (control) {
                control.addEventListener("input", apply);
                control.addEventListener("change", apply);
            }
        });
        apply();
    }

    if (document.readyState !== "loading") {
        runSearch();
    } else {
        document.addEventListener("DOMContentLoaded", runSearch);
    }
})();
