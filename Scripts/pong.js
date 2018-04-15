var renderer,
scene,
camera,
pointLight,
spotLight,
mesaWidth = 300,
mesaHeight = 200,
paleta1,
paleta2,
paletaWidth,
paletaHeight,
paletaDepth,
paleta1DirY = 0,
paleta2DirY = 0,
paletaVel = 3,
pelota,
pelotaDirX = 1,
pelotaDirY = 1,
pelotaVel = 3,
scorePlayer = 0,
scoreCPU = 0,
maxScore = 3, //score maximo
difficulty = 0.15; //(0 - facil, 1 - dificil)

function init()
{	
	createScene();	
	run();
}

function createScene()
{
	var VIEW_ANGLE = 60,
	ASPECT = window.innerWidth / window.innerHeight;

	var canvas = document.getElementById("canvas");

	renderer = new THREE.WebGLRenderer({antialias:true});

	camera = new THREE.PerspectiveCamera(
		VIEW_ANGLE,
		ASPECT,
		0.2,
		500);

	scene = new THREE.Scene();

	scene.add(camera);
	
	renderer.setSize(window.innerWidth, window.innerHeight);

	canvas.appendChild(renderer.domElement);

	var planoWidth = mesaWidth,
		planoHeight = mesaHeight,
		planoQuality = 10;
		
	var paleta1Material = new THREE.MeshLambertMaterial(
		{
		  color: 0x1B32C0
		});

	var paleta2Material = new THREE.MeshLambertMaterial(
		{
		  color: 0xFF4045
		});

	var planoMaterial = new THREE.MeshLambertMaterial(
		{
		  color: 0x808080
		});

	var mesaMaterial =new THREE.MeshLambertMaterial(
		{
		  color: 0x33bbaa
		});

	var pisoMaterial = new THREE.MeshLambertMaterial(
		{
		  color: 0x888888
		});
		
	// Plano de area de juego
	var plano = new THREE.Mesh(
	  new THREE.PlaneGeometry(
		planoWidth * 0.95,
		planoHeight,
		planoQuality,
		planoQuality),
		planoMaterial
	);
	  
	scene.add(plano);
	plano.receiveShadow = false;	
	
	//creamos la mesa con su mesh y le damos posicion
	var mesa = new THREE.Mesh(
		new THREE.CubeGeometry(
			planoWidth,
			planoHeight * 1.03,
			100,
			planoQuality,
			planoQuality,
			1
		),
		mesaMaterial
	);

	mesa.position.z = -51;
	scene.add(mesa);
	mesa.receiveShadow = false;	
		
	//maerial de la pelota
	var sphereMaterial = new THREE.MeshLambertMaterial(
		{
		  color: 0xD43001
		});
		
	// Create a pelota with sphere geometry
	pelota = new THREE.Mesh(
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

	//medidas de la paleta
	paletaWidth = 10;
	paletaHeight = 30;
	paletaDepth = 10;

	//creamos las paletas con su mesh y medidas
	paleta1 = new THREE.Mesh(
		new THREE.CubeGeometry(
			paletaWidth,
			paletaHeight,
			paletaDepth
		),
		paleta1Material
	);

	scene.add(paleta1);

	paleta1.receiveShadow = false;
    paleta1.castShadow = false;
	
	paleta2 = new THREE.Mesh(
		new THREE.CubeGeometry(
			paletaWidth,
			paletaHeight,
			paletaDepth
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
	
	scorePlayer = 0;
	scoreCPU = 0;

	camera.position.x = paleta1.position.x - 100;
	camera.position.y = paleta1.position.y;
	camera.position.z = paleta1.position.z + 110 ;
	// rotate to face towards the opponent
	camera.rotation.x = -0.01 * Math.PI/180;
	camera.rotation.y = -60 * Math.PI/180;
	camera.rotation.z = -90 * Math.PI/180;

	window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}


function run()
{	
	renderer.render(scene, camera);
	ganador(); //revisa si hay algun ganador
	pelotaLogica();
	movPaletas();

	paletaPhysics();
	
	requestAnimationFrame(run);
}

function pelotaLogica()
{
	// actualizamos la posicion de la pelota
	pelota.position.x += pelotaDirX * pelotaVel;
	pelota.position.y += pelotaDirY * pelotaVel;

	// Vemos quien metio gol
	if (pelota.position.x <= -mesaWidth/2 || pelota.position.x >= mesaWidth/2 )
	{	
		if(pelota.position.x <= -mesaWidth/2){
			// CPU scores
			scoreCPU++;
			// update scoreboard HTML
			document.getElementById("scores").innerHTML = scorePlayer + "-" + scoreCPU;
			// reset pelota to centerada
			resetBall(2);
		}else{
			// Player scores
			scorePlayer++;
			// update scoreboard HTML
			document.getElementById("scores").innerHTML = scorePlayer + "-" + scoreCPU;
			// reset pelota to center
			resetBall(1);
		}
		
	}
	
	// si la pelota toca los costados
	if (pelota.position.y <= -mesaHeight/2 || pelota.position.y >= mesaHeight/2 )
	{
		pelotaDirY = -pelotaDirY;
	}	

	// // limit pelota's y-Vel to 2x the x-Vel
	// // this is so the pelota doesn't Vel from left to right super fast
	// // keeps game playable for humans
	// if (pelotaDirY > pelotaVel * 2)
	// {
	// 	pelotaDirY = pelotaVel * 2;
	// }
	// else if (pelotaDirY < -pelotaVel * 2)
	// {
	// 	pelotaDirY = -pelotaVel * 2;
	// }
}

function movPaletas()
{
	//oponente CPU------------------------
	// Lerp towards the pelota on the y plano
	paleta2DirY = (pelota.position.y - paleta2.position.y) * difficulty;
	
	// in case the Lerp function produces a value above max paleta Vel, we clamp it
	if (Math.abs(paleta2DirY) <= paletaVel)
	{	
		paleta2.position.y += paleta2DirY;
	}
	// if the lerp value is too high, we have to limit Vel to paletaVel
	else
	{
		// if paleta is lerping in +ve direction
		if (paleta2DirY > paletaVel)
		{
			paleta2.position.y += paletaVel;
		}
		// if paleta is lerping in -ve direction
		else if (paleta2DirY < -paletaVel)
		{
			paleta2.position.y -= paletaVel;
		}
	}
	// We lerp the scale back to 1
	// this is done because we stretch the paleta at some points
	// stretching is done when paleta touches side of mesa and when paleta hits pelota
	// by doing this here, we ensure paleta always comes back to default size
	paleta2.scale.y += (1 - paleta2.scale.y) * 0.2;

	// Jugador ----------------------
	// move left
	if (Key.isDown(Key.A))		
	{
		// if paleta is not touching the side of mesa
		// we move
		if (paleta1.position.y < mesaHeight * 0.45)
		{
			paleta1DirY = paletaVel * 0.5;
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
			paleta1DirY = -paletaVel * 0.5;
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

// Handles paleta collision logic
function paletaPhysics()
{
	// PLAYER paleta LOGIC
	
	// if pelota is aligned with paleta1 on x plano
	// remember the position is the CENTER of the object
	// we only check between the front and the middle of the paleta (one-way collision)
	if (pelota.position.x <= paleta1.position.x + paletaWidth &&  pelota.position.x >= paleta1.position.x)
	{
		// and if pelota is aligned with paleta1 on y plano
		if (pelota.position.y <= paleta1.position.y + paletaHeight/2 &&  pelota.position.y >= paleta1.position.y - paletaHeight/2)
		{
			// and if pelota is travelling towards player (-ve direction)
			if (pelotaDirX < 0)
			{
				// stretch the paleta to indicate a hit
				paleta1.scale.y = 15;
				// switch direction of pelota travel to create bounce
				pelotaDirX = -pelotaDirX;
				// we impact pelota angle when hitting it
				// this is not realistic physics, just spices up the gameplay
				// allows you to 'slice' the pelota to beat the opponent
				pelotaDirY -= paleta1DirY * 0.7;
			}
		}
	}
	
	// OPPONENT paleta LOGIC	
	
	// if pelota is aligned with paleta2 on x plano
	// remember the position is the CENTER of the object
	// we only check between the front and the middle of the paleta (one-way collision)
	if (pelota.position.x <= paleta2.position.x + paletaWidth
	&&  pelota.position.x >= paleta2.position.x)
	{
		// and if pelota is aligned with paleta2 on y plano
		if (pelota.position.y <= paleta2.position.y + paletaHeight/2
		&&  pelota.position.y >= paleta2.position.y - paletaHeight/2)
		{
			// and if pelota is travelling towards opponent (+ve direction)
			if (pelotaDirX > 0)
			{
				// stretch the paleta to indicate a hit
				paleta2.scale.y = 15;	
				// switch direction of pelota travel to create bounce
				pelotaDirX = -pelotaDirX;
				// we impact pelota angle when hitting it
				// this is not realistic physics, just spices up the gameplay
				// allows you to 'slice' the pelota to beat the opponent
				pelotaDirY -= paleta2DirY * 0.7;
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
		pelotaDirX = -1;
	}
	// else if opponent lost, we send pelota to player
	else
	{
		pelotaDirX = 1;
	}
	
	// set the pelota to move +ve in y plano (towards left from the camera)
	pelotaDirY = 1;
}

var bounceTime = 0;

function ganador()
{
	// jugador gana
	if (scorePlayer >= maxScore || scoreCPU >= maxScore)
	{
		// detener pelota
		pelotaVel = 0;
		if(scorePlayer>= maxScore){
			document.getElementById("scores").innerHTML = "Player wins!";
			paleta1.position.z = 14 + Math.sin(bounceTime * 0.1) * 10;
		}else{
			document.getElementById("scores").innerHTML = "CPU wins!";
			paleta2.position.z = 14 + Math.sin(bounceTime * 0.1) * 10;
		}
		bounceTime++;
	}
}

window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

var Key = {
  _pressed: {},

  A: 65,
  W: 87,
  D: 68,
  S: 83,
  SPACE: 32,
  
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  
  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },
  
  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};

