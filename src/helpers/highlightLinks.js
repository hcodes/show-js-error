export function highlightLinks(text) {
    return text.replace(/(at | \(|@)(https?|file)(:.*?)(?=:\d+:\d+\)?$)/gm, function($0, $1, $2, $3) {
        var url = $2 + $3;

        return $1 + '<a target="_blank" href="' + url + '">' + url + '</a>';
    });
}
