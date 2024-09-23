onmessage = function(e) {
    const { action, data } = e.data;

    if (action === "setBlockPosition") {
        const { validPositions } = data;

        if (validPositions && validPositions.length > 0) {
            const randomPositions = [];
            while (randomPositions.length < 2) { 
                const randomIndex = Math.floor(Math.random() * validPositions.length);
                const randomPosition = validPositions[randomIndex];
                if (!randomPositions.some(pos => pos.x === randomPosition.x && pos.y === randomPosition.y)) {
                    randomPositions.push(randomPosition);
                }
            }

            postMessage({
                action: "blockPositions",
                positions: randomPositions
            });
        } else {
            postMessage({
                action: "error",
                message: "No valid positions available for the blocks."
            });
        }
    }
};
