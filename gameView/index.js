(function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(21, container.offsetWidth / container.offsetHeight, 0.1, 5000);
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();
	// setCameraDefaultPosition();
	createLight();

	renderer = new THREE.WebGLRenderer();

	renderer.setSize(container.offsetWidth, container.offsetHeight);
	renderer.setClearColor(0x1f1f1f);
	renderer.shadowMapEnabled = true;
	renderer.isRunning = true;
	renderer.subAnimation = {
		animations: {},
		add: (func, name) => {
			renderer.subAnimation.animations[name] = func;
			renderer.renderQueue.add(name);
		},
		remove: (name) => {
			delete renderer.subAnimation.animations[name];
			renderer.renderQueue.remove(name);
		},
		play: () => {
			let animations = renderer.subAnimation.animations;
			if (!Object.keys(animations).length) return;

			for (let func in animations) {
				animations[func]();
			}
		}
	};

	renderer.renderQueue = {
		queue: {},
		add: val => renderer.renderQueue.queue[val] = val,
		remove: val => delete renderer.renderQueue.queue[val],
		length: () => Object.keys(renderer.renderQueue.queue).length
	};

	container.appendChild(renderer.domElement);
	canvas = document.getElementsByTagName('canvas')[0];

	addOrbitControls();
	updateCameraPosition({x:0, y:0, z:0})
	addEventListeners();
	animate();
	render();
	addStats();
})();

function animate() {
	requestAnimationFrame(animate);
	// if (optimizedFuncions.render.checkEventIsUnavailable()) return;
	renderer.subAnimation.play();
	render();

	updateDevModules();
}

function render() {
	renderer.render(scene, camera);
}