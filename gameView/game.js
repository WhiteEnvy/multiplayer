var userViews;

var me;
var myView;

function initGame(users) {
    console.log(`hello`);
	if (isEmpty(users)) return;
	loadText.then(() => {
        console.log('!----text loaded----!');
		for (let id in users) {
            addPlayer(users[id]);
        }
        createFloor();
	});
}

function createFloor() {
    let geo = new THREE.PlaneGeometry(1000, 1000);
    geo.rotateX(-Math.PI/2);
    let mat = new THREE.MeshBasicMaterial({color: 0xe0e0e0});
    let mesh = new THREE.Mesh(geo, mat);
    mesh.position.y -= 25;
    scene.add(mesh);
}

function updateGame(users){
    if(userViews){
        for(let id in users){
            // debugger;
            updateUserPosition(users[id]);
        }
    }
    else{
        initGame(users);
    }
}

function createUser(user) {
	if (!userViews) userViews = {};
	let material = new THREE.MeshPhongMaterial({ color: user.color });
	let geometry = new THREE.CubeGeometry(5, 5, 5, 1, 1, 1);
	let mesh = new THREE.Mesh(geometry, material);
	let player = new THREE.Group();
	player.add(mesh);

	let text = createText(user.name, user.color, 1, 1);
	text.position.y = 5;
	text.position.x -= 2.5;
	player.add(text);

	userViews[user.id] = player;
	player.position.copy(user.position);
	scene.add(player);
	return player;
}

function disconnectUser(user) {
	if(!user) return;
	scene.remove(userViews[user.id]);
	delete userViews[user.id];
}

function updateUserPosition(user) {
    if(user.id != socket.id){
        userViews[user.id].position.copy(user.position);
    }
}

function addPlayer(user){
    let player = createUser(user);
	if(user.id == socket.id){
		myView = player;
	}
}

