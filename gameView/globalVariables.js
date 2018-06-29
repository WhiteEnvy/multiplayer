var scene, camera, renderer, light;
var raycaster, mouse;
var mousePos;
var activeObj;

var devModules = {
	controls: false,
	stats: false
};

var controlsPositions = {
    x: 0,
    y: 0,
    z: 0
};
// var cameraPositions = {
//     x: 0,
//     y: 0,
//     z: 1500
// }

var cameraPositions = {
    x: 1550,
    y: 1550,
    z: 1550
}

var container = document.getElementById('scene');
var canvas;
var mixers = [];
var game;
var globalLight;
var clock = new THREE.Clock();
var activeMesh;