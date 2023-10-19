const mongoose= require('mongoose')
class Datasource{
    mongo;
    connection;
    constructor(url) {
        this.mongo = mongoose;
        this.connection = this.mongo.connect(url);
    }
}

module.exports = Datasource;

