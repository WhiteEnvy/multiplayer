var socket = io();

$(function () {
    socket.on('user connected', user => initGame(user));
    socket.on('user disconnected', user => disconnectUser(user))
    socket.on('user actions', user => userAction(user))

    $(window).keydown(e => {
        if (e.which == 32) {
            socket.emit('startJump');
        }
    });
    $(window).keyup(e => {
        if (e.which == 32) {
            socket.emit('stopJump');
        }
    });
});