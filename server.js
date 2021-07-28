const http = require('http');
const url = require('url');
const querystring = require('querystring');

const GetPluralization = require('./GetPluralization');
const CountWords = require('./countWords');
const CreateJson = require('./CreateJson');

const server = http.createServer((req, res) => {

    let data = [];

    let currUrl = url.parse(req.url, true);
    let pathway = currUrl.pathname;
    let search = url.parse(req.url, true).search;

    // curl localhost:5000/headers

    if (pathway === '/headers') { //  вернуть в ответе все заголовки запроса
        const headers = req.headers;
        res.writeHead(200, { 'Content-type': 'application/json' })
        res.end(JSON.stringify(headers));
    }

    // curl "localhost:5000/plural?number=2&forms=person,people,people" # попробуйте также передать слова в кириллице сделав url encode

    if (pathway === '/plural') {
        try {
            let num = +querystring.parse(search)['?number'];
            let forms = querystring.parse(search)['forms'].split(",");
            res.writeHead(200, { 'Content-type': 'application/json' });
            res.end(GetPluralization(num, forms) + '\n\r');
        } catch (e) {
            res.writeHead(404, 'Not Found');
            res.end();
        }
    }

    // curl -X POST localhost:5000/frequency --data-raw "Little red fox jumps over logs. Fox is red"

    if (pathway === '/frequency') {
        if (req.method === 'POST') {
            req.on('data', chunk => {
                data.push(chunk);
            });
            req.on('end', () => {
                let reqObj = data.join('');
                let words = CountWords(reqObj);
                res.setHeader("Content-Type", "application/json");
                res.setHeader("Unique-Words-Count", `${CountUniqueWords(words)}`);
                res.setHeader("Most-Popular-Word", `${GetMostPopularWord(words)}`);
                res.end(CreateJson(words) + '\n\r');
            });
        }
        else {
            res.writeHead(404, 'Not Found');
            res.end();
        }

    }

    else {
        res.writeHead(404, 'Not Found');
        res.end();
    }

});

server.listen(5000, () => {
    console.log('server started')
});


function CountUniqueWords(map) {
    let res = 0;

    map.forEach((key, value) => {
        if(+key === 1) {
            res++;
        }
    });

    return res;
}

function GetMostPopularWord(map) {
    let maxWord;
    let max = 0;

    map.forEach((key, value) => {
        if(+key > max) {
            max = +key;
            maxWord = value;
        }
    });

    return maxWord;
}






    // if (req.url === '/plural') {
    //     // curl localhost:3000/plural -d '{"num": "2", "arr": ["minuta", "minuty", "minut"]}' -H "Content-type: application/json"
    //     if (req.method === 'GET') {
    //         res.writeHead(200, { 'Content-type': 'application/json' })
    //         res.end(GetPluralization(+numNforms.num, numNforms.forms) + '\r\n');
    //     }
    //     else if (req.method === 'POST') {
    //         req.on('data', chunk => {
    //             data.push(chunk);
    //         });
    //         req.on('end', () => {
    //             let reqObj = JSON.parse(data.join(''));
    //             res.writeHead(200, { 'Content-type': 'application/json' });
    //             numNforms.num = reqObj.num;
    //             numNforms.forms = reqObj.arr;
    //             res.end(JSON.stringify(numNforms));
    //         });
    //     }
    //     else {
    //         res.writeHead(404, 'Not Found');
    //         res.end();
    //     }
    // }    

    // if(req.url === '/tasks') {
    // const tasks = [{ name: 'qwe' }, { name: 'qws' }];
    // res.writeHead(200, { 'Content-type': 'application/json' })
    // res.end(JSON.stringify(tasks));
    // }

    // const url_ = "http://example.com/index.html?code=string&key=12&id=false";
// const qs = "code=string&key=12&id=false";
// console.log(querystring.parse(qs));
// console.log(querystring.parse(url_).key);
