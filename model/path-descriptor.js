class Rule{
    constructor(getDataFromRequest=(request)=>{},validate=(obj)=>true){
        this.getDataFromRequest = getDataFromRequest;
        this.validate = validate;
    }
}

class BodyDescriptor{
    constructor(rules={},validate=(body,rules)=>true){
        this.rules=rules;
        this.validate=validate;
    }
}

class PathDescriptor{
    constructor(
        path,
        resourcePath,
        method="GET",
        body={},
        rules={"params":[],"body":[],"headers":[],"session":[]},
        validate=(request,ruleMap=this.rules)=>true,
        transformResource=(resource,func)=>resource,
        elaborateResponse= async (request,resource)=>{return {"data":"","headers":{"Content-Type": "text/html","Content-Length":1}}}
    ){
        this.path=path;
        this.resourcePath=resourcePath;
        this.method=method;
        this.body=body;
        this.rules=rules;
        this.validate=validate;
        this.transformResource=transformResource;
        this.elaborateResponse=elaborateResponse;
    }

    setTransformedResource(resource){
        this.resource = this.transformResource(resource);
    }

    async elaborateRequest(request,res){
        let obj = {};
        try{
            obj = this.elaborateResponse(request,this.resource);
        }catch(error){
            console.error("error while returning request data %s",error)
        }
        res(obj);
    }
}


module.exports = [PathDescriptor,BodyDescriptor,Rule];