 /* Cristhian Sotelo-Plaza
    ID 30004060
    SENG513 B03 WINTER 2019
    Assignment 3 */

$(document).ready(function() {
  $(function () {
      var socket = io();

      socket.emit('user name', $('#username').html());
      socket.emit('user color', $('#userColor').html());

      $('form').submit(function(e){
        e.preventDefault(); // prevents page reloading
        socket.emit('chat message', $('#userinput').val());
        $('#userinput').val('');
        return false;
      });

      socket.on('chat message', function(msg){
        var msgStr = "<li style=\"color:" + msg.color + ";\">" + msg.message + "</li>";
        if (msg.color == $('#userColor').html()) {
          msgStr = "<li style=\"color:" + msg.color + ";\"><b>" + msg.message + "</b></li>";
        }
        $('#messages').append(msgStr);
      });

      socket.on('inactive user', function(user){
        var litem = "ul#userlist li:contains(" + user.name + ")";
        $(litem).remove();
      });

      socket.on('active user', function(user){
        var userStr = "<li style=\"color:" + user.color + ";\">" + user.name + "</li>";
        $('#userlist').append(userStr);
      });

      socket.on('change name', function(name) {
        $('#username').html(name);
        $('#firstlabel').html(name);
        $('#fourthlabel').html(name);
      })

      socket.on('change color', function(color) {
        $('#userColor').html(color);
      })

  });
});
