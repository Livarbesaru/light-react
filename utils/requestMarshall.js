const Request = require("../model/request");
const url = require('url');
const [fetch, manipolateJson] = require("./fetch");


async function marshallRequest(request) {
  const urlParsed = url.parse(request.url)
  const query = [...(urlParsed.query != null ? urlParsed.query : "").split("&")];
  const queryAsMap = new Map();
  for (paramValue of query) {
    let [first, ...rest] = paramValue.split('=')
    rest = rest.join('=');
    queryAsMap.set(first, rest);
  }
  let body = [];
  try {
    body = await manipolateJson(request, body);
  } catch (error) {
    console.error(error);
    body = {};
  }
  return new Request(urlParsed.pathname, request.method.toUpperCase(), queryAsMap, body, request.headers, {});
}

module.exports = marshallRequest;