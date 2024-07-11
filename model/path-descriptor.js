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
        elaborateResponse=(request,resource)=>{return {"data":"","headers":{"Content-Type": "text/html","Content-Length":1}}}
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

    elaborateRequest(request){
        return this.elaborateResponse(request,this.resource);
    }
}


module.exports = [PathDescriptor,BodyDescriptor,Rule];