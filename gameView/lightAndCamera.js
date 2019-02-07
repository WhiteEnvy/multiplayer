function resetCamera(positionZ) {
	camera.position.copy(cameraPositions);
	camera.updateProjectionMatrix();
	updateLightPosition();
	light.position.y = 0;
	light.position.x = 0;
	resetControlsPotision();
}

function setCameraDefaultPosition() {
	camera.position.copy(cameraPositions);
	camera.eulerOrder = "YXZ";
	camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function createLight() {
	// scene.add(globalLight = new THREE.AmbientLight(0xf0f0f0, 1.5));
	light = new THREE.SpotLight(0xe6cda9, .41);
	light.castShadow = true;
	light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(70, 1, 10, 2000));
	light.shadow.mapSize.width = 1024;
	light.shadow.mapSize.height = 1024;
	light.shadowCameraVisible = true;
	light.shadowMapDarkness = 1;
	light.position.set(325, 950, 134);
	scene.add(light);
	scene.add(globalLight = new THREE.AmbientLight(0xf0f0f0, 2));
}

function updateLightPosition() {
	light.position.copy(camera.position);
}

function resetControlsPotision() {
	devModules.controls.center.copy(controlsPositions);
}

function updateCameraPosition(position) {
	if(!position) return;
	camera.position.copy(position);
	devModules.controls.center.copy(position);
	camera.position.z += 150;
}