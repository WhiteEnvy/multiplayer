var socket = io();

$(function () {
    socket.on('user connected', users => initGame(users));
    socket.on('user disconnected', user => disconnectUser(user))
    socket.on('user actions', user => userAction(user))
    socket.on('add player', user => {
        createUser(user);
        me = user;
    });

    $(window).keydown(e => {
        if (e.which == 32) {
            jump();
        }
    });

    window.addEventListener("touchstart", jump, false);

    $(window).keyup(e => {
        if (e.which == 32) {
            if(!me) return;
            socket.emit('stopJump');
        }
    });

    $('#player-name').keydown(e => {
        if (e.which == 13) {
            setName();
        }
    });

    $('#go').click(() => {
        setName();
    });

    function setName() {
        if($('#player-name').val() == '') return;
        socket.emit('set name', {name: $('#player-name').val(), color: Math.random() * 0xffffff});
        $('#init').remove();
    }

    function jump(){
        if(!me) return;
        socket.emit('startJump');
    }
});