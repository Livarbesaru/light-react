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
    let restMap = new Map();
    for(snglResource of await fileReader.walkPath("./"+generalProperties["server"]["pages-path"],[])){
        restMap.set(snglResource["pathToFile"],{data:snglResource["data"],type:generalProperties["server"]["http-data-format"][snglResource["type"]]})
    }
    let server = http.createServer(function (req, res) {
        let urlPath = url.parse(req.url).pathname;
        differentResponseData(urlPath,res,restMap);
    });
    server.listen(port,hostname,()=>{
        console.log(`Server started on port:${port} with hostname:${hostname} complete url: %s`,`http://${hostname}:${port}`)
    });
}


function differentResponseData(path,res,restMap){
    console.log("call on path:%s",path)
    try{
        if(restMap.get(path) != null){
            let resource = restMap.get(path);
            let data = restMap.get(path)["data"];
            if(data == null){
                data = restMap.get("/")["data"]
                path = "/"
            }
            acceptRequest(res,data,{"Content-Type": resource["type"],"Content-Length":resource["data"].length},"utf8")
        }else{
            rejectRequest(res,404);
        }
    }catch(error){
        console.error("error with path %s %s",path,error);
        rejectRequest(res,500);
    }
}

function acceptRequest(res,data,headers,encoding){
    for(const [key,value] of Object.entries(headers)){
        res.setHeader(key,value);
    }
    res.writeHead(200);
    res.write(data,encoding);
    res.end(data,encoding);
}
function rejectRequest(res,fault){
    res.writeHead(fault);
    res.end();
}