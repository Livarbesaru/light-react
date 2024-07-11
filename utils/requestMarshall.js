const Request = require("../model/request");
const url = require('url');


async function marshallRequest(request){
    const urlParsed = url.parse(request.url)
    const query = [...(urlParsed.query!=null ? urlParsed.query : "").split("&")];
    const queryAsMap = new Map();
    for(paramValue of query){
        let [first, ...rest] = paramValue.split('=')
        rest = rest.join('=');
        queryAsMap.set(first,rest);
    }
    let body = [];
    await new Promise((res,rej)=>{
      request.
        on('error', err => {
          rej("not ok");
          throw new Error("error while reading body %s",err)
        })
        .on('data', chunk => {
          body.push(chunk);
        })
        .on('end', () => {
          if(body.length > 0){
            body = JSON.parse(Buffer.concat(body).toString());
          }
          res("ok");
      });
    })
    return new Request(urlParsed.pathname,request.method.toUpperCase(),queryAsMap,body,request.headers,{});
}

module.exports = marshallRequest;