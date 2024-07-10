const fs = require('fs');
class Reader {
    reader;
    FILE_SEPARATOR;
    PATH_FROM_SERVER_JS;
    constructor() {
        this.reader = fs;
        this.FILE_SEPARATOR = "/";
        this.PATH_FROM_SERVER_JS = "./"
    }

    async readFileFromPath(dir, file) {
        return new Promise((res, rej) => {
            let dataToReturn = { data: [], type: "", code: 200, name: "", pathToFile: "" };
            fs.readFile(this.PATH_FROM_SERVER_JS + dir + this.FILE_SEPARATOR + file, (err, data) => {
                if (err) {
                    dataToReturn["code"] = 500;
                    rej(dataToReturn)
                    console.log(`ERROR READING FILE ${file} in DIR ${dir} `, err)
                } else {
                    dataToReturn["data"] = data;
                    const dataInfo = file.split(".");
                    dataToReturn["type"] = dataInfo.pop();
                    dataToReturn["name"] = dataInfo.shift();
                    dataToReturn["pathToFile"] = dir.replace("./", "/") + this.FILE_SEPARATOR + dataToReturn["name"]
                    res(dataToReturn);
                    console.log(`file ${file} has been loaded`);
                }
            })
        })
    }

    async walkPath(dir, arrayToFill) {
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
                            res(await this.walkPath(filePath, arrayToFill));
                        } else if (resStat.isFile()) {
                            let toAdd = await this.readFileFromPath(dir, file);
                            arrayToFill.push(toAdd);
                            res("ok")
                        }
                    }
                });
            });
        }
        return arrayToFill;
    }
}

module.exports = new Reader();