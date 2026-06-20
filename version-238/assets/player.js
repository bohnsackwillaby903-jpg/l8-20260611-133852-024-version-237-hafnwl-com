(function () {
  var video = document.querySelector('[data-video-player]');
  var playButton = document.querySelector('[data-play-button]');
  var message = document.querySelector('[data-player-message]');

  if (!video) {
    return;
  }

  var source = video.getAttribute('data-video-src');
  var hlsInstance = null;
  var initialized = false;

  function setMessage(text) {
    if (message) {
      message.textContent = text || '';
    }
  }

  function initializePlayer() {
    if (initialized || !source) {
      return;
    }

    initialized = true;

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          setMessage('当前网络环境暂时无法加载视频，请稍后重试');
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else {
      video.src = source;
    }
  }

  function playVideo() {
    initializePlayer();
    setMessage('');
    var request = video.play();

    if (request && typeof request.catch === 'function') {
      request.catch(function () {
        setMessage('点击播放器即可继续播放');
      });
    }
  }

  if (playButton) {
    playButton.addEventListener('click', function () {
      playVideo();
    });
  }

  video.addEventListener('play', function () {
    if (playButton) {
      playButton.classList.add('is-hidden');
    }
  });

  video.addEventListener('pause', function () {
    if (video.currentTime === 0 && playButton) {
      playButton.classList.remove('is-hidden');
    }
  });

  video.addEventListener('click', function () {
    if (video.paused) {
      playVideo();
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
})();
