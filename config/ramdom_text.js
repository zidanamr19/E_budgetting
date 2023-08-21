exports.ramdom = function(nilai) {
    var result = "";
    var karakter = "abcABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345678910";
    var karakterpanjang = karakter.length;
    for (var i = 0; i < nilai; i++) {
        result += karakter.charAt(Math.floor(Math.random() *karakterpanjang));
    }
    return result;
}