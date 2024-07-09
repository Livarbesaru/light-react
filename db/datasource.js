const mongoose= require('mongoose')
class Datasource{
    mongo;
    connection;
    constructor(url) {
        this.mongo = mongoose;
        this.connection = this.mongo.connect(url);
    }


    createSchema(schemaStructure){
        return new this.mongo.Schema(schemaStructure);
    }

    createModel(name,schema){
        this.mongo.model(name,schema);
    }
}

module.exports = Datasource;

