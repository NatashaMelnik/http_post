function CreateCorrectWordsArr(str) {
    sameStyleWordArr = str.toLowerCase().replace(/[.,!—]/g, ' ').split(' ').filter(word => word.length !== 0);
    return sameStyleWordArr;
}

module.exports = CreateCorrectWordsArr;