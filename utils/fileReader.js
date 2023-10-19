const fs = require('fs');
class Reader{
    reader;
    FILE_SEPARATOR;
    PATH_FROM_SERVER_JS;
    constructor() {
        this.reader = fs;
        this.FILE_SEPARATOR = "/";
        this.PATH_FROM_SERVER_JS="./"
    }

    async readFileFromPath(dir,file){
        return new Promise((res,rej)=> {
            let dataToReturn = {data: [], type: "", code: 200, name: ""};
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
                    res(dataToReturn);
                    console.log(`file ${file} has been loaded to json =>`, JSON.parse(dataToReturn["data"].toString('utf8')));
                }
            })
        })
    }
}

module.exports = new Reader();