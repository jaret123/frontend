if (typeof console === "undefined" || typeof console.log === "undefined") {
    var alertFallback = false;
    console = {};
    if (alertFallback) {
        console.log = function (msg) {
            alert(msg);
        };
    } else {
        console.log = function () {
        };
    }
}