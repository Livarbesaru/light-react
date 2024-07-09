const express = require('express');
const appServer = express();
const propertiesReader = require("./utils/properties")
const fileReader = require("./utils/fileReader")
propertiesReader.addProperties("properties","properties.json").then(res =>{
    console.log(res);
    const generalProperties = propertiesReader.getProperties("properties");
    if(generalProperties != null){
        let [port,hostname] = [generalProperties["server"]["port"],generalProperties["server"]["hostname"]];
        start(port,hostname,generalProperties);
    }
})

async function start(port,hostname,generalProperties){
    let resources = [];
    await fileReader.walkPath("./"+generalProperties["server"]["pages-path"],resources);
    console.log("resources size:"+resources.length,resources)
    appServer.listen(port,hostname,()=>{
        console.log(`Server started on port:${port} with hostname:${hostname}`)
    })
}
