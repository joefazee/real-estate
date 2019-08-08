//This file will be deleted later
class UserQueries{
  constructor(Model){
    this.Model = Model;
  }

  create(payload) {
    this.Model.create(payload);
    
  }
}
