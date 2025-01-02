(function () {
    const originalList = document.getElementById("idStations").value.split("\n").sort();

    function replaceDiacritics(text) {
        let result = text.toLowerCase();
        result = result.replace(/[äàáâ]/g, "a");
        result = result.replace(/[ëèéê]/g, "e");
        result = result.replace(/[ïìíî]/g, "i");
        result = result.replace(/[üùúû]/g, "u");
        result = result.replace(/[öòóô]/g, "o");
        return result;
    }

    function replaceSpecialChars(text) {
        let result = text.toLowerCase().replace(/[- ']/g, "");
        result = result.replace(/y/g, "ij");
        return result;
    }

    function filterStations() {
        const stations = [];
        originalList.forEach(function (line) {
            stations.push({
                "match": true,  // Be positive
                "originalName": line.trim(),
                "withoutSpaces": replaceDiacritics(replaceSpecialChars(line)),
                "search": replaceDiacritics(replaceSpecialChars(line))
            });
        });

        function sortByWordLength(a, b) {
            if (input.length === 0 || a.withoutSpaces.length === b.withoutSpaces.length) {
                return a.originalName.localeCompare(b.originalName);
            }
            return (input.length - b.withoutSpaces.length) - (input.length - a.withoutSpaces.length);
        }

        function highlightDifferences(stationToAdd) {
            // If there is not an exact station match, make the missing characters red
            const stationToAddEncoded = replaceDiacritics(stationToAdd);
            let remainingInput = replaceDiacritics(document.getElementById("idInput").value);
            let result = "";
            let index = 0;
            let pos;
            for (const character of stationToAddEncoded) {
                pos = remainingInput.indexOf(character);
                if (pos === -1) {
                    result += "<span class='missing'>" + stationToAdd[index] + "</span>";
                } else {
                    result += stationToAdd[index];
                    remainingInput = remainingInput.slice(0, pos) + remainingInput.slice(pos + 1, remainingInput.length)
                }
                index += 1;
            }
            return result;
        }

        const input = replaceDiacritics(replaceSpecialChars(document.getElementById("idInput").value));

        input.split("").forEach(function (char) {
            stations.forEach(function (station) {
                if (station.match) {
                    // Verify if the character is in the search string
                    if (station.search.indexOf(char) === -1) {
                        station.match = false;
                    } else {
                        // Remove the matching character from the search string
                        station.search = station.search.replace(char, "");
                    }
                }
            });
        });
        // Sort by length, to get the words with matching length on top (Long Hee)
        stations.sort(sortByWordLength);
        let output = "";
        stations.forEach(function (station) {
            if (station.match) {
                if (output.length > 0) {
                    output += "<br>";
                }
                output += highlightDifferences(station.originalName);
            }
        });
        if (output.length === 0) {
            output = "Geen station met deze letters gevonden. Is de naam goet geschreven?";
        }
        document.getElementById("idOutput").innerHTML = output;
    }

    function initialize() {
        // Create the oninput handler for the input
        const inputElm = document.getElementById("idInput");
        inputElm.addEventListener("input", filterStations);
        inputElm.addEventListener("keypress", filterStations);
        filterStations();
        // Select all text in the input field and focus that
        inputElm.select();
        inputElm.focus();
    }

    initialize();

}());