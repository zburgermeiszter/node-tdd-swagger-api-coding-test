import UserDB from '../helpers/UserDB';

const db = new UserDB();

class Users {
  static create(req, res) {
    db.create(req.body)
      .then(id => res.json({message: id}))
      .catch(Users._errorHandler(res));
  }

  static find(req, res) {
    let userID = null;
    if (req.swagger.params.id) {
      userID = req.swagger.params.id.value;
    }
    db.find(userID)
      .then(user => {
        res.json(user);
      })
      .catch(Users._errorHandler(res));
  }

  static update(req, res) {
    db.update(req.swagger.params.id.value, req.body)
      .then(() => res.json({message: 'Updated'}))
      .catch(Users._errorHandler(res));
  }

  static delete(req, res) {
    db.delete(req.swagger.params.id.value)
      .then(() => res.json({message: 'Deleted'}))
      .catch(Users._errorHandler(res));
  }

  static _errorHandler(res) {
    return err => {
      return res.status(404).json({message: err.message});
    }
  }
}

module.exports = {
  create: Users.create,
  find: Users.find,
  getAll: Users.find,
  update: Users.update,
  delete: Users.delete
};