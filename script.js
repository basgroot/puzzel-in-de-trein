(function () {
    const originalList = document.getElementById("idOutput").value.split("\n").sort();

    function replaceSpecialChars(text) {
        let result = text.trim().toLowerCase().replace(/ /g, "");
        result = result.replace(/äàáâ/g, "a");
        result = result.replace(/ëèéê/g, "e");
        result = result.replace(/ïìíî/g, "i");
        result = result.replace(/üùúû/g, "u");
        result = result.replace(/öòóô/g, "o");
        result = result.replace(/-/g, "");
        result = result.replace(/y/g, "ij");
        return result;
    }

    function filterStations() {
        const stations = [];
        originalList.forEach(function (line) {
            stations.push({
                "match": true,
                "originalName": line.trim(),
                "search": replaceSpecialChars(line)
            });
        });

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
        document.getElementById("idInput").addEventListener("input", filterStations);
        document.getElementById("idInput").addEventListener("keypress", filterStations);
        filterStations();
    }

    initialize();

}());