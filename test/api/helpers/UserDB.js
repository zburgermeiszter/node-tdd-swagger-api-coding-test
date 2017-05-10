import UserDB from '../../../src/helpers/UserDB';
import deepEqual from 'deep-equal';
import moment from 'moment';

describe('helpers', function () {

  describe('UserDB', function () {

    before(function () {
      this.db = new UserDB();
      this.userID = null;
      this.firstUserProfile = null;
      this.getUserProfile = function () {
        return {
          email: 'user@example.com',
          forename: 'John',
          surname: 'Smith'
        };
      }
    });

    it('should CREATE a record', function (done) {
      this.db.create(this.getUserProfile())
        .then(userID => {
          if (!userID) {
            return done(new Error(`UserID is missing.`));
          }
          this.userID = userID;
          return done();
        })
        .catch(done);
    });

    it('should READ a single record', function (done) {

      const validateTimestampFormat = timestamp => {
        return moment(timestamp).isValid() && moment(timestamp).format() === timestamp;
      };

      this.db
        .find(this.userID)
        .then(user => {
          if (!user.id) {
            return done(new Error(`UserID is missing.`));
          }

          if (this.userID !== user.id) {
            return done(new Error(`Wrong user returned: ${user.id}`));
          }

          if (!user.email) {
            return done(new Error(`Email is missing`));
          }

          if (!user.forename) {
            return done(new Error(`Forename is missing.`));
          }

          if (!user.surname) {
            return done(new Error(`Surname is missing`));
          }

          if (!user.created) {
            return done(new Error(`Created timestamp is missing.`))
          }

          if (!validateTimestampFormat(user.created)) {
            return done(new Error(`Invalid timestamp format: ${user.created}`));
          }

          this.firstUserProfile = Object.assign({}, user);
          return done();
        })
        .catch(done)
    });

    it('should READ all records', function (done) {
      const checkNumberOfUsers = () => {
        this.db
          .find()
          .then(users => {
            const expectedNumberOfUsers = 2;
            if (expectedNumberOfUsers !== users.length) {
              return done(new Error(`Incorrect number of users: ${users.length} Expected: ${expectedNumberOfUsers}`));
            }
            for (let user of users) {
              if (!user.id) {
                return done(new Error(`Invalid User record: ${JSON.stringify(user)}`));
              }
            }
            return done();
          })
          .catch(done);
      };

      this.db
        .create(this.getUserProfile())
        .then(checkNumberOfUsers);
    });

    it('should UPDATE a record', function (done) {
      const newUserProfile = {
        email: 'root@localhost',
        forename: 'Kevin',
        surname: 'Miller'
      };

      const expectedUserProfile = Object.assign(
        newUserProfile,
        {
          id: this.firstUserProfile.id,
          created: this.firstUserProfile.created
        }
      );

      const verifyChange = (userID, expectedUserProfile) => {
        return new Promise((resolve, reject) => {
          this.db.find(userID)
            .then(updatedUserProfile => {
              if (!deepEqual(expectedUserProfile, updatedUserProfile, {strict: true})) {
                return reject(new Error(`Unsuccessful update.\nExpected: ${JSON.stringify(expectedUserProfile)}\nActual: ${JSON.stringify(updatedUserProfile)}`));
              }
              return resolve();

            })
            .catch(reject)
        });
      };

      this.db
        .update(this.userID, newUserProfile)
        .then(() => {
          verifyChange(this.userID, expectedUserProfile)
            .then(done)
            .catch(done);
        })
        .catch(done)
    });

    it('should DELETE a record', function (done) {
      this.db
        .delete(this.userID)
        .then(() => {
          this.db
            .find(this.userID)
            .then(() => {
              return done(new Error(`User still exists.`));
            })
            .catch(() => {
              return done();
            });
        })
        .catch(done);
    });

  });

});