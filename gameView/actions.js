$(window).keydown(e => {
    keyState[e.which] = true;
});

$(window).keyup(e => {
    keyState[e.which] = false;
});

window.addEventListener("touchstart", jump, false);

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
    socket.emit('set name', {name: $('#player-name').val(), color: Math.random() * 0xffffff, id: socket.id});
    $('#init').remove();
}

function jump(){
    if(!me || !myView) return;
    myView.position.y += 5;
    // updateCameraPosition(myView.position);
    camera.position.y += 5;
    devModules.controls.center.y += 5;

	// camera.position.z += 1500;
    // socket.emit('startJump', myView.position);
}


var keyState = {
    32: false //space
};

(function loop () {
    if(keyState[32]) jump();

    setTimeout(loop, 300);
})();