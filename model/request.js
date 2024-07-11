class Request{
    constructor(path,method,params,body,headers,session){
        this.path=path;
        this.method=method;
        this.params=params;
        this.body=body;
        this.headers=headers;
        this.session=session;
    }
}

module.exports=Request;