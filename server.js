var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = {};

// app.use('/', express.static(__dirname));
// app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
// http.listen(4500, () =>  console.log('listening on :4500'));

app.set('port', (process.env.PORT || 4000));
app.use('/', express.static(__dirname));


io.on('connection', socket => {
    let user;

    io.emit('user connected', users );

    socket.on('disconnect', () => {
        console.log(user);
        socket.broadcast.emit('user disconnected', user);
        delete users[socket.conn.id];
    });

    socket.on('set name', data => {
        users[socket.conn.id] = new User(socket.conn.id, data.name, data.color);
        user = users[socket.conn.id];

        io.emit('add player', user);
    });
    
    socket.on('startJump', () => {
        if(!user) return;
        user.isJumped = true;
        user.position.y += 5;
        io.emit('user actions', user);
    });
    socket.on('stopJump', () => {
        if(!user) return;
        user.isJumped = false;
        io.emit('user actions', user);
    })
});


http.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});

class User {
    constructor(id, name, color){
        this.id = id;
        this.name = name;
        this.position = {
            x: 0,
            y: 0,
            z: 0
        };
        this.isJumped = false;
        this.color = color;
    }
}