// BlockWorker.js
self.addEventListener("message", (e) => {
    const { action, data } = e.data;

    if (action === "reposition") {
        const { validLocations } = data;
        if (validLocations && validLocations.length > 0) {
            const pos = validLocations[Math.floor(Math.random() * validLocations.length)];
            self.postMessage({ action: "repositioned", position: pos });
        }
    }
});
