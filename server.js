const http = require('http');


let pluralOutput = '';
let numNforms = {
    num: 0,
    forms: ['', '', '']
};

function GetPluralization(n, forms) { // (1, ['минута', 'минуты', 'минут']); 
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





const server = http.createServer((req, res) => {

    let data = [];
    let tasks = [];

    if (req.url === '/headers') { //  вернуть в ответе все заголовки запроса
        const headers = req.headers;
        res.writeHead(200, { 'Content-type': 'application/json' })
        res.end(JSON.stringify(headers));
    }

    if (req.url === '/plural') {
        // curl localhost:3000/plural -d '{"num": "2", "arr": ["minuta", "minuty", "minut"]}' -H "Content-type: application/json"
        if (req.method === 'GET') {
            res.writeHead(200, { 'Content-type': 'application/json' })
            res.end(GetPluralization(+numNforms.num, numNforms.forms) + '\r\n');
        }
        else if (req.method === 'POST') {
            req.on('data', chunk => {
                data.push(chunk);
            });
            req.on('end', () => {
                let reqObj = JSON.parse(data.join(''));
                res.writeHead(200, { 'Content-type': 'application/json' });
                numNforms.num = reqObj.num;
                numNforms.forms = reqObj.arr;
                res.end(JSON.stringify(numNforms));
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







    // if(req.url === '/tasks') {
    // const tasks = [{ name: 'qwe' }, { name: 'qws' }];
    // res.writeHead(200, { 'Content-type': 'application/json' })
    // res.end(JSON.stringify(tasks));
    // }
});

server.listen(3000, () => {
    console.log('server started')
});


