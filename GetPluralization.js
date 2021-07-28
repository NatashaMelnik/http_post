function GetPluralization(n, forms) {
    n = +n;
    n = Math.abs(n) % 100;
    var n1 = n % 10;
    if (n > 10 && n < 20) {
        return forms[2];
    }
    if (n1 > 1 && n1 < 5) {
        return forms[1];
    }
    if (n1 == 1) {
        return forms[0];
    }
    return forms[2];
}

module.exports = GetPluralization;