var Sequelize = require('sequelize');

if (process.env.DATABASE_URL) {
  // the application is executed on Heroku ... use the postgres database
  db = new Sequelize(process.env.DATABASE_URL, {
    dialect:  'postgres',
    logging:  false
  });
} else {
  // the application is executed on the local machine ... use mysql
  // You will have to set up a "sojourner" database locally with a username
  // ("root" here) and password ("password" here) of your own choosing.
  db = new Sequelize('sojourner', 'root', 'password', {
    dialect:  'postgres',
    logging:  false
  });
}

db.authenticate()
.then(() => {
    console.log('successfully connected!');
})
.catch((err) => {
    console.log('Error connection: ', err);
});

// Sequelize creates the primary key, createdAt, and updatedAt
// values automatically.
var User = db.define('User', {
  'first_name': Sequelize.STRING,
  'last_name': Sequelize.STRING,
  'username': Sequelize.STRING,
  'email': Sequelize.STRING,
  'password': Sequelize.STRING,
  'home_city': Sequelize.STRING,
  // interests
  'interest_1': Sequelize.STRING,
  'interest_2': Sequelize.STRING,
  'interest_3': Sequelize.STRING
});

User.sync({force: false});

exports.User = User;
