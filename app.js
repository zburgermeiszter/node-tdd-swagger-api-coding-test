'use strict';

const SwaggerExpress = require('swagger-express-mw');
const app = require('express')();
const cors = require('cors');
module.exports = app; // for testing

const config = {
  appRoot: __dirname // required config
};

app.use(cors());

SwaggerExpress.create(config, function (err, swaggerExpress) {
  if (err) {
    throw err;
  }

  // install middleware
  swaggerExpress.register(app);

  const port = process.env.PORT || 10010;
  if (!module.parent) {
    app.listen(port, () => {
      console.log(`Application is listening on port ${port}`);
    });
  }
});
