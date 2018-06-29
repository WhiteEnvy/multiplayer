var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = {};

// app.use('/', express.static(__dirname));
// app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
// http.listen(4500, () =>  console.log('listening on :4500'));

app.set('port', (process.env.PORT || 3000));
app.use('/', express.static(__dirname));


io.on('connection', socket => {
    users[socket.conn.id] = new User(socket.conn.id);
    let user = users[socket.conn.id];

    io.emit('user connected', { users, id: user.id });


    socket.on('disconnect', () => {
        console.log(user);
        socket.broadcast.emit('user disconnected', user);
        delete users[socket.conn.id];
    });

    
    socket.on('startJump', () => {
        user.isJumped = true;
        user.position.y += 5;
        io.emit('user actions', user);
    });
    socket.on('stopJump', () => {
        user.isJumped = false;
        io.emit('user actions', user);
    })
});


http.listen(app.get('port'), function() {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
    });

class User {
    constructor(id){
        this.id = id;
        this.position = {
            x: 0,
            y: 0,
            z: 0
        };
        this.isJumped = false;
        this.color = Math.random() * 0xffffff;
    }
}