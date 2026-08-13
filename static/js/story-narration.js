document.addEventListener('DOMContentLoaded', function () {
    const listenBtn = document.getElementById('listen-story-btn');
    if (!listenBtn) return;

    const controls = document.getElementById('story-controls');
    const pauseBtn = document.getElementById('story-pause-btn');
    const stopBtn = document.getElementById('story-stop-btn');

    if (!('speechSynthesis' in window)) {
        listenBtn.disabled = true;
        listenBtn.title = 'Text-to-speech is not supported in this browser';
        return;
    }

    listenBtn.addEventListener('click', function () {
        const text = listenBtn.dataset.text;
        if (!text) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1;

        utterance.onstart = () => {
            listenBtn.innerHTML = '<i class="fas fa-volume-up"></i> Narrating...';
            listenBtn.disabled = true;
            controls.style.display = 'block';
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        };
        utterance.onend = resetPlayer;
        utterance.onerror = resetPlayer;

        window.speechSynthesis.speak(utterance);
    });

    pauseBtn.addEventListener('click', function () {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
            pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
        } else if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        }
    });

    stopBtn.addEventListener('click', function () {
        window.speechSynthesis.cancel();
        resetPlayer();
    });

    function resetPlayer() {
        listenBtn.innerHTML = '<i class="fas fa-headphones"></i> Listen to Story';
        listenBtn.disabled = false;
        controls.style.display = 'none';
    }
});