const createDebounceFunction = (someCallback, time) => {
    validateArguments(someCallback, time);
    let timerId = null;
    return function (...args) {
        if (timerId) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(() => someCallback(...args), time);
    };
};

const validateArguments = (callback, time) => {
    if (typeof callback !== "function") {
        throw new Error("Invalid argument.");
    }
    if (typeof time !== "number" || isNaN(time) || !isFinite(time) || time < 0 || !Number.isInteger(time)) {
        throw new Error("Invalid argument.");
    }
};

class RickAndMorty {
    getCharacter(characterId) {
        validateId(characterId);
        return fetch(`https://rickandmortyapi.com/api/character/${characterId}`)
            .then((response) => {
                if (response.status >= 400) {
                    return null;
                } else if (response.status == 200) {
                    return response.json();
                }
            })
            .then((character) => character)
            .catch((error) => {
                return null;
            });
    }

    async getEpisode(episodeId) {
        validateId(episodeId);
        try {
            const response = await fetch(`https://rickandmortyapi.com/api/episode/${episodeId}`);
            if (response.status >= 400) {
                return null;
            } else if (response.status == 200) {
                return await response.json();
            }
        } catch (error) {
            return null;
        }
    }
}

const validateId = (id) => {
    if (typeof id !== "number" || isNaN(id) || !isFinite(id) || id < 0 || !Number.isInteger(id)) {
        throw new Error("Invalid argument id");
    }
};
