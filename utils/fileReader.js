const fs = require('fs');
class Reader {
    reader;
    FILE_SEPARATOR;
    PATH_FROM_SERVER_JS;
    constructor() {
        this.reader = fs;
        this.FILE_SEPARATOR = "/";
        this.FILE_TYPE_SEPARATOR = ".";
        this.PATH_FROM_SERVER_JS = "./"
    }

    async readFileFromPath(dir, file,specifyPath=null) {
        return new Promise((res, rej) => {
            let dataToReturn = { data: [], type: "", code: 200, name: file, pathToFile: "" };
            fs.readFile(this.PATH_FROM_SERVER_JS + dir + this.FILE_SEPARATOR + file, (err, data) => {
                if (err) {
                    dataToReturn["code"] = 500;
                    rej(dataToReturn)
                    console.err(`ERROR READING FILE ${file} in DIR ${dir} ${err}`)
                } else {
                    dataToReturn["data"] = data;
                    const dataInfo = file.split(this.FILE_TYPE_SEPARATOR);
                    dataToReturn["name"] = dataInfo.shift();
                    dataToReturn["type"] = dataInfo.reduce((a,b)=>a+this.FILE_TYPE_SEPARATOR+b);
                    dataToReturn["pathToFile"] = specifyPath === null ? dir.replace("./", "/") + this.FILE_SEPARATOR + dataToReturn["name"] : specifyPath;
                    res(dataToReturn);
                    console.log(`file ${file} has been loaded`);
                }
            })
        })
    }

    async walkPath(dir, mappingObject, extensionManager=null) {
        let filesToRead = [];
        await new Promise((res,rej)=>{
            this.reader.readdir(dir, (err, files) => {
                if (err) {
                    rej("not ok")
                    throw new Error("error reading files while walking down tree %s",err)
                }else{
                    filesToRead = files;
                    res("ok")
                }
            });
        })

        for(const file of filesToRead){
            let filePath = dir + this.FILE_SEPARATOR + file;
            await new Promise((res,rej)=>{
                fs.stat(filePath, async (errStat, resStat) => {
                    if(errStat){
                        throw new Error("stat not recieved for file %s",filePath)
                    }else{
                        if (resStat.isDirectory()) {
                            res(await this.walkPath(filePath, mappingObject,extensionManager));
                        } else if (extensionManager != null && resStat.isFile() && file.endsWith(extensionManager)) {
                            let toAdd = await this.readFileFromPath(dir, file);
                            mappingObject["route-managers"][toAdd["pathToFile"]] = toAdd;
                            res("ok");
                        }else if(resStat.isFile()){
                            let toAdd = await this.readFileFromPath(dir, file);
                            mappingObject["loaded-data"][toAdd["pathToFile"]] = toAdd;
                            res("ok");
                        }
                    }
                });
            });
        }
        return mappingObject;
    }
}

module.exports = new Reader();