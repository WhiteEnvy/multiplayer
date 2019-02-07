var socket = io();

$(function () {
    socket.on('world info', users => updateGame(users));
    socket.on('user connected', users => initGame(users));
    socket.on('user disconnected', user => disconnectUser(user))
    // socket.on('user actions', user => userAction(user));
    socket.on('add player', (user) => {
        if(socket.id == user.id){
            me = user;
        }
    });
    
    (function sendUserInfo() {
        socket.emit('user info', user);
        setTimeout(sendUserInfo, 1000/16);
    });
});