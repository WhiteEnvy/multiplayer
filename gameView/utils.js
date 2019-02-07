function updateDevModules() {
	for (var module in devModules) {
		if (devModules[module]) {
			devModules[module].update();
		}
	}
}

function addOrbitControls() {
	// devModules.controls = new THREE.TrackballControls( camera );
	// devModules.controls = new THREE.FirstPersonControls(camera);
	devModules.controls = new THREE.OrbitControls(camera, renderer.domElement);
	// devModules.controls.addEventListener('change', render);
	// devModules.controls.maxPolarAngle = Math.PI / 2.2;
	// devModules.controls.maxDistance = 4200;
	// devModules.controls.minDistance = 0;
	// devModules.controls.maxPan = 1000;
	// devModules.controls.minPan = 0;




	devModules.controls.updateCameraTarget = () => {
		devModules.controls.target.set(camera.position.x, camera.position.y, camera.position.z);
	}
	devModules.controls.updatePawnTarget = () => {
		devModules.controls.target.set(game.pawn.THREEobj.position.x, game.pawn.THREEobj.position.y, game.pawn.THREEobj.position.z);
	}

}

var fPControls;

function addFPControls() {
	fPControls = new THREE.FirstPersonControls(camera);
	fPControls.lookSpeed = 10;
	fPControls.movementSpeed = 20;
	fPControls.noFly = false;
	// fPControls.lookVertical = true;
	// fPControls.constrainVertical = true;
	// fPControls.verticalMin = 1.0;
	// fPControls.verticalMax = 2.0;
	// fPControls.lon = -150;
	// fPControls.lat = 120;
}

function updateFPControls() {
	fPControls.update(clock.getDelta());
}


function addStats() {
	devModules.stats = new Stats();
	document.body.appendChild(devModules.stats.dom);
}

function addEventListeners() {
	window.addEventListener('resize', onWindowResize, false);
	container.addEventListener('mousedown', onDocumentMouseDown, false);
	window.addEventListener('keydown', onDocumentKeyPress, false);
	window.addEventListener('mousewheel', render, false);
	// window.addEventListener('change', render, false);
	// window.addEventListener('mousewheel', updateLightPosition, false);
	addRenderListeners();
}

function compareObjByProp(prop, isDecreasing) {
	if (isDecreasing) {
		return (a, b) => {
			return b[prop] - a[prop];
		}
	} else {
		return (a, b) => {
			return a[prop] - b[prop];
		}
	}
}

function compare(a, b) {
	if (a < b)
		return -1;
	if (a > b)
		return 1;
	return 0;
}

function addPropsToObj(obj, propsObj) {
	for (let key in propsObj) {
		if (isArray(propsObj[key])) {
			obj[key] = [];
		} else if (typeof (propsObj[key]) == "object") {
			obj[key] = Object.assign({}, propsObj[key]);
		} else {
			obj[key] = propsObj[key];
		}
	}
}

function isEmpty(obj){
	return !Object.keys(obj).length;
}

function isArray(arr) {
	if (Object.prototype.toString.call(arr) === '[object Array]') {
		return true;
	}
	return false;
}

var QueryString = function () {
	// This function is anonymous, is executed immediately and
	// the return value is assigned to QueryString!
	var query_string = {};
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		// If first entry with this name
		if (typeof query_string[pair[0]] === "undefined") {
			query_string[pair[0]] = decodeURIComponent(pair[1]);
			// If second entry with this name
		} else if (typeof query_string[pair[0]] === "string") {
			var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
			query_string[pair[0]] = arr;
			// If third or later entry with this name
		} else {
			query_string[pair[0]].push(decodeURIComponent(pair[1]));
		}
	}
	return query_string;
}();

