// scene object variables
var renderer, scene, camera, pointLight, spotLight;

// mesa variables
var mesaWidth = 400, mesaHeight = 200;

// paleta variables
var paletaWidth, paletaHeight, paletaDepth, paletaQuality;
var paleta1DirY = 0, paleta2DirY = 0, paletaSpeed = 3;

// pelota variables
var pelota, paleta1, paleta2;
var ballDirX = 1, ballDirY = 1, ballSpeed = 2;

// game-related variables
var score1 = 0, score2 = 0;
// you can change this to any positive whole number
var maxScore = 2;

// set opponent reflexes (0 - easiest, 1 - hardest)
var difficulty = 0.1;

//physijs set up
Physijs.scripts.worker = '/Scripts/physijs_worker.js';
Physijs.scripts.ammo = '/Scripts/ammo.js';

function init()
{	
	score1 = 0;
	score2 = 0;	
	createScene();	
	draw();
}

function createScene()
{
	var WIDTH = window.innerWidth,
	HEIGHT = window.innerHeight;

	var VIEW_ANGLE = 50,
	ASPECT = WIDTH / HEIGHT;

	var canvas = document.getElementById("canvas");

	renderer = new THREE.WebGLRenderer({antialias:true});

	camera = new THREE.PerspectiveCamera(
		VIEW_ANGLE,
		ASPECT,
		0.2,
		500);

	scene = new Physijs.Scene({reportsize:6, fixedTimeStep:1/60});

	scene.add(camera);

	
	renderer.setSize(WIDTH, HEIGHT);

	canvas.appendChild(renderer.domElement);

	var planeWidth = mesaWidth,
		planeHeight = mesaHeight,
		planeQuality = 10;
		
	var paleta1Material = Physijs.createMaterial( new THREE.MeshLambertMaterial(
		{
		  color: 0x1B32C0
		}));

	var paleta2Material = Physijs.createMaterial( new THREE.MeshLambertMaterial(
		{
		  color: 0xFF4045
		}));

	var planeMaterial = Physijs.createMaterial( new THREE.MeshLambertMaterial(
		{
		  color: 0xffffff
		}));

	var mesaMaterial =new THREE.MeshLambertMaterial(
		{
		  color: 0x33bbaa
		});

	var pisoMaterial = new THREE.MeshLambertMaterial(
		{
		  color: 0x888888
		});
		
	// Plano de area de juego
	var plane = new Physijs.PlaneMesh(
	  new THREE.PlaneGeometry(
		planeWidth * 0.95,
		planeHeight,
		planeQuality,
		planeQuality),
		planeMaterial
	);
	  
	scene.add(plane);
	plane.receiveShadow = false;	
	
	//creamos la mesa con su mesh y le damos posicion
	var mesa = new THREE.Mesh(
		new THREE.CubeGeometry(
			planeWidth,
			planeHeight * 1.03,
			100,
			planeQuality,
			planeQuality,
			1
		),
		mesaMaterial
	);

	mesa.position.z = -51;
	scene.add(mesa);
	mesa.receiveShadow = false;	
		
	//maerial de la pelota
	var sphereMaterial = new Physijs.createMaterial(
	  new THREE.MeshLambertMaterial(
		{
		  color: 0xD43001
		}));
		
	// Create a pelota with sphere geometry
	pelota = new Physijs.SphereMesh(
		new THREE.SphereGeometry(
			5,
			10,
			10
		),
		sphereMaterial
	);

	scene.add(pelota);
	
	pelota.position.x = 0;
	pelota.position.y = 0;
	pelota.position.z = 5;
	pelota.receiveShadow = false;
	pelota.castShadow = false;

	// pelota.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
	// 	// `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
	// 	console.log(this.other_object);
	// 	console.log("-----------");
	// });
	
	//medidas de la paleta
	paletaWidth = 10;
	paletaHeight = 30;
	paletaDepth = 10;
	paletaQuality = 1;
	//creamos las paletas con su mesh y medidas
	paleta1 = new Physijs.BoxMesh(
		new THREE.CubeGeometry(
			paletaWidth,
			paletaHeight,
			paletaDepth,
			paletaQuality,
			paletaQuality,
			paletaQuality
		),
		paleta1Material
	);

	scene.add(paleta1);

	paleta1.receiveShadow = false;
    paleta1.castShadow = false;
	
	paleta2 = new Physijs.BoxMesh(
		new THREE.CubeGeometry(
			paletaWidth,
			paletaHeight,
			paletaDepth,
			paletaQuality,
			paletaQuality,
			paletaQuality
		),
		paleta2Material
	);
	  
	scene.add(paleta2);
	paleta2.receiveShadow = false;
    paleta2.castShadow = false;	
	
	// colocamos las paletas en sus respectivos lugares
	paleta1.position.x = -mesaWidth/2 + paletaWidth;
	paleta2.position.x = mesaWidth/2 - paletaWidth;
	paleta1.position.z = paletaDepth;
	paleta2.position.z = paletaDepth;
	
	//creamos el piso
	var piso = new THREE.Mesh(
		new THREE.CubeGeometry( 
			1000, 
			1000, 
			3, 
			1, 
			1,
			1
		),
		pisoMaterial
	);

	//posicion del piso
	piso.position.z = -132;
	piso.receiveShadow = false;	
	scene.add(piso);		

	//creamos luz y ponemos posicion
	pointLight = new THREE.PointLight(0xF8D898);
	pointLight.position.x = -500;
	pointLight.position.y = 0;
	pointLight.position.z = 1000;
	pointLight.intensity = 2;
	pointLight.distance = 10000;
	scene.add(pointLight);
		
	// add a spot light para las sombras
    spotLight = new THREE.SpotLight(0xF8D898);
    spotLight.position.set(0, 0, 460);
    spotLight.intensity = 1.5;
    spotLight.castShadow = true;
    scene.add(spotLight);
	
	renderer.shadowMapEnabled = true;		
}

