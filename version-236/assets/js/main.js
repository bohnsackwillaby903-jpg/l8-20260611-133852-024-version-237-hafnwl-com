(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        current = (index + slides.length) % slides.length;

        slides.forEach(function (slide, i) {
            slide.classList.toggle('is-active', i === current);
        });

        dots.forEach(function (dot, i) {
            dot.classList.toggle('is-active', i === current);
        });
    }

    if (slides.length) {
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                showSlide(i);
            });
        });

        setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    var filterForms = Array.prototype.slice.call(document.querySelectorAll('[data-filter-form]'));

    filterForms.forEach(function (form) {
        var cards = Array.prototype.slice.call(document.querySelectorAll('.filter-card'));
        var empty = document.querySelector('[data-empty-state]');
        var inputs = Array.prototype.slice.call(form.querySelectorAll('input, select'));

        function normalize(value) {
            return String(value || '').trim().toLowerCase();
        }

        function update() {
            var keyword = normalize(form.querySelector('[name="keyword"]') && form.querySelector('[name="keyword"]').value);
            var region = normalize(form.querySelector('[name="region"]') && form.querySelector('[name="region"]').value);
            var type = normalize(form.querySelector('[name="type"]') && form.querySelector('[name="type"]').value);
            var year = normalize(form.querySelector('[name="year"]') && form.querySelector('[name="year"]').value);
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-genre')
                ].join(' '));
                var matched = true;

                if (keyword && haystack.indexOf(keyword) === -1) {
                    matched = false;
                }

                if (region && normalize(card.getAttribute('data-region')).indexOf(region) === -1) {
                    matched = false;
                }

                if (type && normalize(card.getAttribute('data-type')).indexOf(type) === -1) {
                    matched = false;
                }

                if (year && normalize(card.getAttribute('data-year')) !== year) {
                    matched = false;
                }

                card.classList.toggle('hidden-card', !matched);
                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        }

        inputs.forEach(function (input) {
            input.addEventListener('input', update);
            input.addEventListener('change', update);
        });
    });
})();
