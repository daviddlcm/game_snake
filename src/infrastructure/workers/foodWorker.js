let isPaused = false;

self.addEventListener("message", (e) => {
    const { action, data } = e.data;

    if (action === "pause") {
        isPaused = true;
    } else if (action === "resume") {
        isPaused = false;
    }

    if (action === "reposition" && !isPaused) {
        const { validLocations } = data;
        if (validLocations && validLocations.length > 0) {
            const pos = validLocations[Math.floor(Math.random() * validLocations.length)];
            self.postMessage({ action: "repositioned", position: pos });
        }
    }

    if (action === "eat" && !isPaused) {
        self.total++;
        self.postMessage({ action: "eaten", total: self.total });
    }
});