function draw()
{	
	renderer.render(scene, camera);
	
	
	ballPhysics();
	cameraPhysics();
	paletaPhysics();
	playerpaletaMovement();
	opponentpaletaMovement();
	matchScoreCheck();	

	requestAnimationFrame(draw);
}

function ballPhysics()
{
	// if pelota goes off the 'left' side (Player's side)
	if (pelota.position.x <= -mesaWidth/2)
	{	
		// CPU scores
		score2++;
		// update scoreboard HTML
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		// reset pelota to centerada
		resetBall(2);
		
	}
	
	// if pelota goes off the 'right' side (CPU's side)
	if (pelota.position.x >= mesaWidth/2)
	{	
		// Player scores
		score1++;
		// update scoreboard HTML
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		// reset pelota to center
		resetBall(1);
	}
	
	// if pelota goes off the top side (side of mesa)
	if (pelota.position.y <= -mesaHeight/2)
	{
		ballDirY = -ballDirY;
	}	
	// if pelota goes off the bottom side (side of mesa)
	if (pelota.position.y >= mesaHeight/2)
	{
		ballDirY = -ballDirY;
	}
	
	// update pelota position over time
	pelota.position.x += ballDirX * ballSpeed;
	pelota.position.y += ballDirY * ballSpeed;
	
	// limit pelota's y-speed to 2x the x-speed
	// this is so the pelota doesn't speed from left to right super fast
	// keeps game playable for humans
	if (ballDirY > ballSpeed * 2)
	{
		ballDirY = ballSpeed * 2;
	}
	else if (ballDirY < -ballSpeed * 2)
	{
		ballDirY = -ballSpeed * 2;
	}
}

// Handles CPU paleta movement and logic
function opponentpaletaMovement()
{
	// Lerp towards the pelota on the y plane
	paleta2DirY = (pelota.position.y - paleta2.position.y) * difficulty;
	
	// in case the Lerp function produces a value above max paleta speed, we clamp it
	if (Math.abs(paleta2DirY) <= paletaSpeed)
	{	
		paleta2.position.y += paleta2DirY;
	}
	// if the lerp value is too high, we have to limit speed to paletaSpeed
	else
	{
		// if paleta is lerping in +ve direction
		if (paleta2DirY > paletaSpeed)
		{
			paleta2.position.y += paletaSpeed;
		}
		// if paleta is lerping in -ve direction
		else if (paleta2DirY < -paletaSpeed)
		{
			paleta2.position.y -= paletaSpeed;
		}
	}
	// We lerp the scale back to 1
	// this is done because we stretch the paleta at some points
	// stretching is done when paleta touches side of mesa and when paleta hits pelota
	// by doing this here, we ensure paleta always comes back to default size
	paleta2.scale.y += (1 - paleta2.scale.y) * 0.2;	
}


// Handles player's paleta movement
function playerpaletaMovement()
{
	// move left
	if (Key.isDown(Key.A))		
	{
		// if paleta is not touching the side of mesa
		// we move
		if (paleta1.position.y < mesaHeight * 0.45)
		{
			paleta1DirY = paletaSpeed * 0.5;
		}
		// else we don't move and stretch the paleta
		// to indicate we can't move
		else
		{
			paleta1DirY = 0;
		}
	}	
	// move right
	else if (Key.isDown(Key.D))
	{
		// if paleta is not touching the side of mesa
		// we move
		if (paleta1.position.y > -mesaHeight * 0.45)
		{
			paleta1DirY = -paletaSpeed * 0.5;
		}
		// else we don't move and stretch the paleta
		// to indicate we can't move
		else
		{
			paleta1DirY = 0;
		}
	}
	// else don't move paleta
	else
	{
		// stop the paleta
		paleta1DirY = 0;
	}
	
	paleta1.scale.y += (1 - paleta1.scale.y) * 0.2;	
	paleta1.scale.z += (1 - paleta1.scale.z) * 0.2;	
	paleta1.position.y += paleta1DirY;
}

