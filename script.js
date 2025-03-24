async function fetchWordInfo() {
    let userInput = document.getElementById("userInput").value.trim().toLowerCase();
    if (userInput === "") {
        alert("Please enter a word.");
        return;
    }

    const dictionaryAPI = `https://api.datamuse.com/sug?s=${userInput}`;

    try {
        let response = await fetch(dictionaryAPI);
        let suggestions = await response.json();

        if (!suggestions.length) {
            alert("No suggestions found. Please try another word.");
            return;
        }

        let correctedWord = suggestions[0].word;

        if (correctedWord !== userInput) {
            let confirmCorrection = confirm(`Did you mean: "${correctedWord}"?`);
            if (!confirmCorrection) return;
        }

        let meaningResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${correctedWord}`);
        let meaningData = await meaningResponse.json();

        if (!meaningData || meaningData.title) {
            alert("Word not found in dictionary.");
            return;
        }

        let meaning = meaningData[0].meanings[0].definitions[0].definition || "No definition available.";
        let extraInfo = meaningData[0].meanings[0].partOfSpeech || "Unknown";

        document.getElementById("wordTitle").textContent = correctedWord;
        document.getElementById("wordMeaning").textContent = meaning;
        document.getElementById("extraInfo").textContent = `Part of Speech: ${extraInfo}`;

        // Fetch image from Wikipedia API
        const wikiAPI = `https://en.wikipedia.org/api/rest_v1/page/summary/${correctedWord}`;
        let wikiResponse = await fetch(wikiAPI);
        let wikiData = await wikiResponse.json();

        if (wikiData.originalimage) {
            let imageUrl = wikiData.originalimage.source;
            document.body.style.backgroundImage = `url('${imageUrl}')`;
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundPosition = "center";
            document.body.style.backgroundRepeat = "no-repeat";
        } else {
            console.warn("No image found for this word on Wikipedia.");
        }

        // Wikipedia link for more info
        document.getElementById("wikiLink").href = `https://en.wikipedia.org/wiki/${correctedWord}`;
        document.getElementById("wikiLink").classList.remove("hidden");

        // Show results
        document.querySelectorAll(".result").forEach(el => el.classList.remove("hidden"));

    } catch (error) {
        console.error("Error fetching word data:", error);
        alert("An error occurred. Please check your internet connection or try again later.");
    }
}
