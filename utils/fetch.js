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
    const protocol = httpsOn ? https : http;

    try {
        await new Promise ((res,rej)=>{
            req = protocol.request(options, async (response) => {
                try{
                    body = await manipolateJson(response, body);
                    res("ok");
                }catch(error){
                    console.error(error);
                    rej("not ok")
                }
            });

            req.on('error', (err) => {
                console.error('Request error:', err);
                rej(err);
            });
    
            req.end();
        })
    } catch (err) {
        console.error(err);
        body = {};
    }

    return body;
}

async function manipolateJson(mediator, body) {
    await new Promise((res, rej) => {
        mediator.on('error', (err) => {
            rej("not ok")
            throw new Error(`Errore nella risposta: ${err.message}`);
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
                res("ok");
            });
    });
    return body;
}

module.exports = [fetch, manipolateJson];