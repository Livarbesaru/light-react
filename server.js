const propertiesReader = require("./utils/properties");
const fileReader = require("./utils/fileReader");
const http = require("http");
const requireFromString = require("./utils/requireFromString");
const requestMarshaller = require("./utils/requestMarshall");

//lettura delle properti principali con relativa partenza del server in ascolto
propertiesReader.addProperties("properties","properties.json").then(res =>{
    console.log(res);
    const generalProperties = propertiesReader.getProperties("properties");
    if(generalProperties != null){
        start(generalProperties);
    }
})

// partenza del server successiva alla lettura dell'alberatura delle path e dei manager
async function start(generalProperties){
    const [port,hostname] = [generalProperties["server"]["port"],generalProperties["server"]["hostname"]];
    let restMap = new Map();
    await new Promise((res,rej)=>defineRoutes(restMap,generalProperties,res));
    let server = http.createServer(async function (req, res) {
        try{
            const requestMarshalled = await requestMarshaller(req);
            differentResponseData(requestMarshalled,res,restMap);
        }catch(error){
            console.error(error);
            rejectRequest(res,500);
        }
    });
    server.listen(port,hostname,()=>{
        console.log(`Server started on port:${port} with hostname:${hostname} complete url: %s`,`http://${hostname}:${port}`)
    });
}


function differentResponseData(request,res,restMap){
    console.log("call on path:%s",request.path)
    try{
        let wantedPath = restMap.get(request.path);
        if(wantedPath != null){
            let elaborate = wantedPath[request.method];
            if(elaborate == null){
                rejectRequest(res,404);
                return;
            }
            elaborate.execute(request,res,elaborate.manager)
        }else{
            rejectRequest(res,404);
            return;
        }
    }catch(error){
        console.error("error with path %s %s",request.path,error);
        rejectRequest(res,500);
    }
}

async function defineRoutes(restMap,generalProperties,callbackRes){
    const pathsLoaded = await fileReader.walkPath("./"+generalProperties["server"]["pages-path"],{"route-managers":{},"loaded-data":{}},"manager.js");
    const pathManagers = pathsLoaded["route-managers"];
    const loadedData = new Map(Object.entries(pathsLoaded["loaded-data"]));
    for(const[snglPathManager,manager] of Object.entries(pathManagers)){
        const managedRequestList = requireFromString(manager["data"].toString('utf8'));
        for(snglmanagedRequest of managedRequestList){
            const resourcesToPass = {};
            for(const res of snglmanagedRequest["resourcePath"]){
                resourcesToPass[res]=loadedData.get(res)["data"];
            }
            fillResourceMap(restMap,snglmanagedRequest,resourcesToPass);
        }
    }
    loadedData = new Map();
    callbackRes("ok");
}

function fillResourceMap(restMap,snglmanagedRequest,relativeResource){
    let node = restMap.get(snglmanagedRequest["path"]);
    snglmanagedRequest.setTransformedResource(relativeResource);
    if(node == null){
        restMap.set(snglmanagedRequest["path"],{});
        node = restMap.get(snglmanagedRequest["path"]);
    }
    node[snglmanagedRequest["method"]]={execute:doRequest,manager:snglmanagedRequest};
}

async function doRequest(request,response,snglmanagedRequest){
    const validation = snglmanagedRequest.validate(request,snglmanagedRequest.rules);
    if(validation){
        let responsePackage;
        await new Promise((res,rej)=>{
            responsePackage = snglmanagedRequest.elaborateRequest(request,res);
        }).then((returningValue)=>{responsePackage=returningValue})
        acceptRequest(response,responsePackage["data"],responsePackage["headers"],"utf8");
    }else{
        rejectRequest(response,400)
    }
}
function acceptRequest(res,data,headers,encoding){
    for(const [key,value] of Object.entries(headers)){
        res.setHeader(key,value);
    }
    res.writeHead(200);
    res.end(data,encoding);
}
function rejectRequest(res,fault){
    res.writeHead(fault);
    res.end();
}
