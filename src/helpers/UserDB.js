import crypto from 'crypto';
import moment from 'moment';

class UserDB {
  constructor() {
    this.users = {};
  }

  create(user) {
    return new Promise((resolve, reject) => {
      const id = crypto.randomBytes(20).toString('hex');
      this.users[id] = Object.assign({
        created: moment().format()
      }, user);
      return resolve(id);
    });
  }

  find(userID) {
    return new Promise((resolve, reject) => {
      if (!userID) {
        return resolve(
          Object.keys(this.users).map(userID => {
            return Object.assign({}, this.users[userID], {id: userID});
          }));
      }

      if (!this._ensureUserExists(userID, reject)) return;

      return resolve(Object.assign({id: userID}, this.users[userID]));
    });
  }

  update(userID, newUserProfile) {
    return new Promise((resolve, reject) => {
      if (!this._ensureUserExists(userID, reject)) return;
      Object.assign(this.users[userID], newUserProfile);
      return resolve();
    });
  }

  delete(userID) {
    return new Promise((resolve, reject) => {
      if (!this._ensureUserExists(userID, reject)) return;
      delete this.users[userID];
      return resolve();
    });
  }

  _ensureUserExists(userID, reject) {
    if (!(userID in this.users)) {
      const err = new Error(`User not found with ID: ${userID}`);
      reject(err);
      return false;
    }
    return true;
  }
}

export default UserDB;