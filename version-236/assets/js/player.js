(function () {
    var player = document.querySelector('[data-video-player]');
    if (!player) {
        return;
    }

    var video = player.querySelector('video');
    var button = player.querySelector('[data-play-button]');
    var streamUrl = player.getAttribute('data-stream');
    var hlsInstance = null;

    function attachStream() {
        if (!video || !streamUrl) {
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            if (video.getAttribute('src') !== streamUrl) {
                video.setAttribute('src', streamUrl);
            }
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            if (!hlsInstance) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
            }
        }
    }

    function playVideo() {
        attachStream();
        player.classList.add('is-playing');
        var playPromise = video.play();

        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {});
        }
    }

    if (button) {
        button.addEventListener('click', playVideo);
    }

    video.addEventListener('click', function () {
        if (video.paused) {
            playVideo();
        }
    });

    video.addEventListener('play', function () {
        player.classList.add('is-playing');
    });
})();
