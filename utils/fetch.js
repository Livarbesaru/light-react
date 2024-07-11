const http = require("http");
const https = require("https");
/*
const options = {
    hostname: 'example.com',
    port: 80,
    path: '/',
    method: 'GET',
};
*/
async function fetch(options, httpsOn = false) {
    let body = [];
    let req = { end: () => { console.log("end nothing"); } };
    const protocol = httpsOn ? https : http;

    try {
        await new Promise((resolve, reject) => {
            req = protocol.request(options, (response) => {
                response.on('error', (err) => {
                    reject(`Errore nella risposta: ${err.message}`);
                })
                .on('data', (chunk) => {
                    body.push(chunk);
                })
                .on('end', () => {
                    if (body.length > 0) {
                        body = JSON.parse(Buffer.concat(body).toString());
                    } else {
                        body = {};
                    }
                    resolve("ok");
                });
            });

            req.end();
        });
    } catch (err) {
        console.error(err);
        body = {};
    }

    return body;
}

module.exports = fetch;