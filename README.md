# User API coding test

*Your task is to create an API to manage a user persistence layer.*


## Installation

To install run the following commands:  
```
npm install -g swagger mocha babel-cli  
npm install
```

## Tests

To run the tests, run the following command:  
```
npm run test
```

## Launch

To launch the application, you need to build it first using `npm run build`.  
Then run `npm start`

To see the documentation launch Swagger Editor using the following command: `swagger project edit`

## Docker

To run the application in Docker, simply run `docker-compose up`.  

Your application will listen on [http://localhost:10010](http://localhost:10010).  
The Swagger UI is available on  [http://localhost/](http://localhost/).  

To use the User API from Swagger UI, you need to insert the following url
into the address bar at the top of the page: `http://localhost:10010/swagger`
and click on the **Explore** button.