var perfomanceOptimization = class perfomanceOptimization {
	constructor(frequency) {
		this.frequency = frequency;
		this.initDate = new Date();
		this.endDate = null;
		this.stabilization = null;
		this.stabilized = false;
	}

	checkEventIsUnavailable(func, initiator) {
		if (this.stabilization) {
			clearTimeout(this.stabilization);
			this.stabilization = null;
		}

		if (this.stabilized) {
			return this.stabilized = false;
		}

		if (func) {
			this.stabilization = setTimeout(() => {
				this.stabilized = true;
				func();
			}, 1000 / 60);
		}

		this.endDate = new Date();
		if (this.endDate - this.initDate < this.frequency) {
			return true;
		}
		this.initDate = new Date();
		return false;
	}
}

var optimizedFuncions = {
	orbitControls: new perfomanceOptimization(20),
	render: new perfomanceOptimization(1000 / 72),
	sound: new perfomanceOptimization(150)
};

function exportToObj() {
	var exporter = new THREE.OBJExporter();
	return exporter.parse(scene);
}

function makeTextFile(text) {
	var textFile = null;
	var data = new Blob([text], {
		type: 'text/plain'
	});

	if (textFile !== null) {
		window.URL.revokeObjectURL(textFile);
	}

	textFile = window.URL.createObjectURL(data);

	return textFile;
};

function loadScene() {
	var link = document.createElement('a');
	link.download = "scene.obj";
	link.href = makeTextFile(exportToObj());
	link.click();
}

function forceRemove(obj) {
	if (!obj) return;

	obj.traverse(function (child) {
		if (child instanceof THREE.Mesh) {
			if (child.material.map) {
				child.material.map.dispose();
				child.material.map = undefined;
			}

			child.material.dispose();
			child.material = undefined;

			child.geometry.dispose();
			child.geometry = undefined;
		}
	});
}