// Handles camera and lighting logic
function cameraPhysics()
{
	
	// move to behind the player's paleta
	camera.position.x = paleta1.position.x - 100;
	camera.position.y = paleta1.position.y;
	camera.position.z = paleta1.position.z + 100 + 0.04 ;
	
	// rotate to face towards the opponent
	camera.rotation.x = -0.01 * Math.PI/180;
	camera.rotation.y = -60 * Math.PI/180;
	camera.rotation.z = -90 * Math.PI/180;
}

// Handles paleta collision logic
function paletaPhysics()
{
	// PLAYER paleta LOGIC
	
	// if pelota is aligned with paleta1 on x plane
	// remember the position is the CENTER of the object
	// we only check between the front and the middle of the paleta (one-way collision)
	if (pelota.position.x <= paleta1.position.x + paletaWidth
	&&  pelota.position.x >= paleta1.position.x)
	{
		// and if pelota is aligned with paleta1 on y plane
		if (pelota.position.y <= paleta1.position.y + paletaHeight/2
		&&  pelota.position.y >= paleta1.position.y - paletaHeight/2)
		{
			// and if pelota is travelling towards player (-ve direction)
			if (ballDirX < 0)
			{
				// stretch the paleta to indicate a hit
				paleta1.scale.y = 15;
				// switch direction of pelota travel to create bounce
				ballDirX = -ballDirX;
				// we impact pelota angle when hitting it
				// this is not realistic physics, just spices up the gameplay
				// allows you to 'slice' the pelota to beat the opponent
				ballDirY -= paleta1DirY * 0.7;
			}
		}
	}
	
	// OPPONENT paleta LOGIC	
	
	// if pelota is aligned with paleta2 on x plane
	// remember the position is the CENTER of the object
	// we only check between the front and the middle of the paleta (one-way collision)
	if (pelota.position.x <= paleta2.position.x + paletaWidth
	&&  pelota.position.x >= paleta2.position.x)
	{
		// and if pelota is aligned with paleta2 on y plane
		if (pelota.position.y <= paleta2.position.y + paletaHeight/2
		&&  pelota.position.y >= paleta2.position.y - paletaHeight/2)
		{
			// and if pelota is travelling towards opponent (+ve direction)
			if (ballDirX > 0)
			{
				// stretch the paleta to indicate a hit
				paleta2.scale.y = 15;	
				// switch direction of pelota travel to create bounce
				ballDirX = -ballDirX;
				// we impact pelota angle when hitting it
				// this is not realistic physics, just spices up the gameplay
				// allows you to 'slice' the pelota to beat the opponent
				ballDirY -= paleta2DirY * 0.7;
			}
		}
	}
}

function resetBall(loser)
{
	// position the pelota in the center of the mesa
	pelota.position.x = 0;
	pelota.position.y = 0;
	
	// if player lost the last point, we send the pelota to opponent
	if (loser == 1)
	{
		ballDirX = -1;
	}
	// else if opponent lost, we send pelota to player
	else
	{
		ballDirX = 1;
	}
	
	// set the pelota to move +ve in y plane (towards left from the camera)
	ballDirY = 1;
}

var bounceTime = 0;
// checks if either player or opponent has reached 7 points
function matchScoreCheck()
{
	// if player has 7 points
	if (score1 >= maxScore)
	{
		// stop the pelota
		ballSpeed = 0;
		// write to the banner
		document.getElementById("scores").innerHTML = "Player wins!";		
		// make paleta bounce up and down
		bounceTime++;
		paleta1.position.z = Math.sin(bounceTime * 0.1) * 10;
		// enlarge and squish paleta to emulate joy
		paleta1.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 10;
		paleta1.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) * 10;
	}
	// else if opponent has 7 points
	else if (score2 >= maxScore)
	{
		// stop the pelota
		ballSpeed = 0;
		// write to the banner
		document.getElementById("scores").innerHTML = "CPU wins!";
		// make paleta bounce up and down
		bounceTime++;
		paleta2.position.z = Math.sin(bounceTime * 0.1) * 10;
		// enlarge and squish paleta to emulate joy
		paleta2.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 10;
		paleta2.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) * 10;
	}
}