const PropertyImage = require('../models/Image');

class PropertyImageQueries {
  constructor(Model){
    this.Model = Model;
  }

  bulkCreate(payload){
    return this.Model.bulkCreate(payload);
  }
}

const PropertyImageQuery = new PropertyImageQueries(PropertyImage);

module.exports = PropertyImageQuery;