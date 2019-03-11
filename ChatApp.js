/* Cristhian Sotelo-Plaza
   ID 30004060
   SENG513 B03 WINTER 2019
   Assignment 3 */

//npm install express --save
//npm install body-parser --save
//npm install ejs --save
//npm install cookie-parser --save
//npm install express-session --save
//npm install socket.io --save


var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cookieParser = require('cookie-parser');
var session = require('express-session');
var userInfo = [{name: "", color: ""}];
var activeUsers = [{name: "", color: ""}];
var chatLog = [{message: "", color: ""}];
//var thisUser = {name: "user", color: "black"};

//Middleware for handling URL encoded form data
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//View Engine
app.set('view engine', 'ejs');

// initialize cookie-parser to allow us access the cookies stored in the browser.
app.use(cookieParser());

// initialize express-session to allow us to track the user across sessions.
app.use(session({
    secret: 'es_un_secreto',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*60*24
    }
}));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  var thisUser = {name: "user", color: "orange"};

  if(req.session.user != null) {
    thisUser.name = req.session.user;
    thisUser.color = req.session.userColor;
  }
  else {
    var usernum = userInfo.length;
    thisUser.name += usernum;
    thisUser.color = '#' + Math.random().toString(16).slice(-6);
    req.session.user = thisUser.name;
    req.session.userColor = thisUser.color;
    userInfo.push(thisUser);
  }

  res.render('index', {
    msgs: chatLog,
    user: thisUser.name,
    myColor: thisUser.color,
    actives: activeUsers
  });
});


io.on('connection', function(socket){
  var connectUser = {name: "Someone", color: "blue"};

  socket.on('user name', function(username) {
    connectUser.name = username;

    socket.on('user color', function(userColor) {
      connectUser.color = userColor;

      var isActive = false;

      for (var i = 0; i < activeUsers.length; i++) {
        if (activeUsers[i].name == connectUser.name){
          isActive = true;
          break;
        }
      }

      if (!isActive) {
        activeUsers.push(connectUser);
        io.emit('active user', connectUser);
      }
    });
  });

  //console.log(connectUser);

  socket.on('disconnect', function(){
    io.emit('inactive user', connectUser);
    for (var i = 0; i < activeUsers.length; i++) {
      if (activeUsers[i].name == connectUser.name){
        activeUsers.splice(i, 1);
        break;
      }
    }
  });

  socket.on('chat message', function(msg){
    if (msg.length > 0) {
      if (msg.includes("/nick")) {
        var isValid = true;
        var msgParts = msg.split(" ", 2);
        var newName = connectUser.name;
        var newColor = connectUser.color;
        if (msg.includes("/nickcolor")) {
          newColor = "#" + msgParts[1];
        }
        else {
          newName = msgParts[1];
          for (var i = 0; i < userInfo.length; i++) {
            if (userInfo[i].name == newName){
              isValid = false;
              break;
            }
          }
        }

        if (isValid) {
          for (var i = 0; i < activeUsers.length; i++) {
            if (activeUsers[i].name == connectUser.name){
              activeUsers.splice(i, 1);
              break;
            }
          }
          for (var i = 0; i < userInfo.length; i++) {
            if (userInfo[i].name == connectUser.name){
              userInfo.splice(i, 1);
              break;
            }
          }
          io.emit('inactive user', connectUser);
          connectUser.name = newName;
          connectUser.color = newColor;
          userInfo.push(connectUser);
          activeUsers.push(connectUser);
          socket.emit('change name', connectUser.name);
          socket.emit('change color', connectUser.color);
          io.emit('active user', connectUser);
        }
      }
      else {
        var myTime = new Date().toLocaleTimeString();
        msg = myTime + " " + connectUser.name + ": " + msg;
        var doc = {message: msg, color: connectUser.color};
        chatLog.push(doc);
        io.emit('chat message', doc);
      }
    }
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
