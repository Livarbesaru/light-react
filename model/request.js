class Request{
    constructor(path,method,params,json,headers,session){
        this.path=path;
        this.method=method;
        this.params=params;
        this.json=json;
        this.headers=headers;
        this.session=session;
    }
}

module.exports=Request;