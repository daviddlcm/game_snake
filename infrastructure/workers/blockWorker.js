onmessage = function(e) {
    const { action, data } = e.data;
    if (action === "reposition") {
        const validLocations = data.validLocations;
        const newPosition = validLocations[Math.floor(Math.random() * validLocations.length)];
        postMessage({ action: "repositioned", position: newPosition });
    }
};