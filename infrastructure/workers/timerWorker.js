let elapsedTime = 0;
let isPaused = false;

self.addEventListener('message', (e) => {
    const { action, currentTime } = e.data;

    if (action === 'start') {
        elapsedTime = 0; 
        isPaused = false;
        setInterval(() => {
            if (!isPaused) {
                elapsedTime++;
                const minutes = Math.floor(elapsedTime / 60);
                const seconds = elapsedTime % 60;
                self.postMessage({ minutes, seconds });
            }
        }, 1000);
    } else if (action === 'pause') {
        isPaused = true;
    } else if (action === 'resume') {
        isPaused = false;
    }
});
