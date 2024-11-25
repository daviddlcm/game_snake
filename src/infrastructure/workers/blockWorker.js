let isPaused = false;

onmessage = function (e) {
    const { action, data } = e.data;

    if (action === "pause") {
        isPaused = true;
    } else if (action === "resume") {
        isPaused = false;
    }

    if (action === "reposition" && !isPaused) {
        const validLocations = data.validLocations;
        const newPosition = validLocations[Math.floor(Math.random() * validLocations.length)];
        postMessage({ action: "repositioned", position: newPosition });
    }
};
