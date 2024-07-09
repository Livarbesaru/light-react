const url = require('url');
const propertiesReader = require("./utils/properties");
const fileReader = require("./utils/fileReader");
const http = require("http");
propertiesReader.addProperties("properties","properties.json").then(res =>{
    console.log(res);
    const generalProperties = propertiesReader.getProperties("properties");
    if(generalProperties != null){
        start(generalProperties);
    }
})

async function start(generalProperties){
    const [port,hostname] = [generalProperties["server"]["port"],generalProperties["server"]["hostname"]];
    let resources = [];
    let restMap = new Map();
    await fileReader.walkPath("./"+generalProperties["server"]["pages-path"],resources);
    for(snglResource of resources){
        restMap.set(snglResource["pathToFile"],{data:snglResource["data"],type:generalProperties["server"]["http-data-format"][snglResource["type"]]})
    }
    let server = http.createServer(function (req, res) {
        let urlPath = url.parse(req.url).pathname;
        differentResponseData(urlPath,res,generalProperties,restMap);
    });
    server.listen(port,hostname,()=>{
        console.log(`Server started on port:${port} with hostname:${hostname} complete url: %s`,`http://${hostname}:${port}`)
    });
}


function differentResponseData(path,res,generalProperties,restMap){
    console.log("call on path:%s",path)
    try{
        if(generalProperties["server"]["not-mapped-api"][path] == null){
        let data = restMap.get(path)["data"];
            if(data == null){
                data = restMap.get("/")["data"]
                path = "/"
            }
            res.writeHead(200, {'Content-Type': restMap.get(path)["type"]})
            res.write(data);
            res.end();
        }
    }catch(error){
        console.error("error with path %s %s",path,error);
        res.writeHead(400);
        res.end();
    }
}