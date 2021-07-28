function CreateJson(map) {
    let objJson = {};
    map.forEach((value, key,) => {
        objJson[key] = value+'';
    });
    let res = JSON.stringify(objJson);
    return res;
}

module.exports = CreateJson;