function distanceVector(v1, v2) {
	var dx = v1.x - v2.x;
	var dy = v1.y - v2.y;
	var dz = v1.z - v2.z;

	return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function cutArray(arr, indexes) {
	let newArr = [];
	let cuttedItems = 0;

	indexes.forEach(item => {
		let realIndex = item - cuttedItems;
		newArr.push(arr.splice(realIndex, 1)[0]);
		cuttedItems++;
	});
	return newArr;
}

function createAnimation(data) {
	let {name, duration, tracks} = data;
	let updatedTracks = [];

	tracks.forEach(track => {
		let vkft = new THREE.VectorKeyframeTrack(track.name, Object.values(track.times), Object.values(track.values), THREE.InterpolateLinear);
		updatedTracks.push(vkft)
	});

	return new THREE.AnimationClip(name, duration, updatedTracks);
}

function loadFbxModel(name) {
	return new Promise((resolve, reject) => {
		fbxLoader.load(`./models/fbx/${name}/${name}.fbx`, model => {
			resolve(model);
		},
			process => console.log(process),
			error => console.log(error)
		);
	});
}

function setAnimation(model) {
	if (model.animations && model.animations.length) {
		model.mixer = new THREE.AnimationMixer(model);
		mixers.push(model.mixer);

		model.animations.forEach((animation, index) => {
			model.mixer.clipAction(animation);
			model.mixer._actions[index].name = animation.name;
		});		
	}	
}

function loadMtlModel(modelName, object) {
	mtlLoader.load(`./models/mtl/${modelName}.mtl`, model => {
		object.THREEobj = model;
	},
		process => console.log(process),
		error => console.log(error)
	);
}

function loadObjModel(name) {
	return new Promise((resolve, reject) => {
		mtlLoader.setBaseUrl(`./models/${name}/`);
		mtlLoader.setPath(`./models/${name}/`);

		mtlLoader.load(`${name}.mtl`, function (materials) {

			materials.preload();
			objLoader.setMaterials(materials);
			objLoader.setPath(`./models/${name}/`);
			objLoader.load(`${name}.obj`, function (object) {
				object.isLoaded = true;
				// object.eulerOrder = "YXZ";
				loaded3DModels[name] = object;
				if (isDevMod) {
					object.position.y += 20;
					setTimeout(() => {
						scene.add(object);
					}, 1000);
				}
				resolve(object);
			});
		});
	});
}

function saveAsImage() {
	var imgData, imgNode;
	var strDownloadMime = "image/octet-stream";
	try {
		var strMime = "image/jpeg";

		camera.aspect = 1920 / 1080;
		camera.updateProjectionMatrix();
		renderer.setSize(1920, 1080);
		render();
		imgData = renderer.domElement.toDataURL(strMime);

		saveFile(imgData.replace(strMime, strDownloadMime), "test.jpg");
		onWindowResize();

	} catch (e) {
		console.log(e);
		return;
	}
}

var saveFile = function (strData, filename) {
	var link = document.createElement('a');
	if (typeof link.download === 'string') {
		document.body.appendChild(link); //Firefox requires the link to be in the body
		link.download = filename;
		link.href = strData;
		link.click();
		document.body.removeChild(link); //remove the link when done
	} else {
		location.replace(uri);
	}
}









function flag() {
	let material = new THREE.MeshStandardMaterial({
		color: 0xfdfdfdf,
		roughness: 0.58
	}),
		geometry = new THREE.PlaneBufferGeometry(100, 100, 42, 42),
		view = new THREE.Mesh(geometry, material);
	scene.add(view);

	function animation() {
		var time = clock.getElapsedTime() * 60;
		var position = game.board.THREEobj.geometry.attributes.position;
		for (var i = 0; i < position.count; i++) {
			// if(i < 500 || i > position.count - 500) continue;
			var y = 1 * Math.sin(i / 5 + (time + i) / 7);
			position.setZ(i, y);
		}
		position.needsUpdate = true;
	}

	renderer.subAnimation.add(animation, "waterAnimation")
}

var mirror,
	cubeCamera;

function addMirror() {
	setTimeout(() => {
		// loadObjModel('r2-d2');
		// loadObjModel('x-wing');
	});


	cubeCamera = new THREE.CubeCamera(1, 10000, 512);
	var materialPhongCube = new THREE.MeshPhongMaterial({
		shininess: 10,
		color: 0xffffff,
		specular: 0x999999,
		envMap: cubeCamera.renderTarget.texture
	});
	var sphereGeometry = new THREE.SphereBufferGeometry(1000, 64, 32);
	mirror = new THREE.Mesh(sphereGeometry, materialPhongCube);
	scene.add(mirror);
	mirror.add(cubeCamera);
	cubeCamera.position.y += 200;
	mirror.color = {
		r: 0,
		g: 0,
		b: 0
	}
	mirror.tick = 0;
	// mirror.visible = false;
	mirror.t = 0;
	mirror.modelIsLoaded = false;

	function cubAnim() {
		mirror.tick++;
		cubeCamera.rotateX(Math.PI / 1120);

		if (loaded3DModels['r2-d2']) {
			mirror.t += 0.01;
			loaded3DModels['r2-d2'].rotation.y -= 0.01;
			loaded3DModels['r2-d2'].position.x = 120 * Math.cos(mirror.t) + 0;
			loaded3DModels['r2-d2'].position.z = 120 * Math.sin(mirror.t) + 0;
		}

		if (loaded3DModels['x-wing']) {
			let model = loaded3DModels['x-wing'];
			if (!mirror.modelIsLoaded) {
				model.rotation.y = Math.PI / 2;
				model.scale.set(8, 8, 8);
				model.position.y = 150;
				model.eulerOrder = "YXZ";
				mirror.modelIsLoaded = true;
			}


			if (mirror.tick < 60) {
				model.rotation.x -= 0.01;
				model.position.y -= .1;
				// model.rotation.z -= 0.01;
			} else {
				model.rotation.x += 0.01;
				model.position.y += .1;
				// model.rotation.z += 0.01;
			}
		}



		if (mirror.tick == 60 * 2) {
			mirror.tick = 0;
			if (loaded3DModels['x-wing']) {
				loaded3DModels['x-wing'].rotation = 0;
				loaded3DModels['x-wing'].position = 150;
			}
			if (mirror.tween) mirror.tween.stop();
			mirror.tween = new TWEEN.Tween(mirror.color).to({
				r: Math.random(),
				g: Math.random(),
				b: Math.random()
			}, 2000)
				.onUpdate(function () {
					mirror.color.r = this.r;
					mirror.color.g = this.g;
					mirror.color.b = this.b;
					mirror.material.color.setRGB(this.r, this.g, this.b);
				}).start();
		}
	}

	mirror.material.side = THREE.DoubleSide;
	renderer.subAnimation.add(cubAnim, "cubAnim");
}


function mergeGeometry(mesh) {
	let geometry = new THREE.BufferGeometry();

	mesh.traverse(child => {
		if (child instanceof THREE.Mesh) {
			child.updateMatrix();
			geometry.merge(child.geometry, child.matrix);
		}
	});

	return geometry;
}


function createPointsProjection(mesh, material = shadowMaterial) {
	let group = new THREE.Group();
	mesh.traverse(child => {
		if (child instanceof THREE.Mesh)
			group.add(new THREE.Points(child.geometry, material));
	});

	return group;
}


function verticesAnimation(mesh) {
	function animation(mesh) {
		let speed = verticesAnimation.speed || 60;
		let delta = verticesAnimation.delta || 2;
		let axe = verticesAnimation.axe || "Z";
		let time = clock.getElapsedTime() * speed;

		mesh.traverse(child => {
			if ((child instanceof THREE.Mesh || child instanceof THREE.Points || child instanceof THREE.LineSegments) && child.geometry.attributes) {
				var position = child.geometry.attributes.position;
				for (var i = 0; i < position.count; i++) {
					// if(i < 500 || i > position.count - 500) continue;
					var y = delta * Math.sin(i / 5 + (time + i) / 7);
					switch (axe) {
						case "X":
							position.setX(i, y);
							break;
						case "Y":
							position.setY(i, y);
							break;
						case "Z":
							position.setZ(i, y);
							break;
					}
				}
				position.needsUpdate = true;
			}
		});
	}
	renderer.subAnimation.add(animation.bind(this, mesh), "verticesAnimation");
}

function scaleAnimation(mesh) {
	scaleAnimation.speed = .1;
	renderer.subAnimation.add(animation.bind(this, mesh), "scaleAnim");

	function animation() {
		mesh.traverse(child => {
			if(child instanceof THREE.Mesh){
				if(child.scaleCoef == undefined) child.scaleCoef = -1;
				// if(child.scale.y > 1) child.scaleCoef = -1;
				// if(child.scale.y < 0.2) child.scaleCoef = 1;
				child.scale.y = scaleAnimation.speed * child.scaleCoef;
			}
		});
	}
}

function setBlending(mesh, blending) {
	mesh.traverse(child => {
		if (child instanceof THREE.Mesh) {
			if (child.material.length) {
				child.material.forEach(material => {
					material.transparent = true;
					material.blending = blending;
				})

			} else {
				child.material.transparent = true;
				child.material.blending = blending;
			}
		}
	});
}

function changeMaterial(mesh){
	mesh.traverse(child => {
		if (child instanceof THREE.Mesh) {
			if (child.material.length) {
				child.material.forEach(material => {
					material = new THREE.MeshStandardMaterial();
				})

			} else {
				child.material = new THREE.MeshStandardMaterial({color: 0x78c6ff});
			}
		}
	});	
}

// https://threejs.org/examples/webgl_materials_blending.html
// changeFullMaterialProp('transparent', true);
// changeFullMaterialProp('blending', THREE.AdditiveBlending);