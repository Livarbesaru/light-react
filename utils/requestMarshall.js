const Request = require("../model/request");
const url = require('url');


function marshallRequest(request){
    const urlParsed = url.parse(request.url)
    const query = [...(urlParsed.query!=null ? urlParsed.query : "").split("&")];
    const queryAsMap = new Map();
    for(paramValue of query){
        let [first, ...rest] = paramValue.split('=')
        rest = rest.join('=');
        queryAsMap.set(first,rest);
    }
    let body = [];
    request
      .on('error', err => {
        throw new Error("error while reading body %s",err)
      })
      .on('data', chunk => {
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body).toString();
        // At this point, we have the headers, method, url and body, and can now
        // do whatever we need to in order to respond to this request.
    });
    return new Request(urlParsed.pathname,request.method.toUpperCase(),queryAsMap,body,request.headers,{});
}

module.exports = marshallRequest;