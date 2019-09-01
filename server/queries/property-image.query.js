const PropertyImage = require('../models/property-image.model');

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