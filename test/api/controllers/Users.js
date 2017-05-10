import should from 'should';
import server from '../../../app';
import supertest from 'supertest';
const request = supertest.agent(server.listen());

let userID, firstUserProfile;
function getUserProfile() {
  return {
    email: 'user@example.com',
    forename: 'John',
    surname: 'Smith'
  };
}

function insertUser(user, done) {
  request
    .post('/users')
    .set('Accept', 'application/json')
    .send(user)
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) {
        return done(err);
      }
      res.body.should.have.property('message');
      userID = res.body.message;
      done();
    });
}

function getUser(userID, callback) {
  const url = userID ? `/users/${userID}` : '/users';
  request
    .get(url)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(callback);
}

describe('controllers', function () {

  describe('Users', function () {

    it('should register an User', function (done) {
      insertUser(getUserProfile(), done);
    });

    it('should retrieve an User', function (done) {
      getUser(userID, function (err, res) {
        if (err) {
          return done(err);
        }

        const user = res.body;

        user.should.have.property('id');
        user.should.have.property('email');
        user.should.have.property('forename');
        user.should.have.property('surname');
        user.should.have.property('created');

        user.id.should.equal(userID);

        const profile = getUserProfile();
        Object.keys(profile).forEach(property => {
          profile[property].should.equal(user[property]);
        });

        return done();
      });
    });

    it('should retrieve multiple Users', function (done) {
      const insert = new Promise((resolve, reject) => {
        insertUser(getUserProfile(), resolve)
      });

      insert.then(() => {
        getUser(null, function (err, res) {
          if (err) {
            return done(err);
          }

          res.body.length.should.equal(2);

          for (let user of res.body) {
            user.should.have.property('id');
            user.should.have.property('email');
            user.should.have.property('forename');
            user.should.have.property('surname');
            user.should.have.property('created');

            const profile = getUserProfile();
            Object.keys(profile).forEach(property => {
              profile[property].should.equal(user[property]);
            });
          }
          return done();
        });
      });
    });

    it('should update an User', function (done) {
      const newUserProfile = {
        email: 'user@example.com',
        forename: 'Steve',
        surname: 'Howard'
      };

      const verifyChange = done => {
        getUser(userID, function (err, res) {
          if (err) {
            return done(err);
          }

          const user = res.body;
          user.id.should.equal(userID);

          Object.keys(newUserProfile).forEach(property => {
            newUserProfile[property].should.equal(user[property]);
          });

          return done();
        });
      };

      request
        .put(`/users/${userID}`)
        .set('Accept', 'application/json')
        .send(newUserProfile)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          res.body.should.have.property('message');

          return verifyChange(done);
        });

    });

    it('should delete an user', function (done) {
      const verifyDeletion = done => {
        request
          .get(`/users/${userID}`)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(404)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            return done();
          });
      };

      request
        .delete(`/users/${userID}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          res.body.should.have.property('message');

          return verifyDeletion(done);
        });
    });
  });
});
