# Water Board Project Server with Express, Passport and Sequelize
Back end Server for Water Board Project . It is built with:

* [Node.js](https://nodejs.org/en/)
* [Express](http://expressjs.com/)
* [Passport](http://passportjs.org)
* [Sequelize](http://sequelizejs.com)
* and [Mochajs](https://mochajs.org/)


##Requirements

As it is a Node application, you will need Node.js installed.

The app uses a SQL database via Sequelize ORM. It was tested with PostgreSQL and Sqlite, but should work with other supported databases as well.

##Installation

Clone the repository and simply run npm install from the root folder.

##Configuration

In order to run the Server, a database connection string has to be configured. The connection string is stored `db.js`.

When Sequelize is configured, you can run the server. From the root directory run:

`node servre.js`
If you want to run the tests, it is necessary to configure Mocha.js.

Run the Server

From the root folder of the project, you can run the Server with:

`node server.js`
You can then access the application on `http://localhost:8000.`

##Available Routes:

* GET    on `http://localhost:8000`
* GET    on `http://localhost:8000/hydrants`
* GET    on `http://localhost:8000/hydrant/id`
* GET    on `http://localhost:8000/users`
* GET    on `http://localhost:8000/user/id`
* GET    on `http://localhost:8000/vehicles`
* GET    on `http://localhost:8000/vehicle/id`
* POST   on `http://localhost:8000/hydrant/id`
* POST   on `http://localhost:8000/user/id`
* POST   on `http://localhost:8000/vehicle/id`
* DELETE on `http://localhost:8000/hydrant/id`
* DELETE on `http://localhost:8000/user/id`
* DELETE on `http://localhost:8000/vehicle/id`


##Run the tests

A basic set of Mocha Express Routes tests is provided. To run the tests, first make sure that the server is running and then start the test suite by typing `mocha -R spec spec.js` in the root folder. 
`mocha -R spec spec.js`
