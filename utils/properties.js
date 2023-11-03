const fileReader = require("./fileReader")

class Properties{
    map;
    constructor() {
        this.map = new Map();
    }

    async addProperties(dir,file){
        return new Promise((res,rej)=>{
            fileReader.readFileFromPath(dir,file).then(response => {
                if(response.code === 200){
                    const {data,type,code,name} = response;
                    let parsedData = JSON.parse(data.toString('utf8'));
                    this.map.set(name,parsedData);
                    res(`Properties file ${name} has been loaded`);
                    console.log(`file ${file} has been loaded in Properties =>`, parsedData);
                }else{
                    rej('fuck properties');
                }
            });
        })
    }
    getProperties(properties){
        return this.map.get(properties);
    }
}

module.exports = new Properties();