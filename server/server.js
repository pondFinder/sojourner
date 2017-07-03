var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var db = require('./db');
var request = require('request');

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

app.get('/interests', (req, res) => {
  console.log(req.session);
  var username = req.session.username;

  console.log('inside interests');
  db.User.findOne({
    where: {
      username: username
    }
  })
  .then((user) => {
    console.log('>>>>>', user.dataValues);
    res.send(user.dataValues);
  })
  .catch((err) => {
    console.log(err);
  });
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
app.get('/info', (req, res) => {
  res.send({
    username: req.session.username,
    home_city: req.session.home_city
  });
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
        req.session.home_city = user.dataValues.home_city;
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
      home_city: req.body.home_town,
      interest_1: req.body.interest_1,
      interest_2: req.body.interest_2,
      interest_3: req.body.interest_3
    });

    req.session.regenerate(() => {
      req.session.username = req.body.username;
      req.session.home_city = req.body.home_town;
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

// Placed our express.static below our http requests so that they
// won't interfere with our http requests.
app.use(express.static(path.join(__dirname, '../')));

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

//Google Maps need this route because of CORS (will recieve
// CORS error on client side without this route).
app.post('/places', (req, res) => {

  request
  .get(req.body.address)
  .on('response', (google_res) => {
    var google_resData = '';

    google_res.on('data', (data) => {
      google_resData += data;
    });

    google_res.on('end', () => {
      res.send(google_resData);
    })

  })
  .on('error', (err) => {
    console.log(err);
  });
});

app.post('/map', (req, res) => {

  console.log(req.body.address);
  request
  .get(req.body.address)
  .on('response', (google_res) => {
    var google_resData = '';

    google_res.on('data', (data) => {
      google_resData += data;
    });

    google_res.on('end', () => {
      res.send(google_resData);
    })

  })
  .on('error', (err) => {
    console.log(err);
  });
});

http.listen(process.env.PORT || 3000, function(){
  console.log("listening on process.environment.port or listening on 3000");
});
