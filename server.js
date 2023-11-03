const express = require('express');
const appServer = express();
const propertiesReader = require("./utils/properties")
propertiesReader.addProperties("properties","properties.json").then(res =>{
    console.log(res)
    const generalProperties = propertiesReader.getProperties("properties");
    if(generalProperties != null){
        let [port,hostname] = [generalProperties["server"]["port"],generalProperties["server"]["hostname"]];
        appServer.listen(port,hostname,()=>{
            console.log(`Server started on port:${port} with hostname:${hostname}`)
        })
    }
})

