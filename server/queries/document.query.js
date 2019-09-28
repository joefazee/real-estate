const Document = require('../models/document.model');

class DocumentQueries{
  constructor(Model){
    this.Model = Model;
  }

  create(payload){
    return this.Model.create(payload);
  }

  bulkCreate(payload){
    return this.Model.bulkCreate(payload);
  }

}

const documentQuery = new DocumentQueries(Document);

module.exports = documentQuery;
