(function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(21, container.offsetWidth / container.offsetHeight, 0.1, 5000);
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();
	setCameraDefaultPosition();
	createLight();

	renderer = new THREE.WebGLRenderer({
		antialias: true
	});

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
	addEventListeners();
	animate();
	render();
	// addStats();
})();

function animate() {
	requestAnimationFrame(animate);
	if (optimizedFuncions.render.checkEventIsUnavailable()) return;

	renderer.subAnimation.play();
	render();

	updateDevModules();
}

function render() {
	renderer.render(scene, camera);
}

var userViews;
var me;

function initGame(users) {
	console.log(`hello - ${users}`);
	if (!users || userViews) return;
	loadText.then(() => {
		for (let id in users) {
			createUser(users[id]);
		}
	});
}

function createUser(user) {
	if (!userViews) userViews = {};
	let material = new THREE.MeshPhongMaterial({ color: user.color });
	let geometry = new THREE.CubeGeometry(50, 50, 50, 1, 1, 1);
	let mesh = new THREE.Mesh(geometry, material);
	let player = new THREE.Group();
	player.add(mesh);

	let text = createText(user.name, user.color, 10);
	// text.rotateY(Math.PI / 2);
	text.position.y = 50;
	text.position.x -= 25;
	player.add(text);

	userViews[user.id] = player;
	player.position.copy(user.position);
	scene.add(player);
}

function disconnectUser(user) {
	if(!user) return;
	scene.remove(userViews[user.id]);
	delete userViews[user.id];
}

function userAction(user) {
	userViews[user.id].position.copy(user.position);
}

