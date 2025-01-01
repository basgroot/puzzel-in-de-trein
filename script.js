(function () {
    const originalList = document.getElementById("idOutput").value.split("\n").sort();

    function replaceSpecialChars(text) {
        let result = text.trim().toLowerCase().replace(/ /g, "");
        result = result.replace(/[äàáâ]/g, "a");
        result = result.replace(/[ëèéê]/g, "e");
        result = result.replace(/[ïìíî]/g, "i");
        result = result.replace(/[üùúû]/g, "u");
        result = result.replace(/[öòóô]/g, "o");
        result = result.replace(/-/g, "");
        result = result.replace(/y/g, "ij");
        return result;
    }

    function filterStations() {
        const stations = [];
        originalList.forEach(function (line) {
            stations.push({
                "match": true,  // Be positive
                "originalName": line.trim(),
                "withoutSpaces": replaceSpecialChars(line).replace(/[-']/g, ""),
                "search": replaceSpecialChars(line)
            });
        });

        function sortByWordLength(a, b) {
            if (input.length === 0 || a.withoutSpaces.length === b.withoutSpaces.length) {
                return a.originalName.localeCompare(b.originalName);
            }
            return (input.length - b.withoutSpaces.length) - (input.length - a.withoutSpaces.length);
        }

        const input = replaceSpecialChars(document.getElementById("idInput").value);

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
                output += station.originalName + "\n";
            }
        });
        document.getElementById("idOutput").value = output.trim();
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