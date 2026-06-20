(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var nav = document.querySelector('[data-site-nav]');
  var headerSearch = document.querySelector('.header-search');

  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      nav.classList.toggle('open');
      if (headerSearch) {
        headerSearch.classList.toggle('open');
      }
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function startHero() {
      clearInterval(timer);
      timer = setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        startHero();
      });
    });

    startHero();
  }

  var liveFilter = document.querySelector('[data-live-filter]');
  var cardList = document.querySelector('[data-card-list]');
  var sortSelect = document.querySelector('[data-sort-cards]');

  function getCards() {
    if (!cardList) {
      return [];
    }
    return Array.prototype.slice.call(cardList.children).filter(function (item) {
      return item.matches('.movie-card, .rank-card');
    });
  }

  function cardText(card) {
    return [
      card.getAttribute('data-title') || '',
      card.getAttribute('data-year') || '',
      card.getAttribute('data-genre') || '',
      card.getAttribute('data-region') || ''
    ].join(' ').toLowerCase();
  }

  function applyFilter() {
    if (!liveFilter) {
      return;
    }
    var query = liveFilter.value.trim().toLowerCase();
    getCards().forEach(function (card) {
      card.hidden = query && cardText(card).indexOf(query) === -1;
    });
  }

  function applySort() {
    if (!sortSelect || !cardList) {
      return;
    }
    var value = sortSelect.value;
    var cards = getCards();
    cards.sort(function (a, b) {
      if (value === 'title') {
        return (a.getAttribute('data-title') || '').localeCompare(b.getAttribute('data-title') || '', 'zh-CN');
      }
      var key = value === 'year' ? 'data-year' : value === 'rating' ? 'data-rating' : 'data-hot';
      var av = parseFloat(a.getAttribute(key) || '0');
      var bv = parseFloat(b.getAttribute(key) || '0');
      return bv - av;
    });
    cards.forEach(function (card) {
      cardList.appendChild(card);
    });
    applyFilter();
  }

  if (liveFilter) {
    liveFilter.addEventListener('input', applyFilter);
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', applySort);
  }

  var searchInput = document.querySelector('[data-search-input]');
  var searchResults = document.querySelector('[data-search-results]');
  var searchTitle = document.querySelector('[data-search-title]');

  function currentPrefix() {
    var path = window.location.pathname;
    return path.indexOf('/category/') !== -1 || path.indexOf('/movie/') !== -1 ? '../' : './';
  }

  function createSearchCard(movie, prefix) {
    return [
      '<article class="movie-card" data-title="' + escapeHtml(movie.title) + '" data-year="' + escapeHtml(movie.year) + '" data-genre="' + escapeHtml(movie.genre) + '" data-region="' + escapeHtml(movie.region) + '" data-hot="' + movie.heat + '" data-rating="' + movie.rating + '">',
      '  <a class="movie-poster" href="' + prefix + 'movie/' + movie.id + '.html" aria-label="' + escapeHtml(movie.title) + ' 在线观看">',
      '    <img src="' + prefix + movie.posterIndex + '.jpg" alt="' + escapeHtml(movie.title) + '" loading="lazy" onerror="this.style.display=\'none\';this.parentElement.classList.add(\'image-ready\');">',
      '    <span class="movie-score">' + movie.rating + '</span>',
      '    <span class="movie-duration">' + escapeHtml(movie.duration) + '</span>',
      '  </a>',
      '  <div class="movie-info">',
      '    <div class="movie-meta">',
      '      <a href="' + prefix + 'category/' + movie.categorySlug + '.html">' + escapeHtml(movie.category) + '</a>',
      '      <span>' + escapeHtml(movie.year) + '</span>',
      '    </div>',
      '    <h3><a href="' + prefix + 'movie/' + movie.id + '.html">' + escapeHtml(movie.title) + '</a></h3>',
      '    <p>' + escapeHtml(shorten(movie.oneLine, 70)) + '</p>',
      '    <div class="card-tags">',
      '      <span>' + escapeHtml(movie.type) + '</span>',
      '      <span>' + escapeHtml(movie.region) + '</span>',
      '    </div>',
      '  </div>',
      '</article>'
    ].join('\n');
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, function (mark) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[mark];
    });
  }

  function shorten(value, size) {
    var text = String(value || '').replace(/\s+/g, ' ').trim();
    if (text.length <= size) {
      return text;
    }
    return text.slice(0, size).replace(/[，。；、\s]+$/, '') + '…';
  }

  function renderSearch() {
    if (!searchResults || typeof movieList === 'undefined') {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim();
    if (searchInput) {
      searchInput.value = query;
    }
    if (!query) {
      searchResults.innerHTML = '';
      if (searchTitle) {
        searchTitle.textContent = '输入关键词开始搜索';
      }
      return;
    }
    var words = query.toLowerCase().split(/\s+/).filter(Boolean);
    var results = movieList.filter(function (movie) {
      var text = [
        movie.title,
        movie.year,
        movie.region,
        movie.type,
        movie.genre,
        movie.category,
        (movie.tags || []).join(' '),
        movie.oneLine
      ].join(' ').toLowerCase();
      return words.every(function (word) {
        return text.indexOf(word) !== -1;
      });
    }).sort(function (a, b) {
      return b.heat - a.heat;
    }).slice(0, 96);
    if (searchTitle) {
      searchTitle.textContent = '“' + query + '”相关影视';
    }
    searchResults.innerHTML = results.map(function (movie) {
      return createSearchCard(movie, currentPrefix());
    }).join('\n');
  }

  renderSearch();

  var player = document.querySelector('[data-player]');
  if (player) {
    var video = player.querySelector('video');
    var button = player.querySelector('[data-play-button]');
    var url = player.getAttribute('data-video-url');
    var ready = false;
    var instance = null;

    function prepareVideo() {
      if (ready || !video || !url) {
        return;
      }
      ready = true;
      if (window.Hls && window.Hls.isSupported()) {
        instance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        instance.loadSource(url);
        instance.attachMedia(video);
      } else {
        video.src = url;
      }
    }

    function startVideo() {
      prepareVideo();
      player.classList.add('playing');
      video.setAttribute('controls', 'controls');
      var playTask = video.play();
      if (playTask && typeof playTask.catch === 'function') {
        playTask.catch(function () {
          player.classList.remove('playing');
        });
      }
    }

    if (button) {
      button.addEventListener('click', startVideo);
    }

    player.addEventListener('click', function (event) {
      if (event.target === video || event.target === player) {
        startVideo();
      }
    });

    video.addEventListener('play', function () {
      player.classList.add('playing');
    });

    video.addEventListener('pause', function () {
      if (video.currentTime === 0) {
        player.classList.remove('playing');
      }
    });

    video.addEventListener('error', function () {
      if (instance) {
        instance.destroy();
        instance = null;
      }
      ready = false;
      video.src = url;
    }, { once: true });
  }
})();
