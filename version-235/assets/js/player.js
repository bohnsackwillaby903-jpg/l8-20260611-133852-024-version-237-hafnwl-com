function initMoviePlayer(source) {
  var video = document.getElementById("video-player");
  var trigger = document.querySelector("[data-player-trigger]");
  var started = false;
  var hlsInstance = null;

  if (!video || !source) {
    return;
  }

  var attachSource = function () {
    if (started) {
      return;
    }

    started = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
    } else if (window.Hls && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
    } else {
      video.src = source;
    }
  };

  var play = function () {
    attachSource();

    if (trigger) {
      trigger.classList.add("is-hidden");
    }

    var promise = video.play();

    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {});
    }
  };

  if (trigger) {
    trigger.addEventListener("click", play);
  }

  video.addEventListener("click", function () {
    if (!started) {
      play();
    }
  });

  video.addEventListener("play", function () {
    if (trigger) {
      trigger.classList.add("is-hidden");
    }
  });

  window.addEventListener("beforeunload", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
