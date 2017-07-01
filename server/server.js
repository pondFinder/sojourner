var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var db = require('./db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({ secret: 'pondFinder' }));

app.get('/', function(req, res) {
  if (req.session.user_id === undefined) {
    res.sendFile(path.resolve(__dirname + '/../login.html'));
  } else {
    res.sendFile(path.resolve(__dirname + '/../index.html'));
  }
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '/../signup.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/../login.html'));
});

app.get('/logout', (req, res) => {
  req.session.destroy( () => {
    res.sendFile(path.join(__dirname, '/../login.html'));
  });
});
// Four potential views:
// - landing/home page with map (GET, maybe POST)
// - user profile page (enable PUT/POST requests for updates?)
// - login page (GET/POST)
// - signup page (GET/POST)
app.get('/username', (req, res) => {
  res.send(req.session.username);
});

app.post('/login', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  db.User.findOne({
    where: {
      username: username,
      password: password
    }
  })
  .then((user) => {
    if(user) {
      req.session.regenerate(() => {
        req.session.user_id = user.dataValues.id;
        req.session.username = username;
        res.sendFile(path.join(__dirname, '/../index.html'));
      });
    } else {
      res.sendFile(path.join(__dirname, '/../signup.html'));
    }
  });
});

app.post('/signup', (req, res) => {
    db.User.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      home_city: req.body.home_city
    });
    res.sendFile(path.join(__dirname, '/../index.html'));
});

// routes for user interests
app.get('/interests', (req, res) => {
  var username = req.sessions.username;
  var password = req.sessions.password;

  db.User.findOne({
    where: {
      username: username,
      password: password
    }
  })
  .then((user) => {
    res.json(user.dataValues);
  });
});

app.post('/user', function(req, res) {
  // request for a user profile page
  res.render('/user');
});

app.use(express.static(path.join(__dirname, '../')));//moved from above

//Socket IO
io.on('connection', (socket) => {

  console.log('A user has connected!');

  socket.on('msg', function(msg, username){
    console.log('msg recieved: ' + msg);
    io.emit('msg', username.toUpperCase() + ': ' + msg);
  });

  socket.on('disconnect', () => {
      console.log('A user has disconnected!');
  });

});


http.listen(process.env.PORT || 3000, function(){
  console.log("listening on process.environment.port or listening on 3000");
});
