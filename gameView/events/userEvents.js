function onDocumentMouseDown(event) {
	if (event.which !== 1) return;
    event.preventDefault();

	document.removeEventListener('mousemove', onDocumentMouseMove, false);
	document.addEventListener('mousemove', onDocumentMouseMove, false);
	document.addEventListener('mouseup', onDocumentMouseUp, false);

	findRaycasterPoint(event);
	findMousePositionOnScene();
	checkIntersection();
}

function onDocumentMouseMove(event) {
    for (var func in mouseMoveFunctions) {
        mouseMoveFunctions[func](event);
    }
    // updateLightPosition();
}

function onDocumentMouseUp(event) {
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
}

var mouseMoveFunctions = {
    init: (event) => {
        event.preventDefault();
        findRaycasterPoint(event);
    },
    findMousePositionOnScene: findMousePositionOnScene
};

function onDocumentKeyPress(event) {
//	event.which
}

function onWindowResize() {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    render();
}

$('#roll').click(() => {
    game.start();
});

$('#close').click(()=>{
    $('#message').toggle();
    game.createBuiling();
});

$('#logo').click(()=>{
    game.start();
});

$('#rotateLeft').click(()=>{
    game.rotateCameraLeft();
});

$('#rotateRight').click(()=>{
    game.rotateCameraRight();
});

$('#zoom').click(function() {
    if(game.isZoomDisabled || game.isRotateDisabled) return;
    if(camera.isZoomed){        
        $(this).addClass('glyphicon-zoom-in');
        $(this).removeClass('glyphicon-zoom-out');
        game.zoomOut();
        camera.isZoomed = false;
    }
    else{
        $(this).removeClass('glyphicon-zoom-in');
        $(this).addClass('glyphicon-zoom-out');
        
        game.zoomIn();
        camera.isZoomed = true;
    }
    
});

function addRenderListeners(){
    let startRenderEvents = ['mousedown', 'touchstart'],
        endRenderEvents = ['mouseup', 'touchend'];

    startRenderEvents.forEach(event => {
        window.addEventListener(event, elementEvents.startRender.listen)
    })
    endRenderEvents.forEach(event => {
        window.addEventListener(event, elementEvents.stopRender.listen)
    })
}