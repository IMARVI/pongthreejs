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
paletaVel = 5,
pelota,
pelotaDirX = 1,
pelotaDirY = 1,
pelotaVel = 3,
scorePlayer = 0,
scoreCPU = 0,
maxScore = 3, //score maximo
difficulty = 0.11, //(0 - facil, 1 - dificil)
brinco = 0,
power1= false,
power2= false,
power3= false,
power4= false,
power5= false,
power6= false;

//CPU x positivo
//lado izq y positiva
function init()
{	
	createScene();	
	run();
}

function createScene()
{
	var canvas = document.getElementById("canvas");

	renderer = new THREE.WebGLRenderer({antialias:true});

	camera = new THREE.PerspectiveCamera(
		60,
		window.innerWidth / window.innerHeight,
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
	
	var power1Material = new THREE.MeshLambertMaterial(
		{
		  color: 0xff0000
		});
	var power2Material = new THREE.MeshLambertMaterial(
		{
		  color: 0x00ff00
		});
	var power3Material = new THREE.MeshLambertMaterial(
		{
		  color: 0x0000ff
		});
	var power4Material = new THREE.MeshLambertMaterial(
		{
		  color: 0xffff00
		});
	var power5Material = new THREE.MeshLambertMaterial(
		{
		  color: 0x00ffff
		});
	var power6Material = new THREE.MeshLambertMaterial(
		{
		  color: 0xff00ff
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
		
	// geometria de la pelota
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

	// geometria del poweUp
	pow1 = new THREE.Mesh(
		new THREE.SphereGeometry(
			5,
			10,
			10
		),
		power1Material
	);
	pow1.name= "pow1";

	pow2 = new THREE.Mesh(
		new THREE.SphereGeometry(
			5,
			10,
			10
		),
		power2Material
	);
	pow2.name="pow2";

	pow3 = new THREE.Mesh(
		new THREE.SphereGeometry(
			5,
			10,
			10
		),
		power3Material
	);
	pow3.name= "pow3";

	pow4 = new THREE.Mesh(
		new THREE.SphereGeometry(
			5,
			10,
			10
		),
		power4Material
	);
	pow4.name= "pow4";
	
	pow5 = new THREE.Mesh(
		new THREE.SphereGeometry(
			5,
			10,
			10
		),
		power5Material
	);
	pow5.name= "pow5";
	
	pow6 = new THREE.Mesh(
		new THREE.SphereGeometry(
			5,
			10,
			10
		),
		power6Material
	);
	pow6.name= "pow6";
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
		
	// spotlight para las sombras
  spotLight = new THREE.SpotLight(0xF8D898);
  spotLight.position.set(0, 0, 460);
  spotLight.intensity = 1.5;
  spotLight.castShadow = true;
  scene.add(spotLight);
	
	renderer.shadowMap.enabled = true;	
	
	scorePlayer = 0;
	scoreCPU = 0;

	camera.position.x = paleta1.position.x - 100;
	camera.position.y = paleta1.position.y;
	camera.position.z = paleta1.position.z + 100 ;

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
	fisicaPaleta();
	showPowerUps();
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
			// CPU anota
			scoreCPU++;
			document.getElementById("scores").innerHTML = scorePlayer + "-" + scoreCPU;
			// reset pelota to centerada
			pelotaReset(2);
		}else{
			// jugador anota
			scorePlayer++;
			document.getElementById("scores").innerHTML = scorePlayer + "-" + scoreCPU;
			pelotaReset(1);
		}
	}
	
	// si la pelota toca los costados
	if (pelota.position.y <= -mesaHeight/2 || pelota.position.y >= mesaHeight/2 )
	{
		pelotaDirY = -pelotaDirY;
	}

	//validamos si hay power ups, si hay verificamos si han sido tocados
	if(scene.getObjectByName('pow1')) //este pow hace la pelota mas rapida por 5 segundos vel x 2
	{
		if(pelota.position.y <= pow1.position.y + 5.5 && pelota.position.y >= pow1.position.y - 5.5 &&
			pelota.position.x <= pow1.position.x + 5.5 && pelota.position.x >= pow1.position.x - 5.5 &&
			pow1.visible == true
		)
		{
			pow1.visible = false;
			pelotaVel = pelotaVel *2;
			setTimeout(() => { 
				pelotaVel = 2.5;
		}, 3000)	

		}
	}
	if(scene.getObjectByName('pow2'))// hacemos la paleta mas grande
	{
		if(pelota.position.y <= pow2.position.y + 5.5 && pelota.position.y >= pow2.position.y - 5.5 &&
			pelota.position.x <= pow2.position.x + 5.5 && pelota.position.x >= pow2.position.x - 5.5 &&
			pow2.visible == true
		)
		{
			pow2.visible = false;

			if(pelotaDirX>=0){ //revisamos hacian donde va la pelota para decidir quien le pego
				//paleta Jugador
				paleta1.scale.y = 2;
				setTimeout(() => { 
					paleta1.scale.y = 1;
				}, 7000)
			}else{
				//paleta CPU
				paleta2.scale.y = 2;
				setTimeout(() => { 
					paleta2.scale.y = 1;
				}, 7000)
			}
			
		}
	}
	if(scene.getObjectByName('pow3')) //mover mas lento la paleta
	{
		if(pelota.position.y <= pow3.position.y + 5.5 && pelota.position.y >= pow3.position.y - 5.5 &&
			pelota.position.x <= pow3.position.x + 5.5 && pelota.position.x >= pow3.position.x - 5.5 &&
			pow3.visible == true
		)
		{
			pow3.visible = false;
			if(pelotaDirX>=0){ //revisamos hacian donde va la pelota para decidir quien le pego
				difficulty = difficulty * 2;
				setTimeout(() => { 
					difficulty = difficulty / 2;
				}, 7000)

			}else{
				paletaVel = 3;
				console.log(paletaVel);
				setTimeout(() => { 
					paletaVel = 5
				}, 7000)
			}
		}
	}
	if(scene.getObjectByName('pow4')) //multibola
	{
		if(pelota.position.y <= pow4.position.y + 5.5 && pelota.position.y >= pow4.position.y - 5.5 &&
			pelota.position.x <= pow4.position.x + 5.5 && pelota.position.x >= pow4.position.x - 5.5 &&
			pow4.visible == true
		)
		{
			pow4.visible = false;
			console.log("tocamos el power!!!");
		}
	}
	if(scene.getObjectByName('pow5')) // neblina en el campo
	{
		if(pelota.position.y <= pow5.position.y + 5.5 && pelota.position.y >= pow5.position.y - 5.5 &&
			pelota.position.x <= pow5.position.x + 5.5 && pelota.position.x >= pow5.position.x - 5.5 &&
			pow5.visible == true
		)
		{
			pow5.visible = false;
			console.log("tocamos el power!!!");
		}
	}
	if(scene.getObjectByName('pow6')) 
	{
		if(pelota.position.y <= pow6.position.y + 5.5 && pelota.position.y >= pow6.position.y - 5.5 &&
			pelota.position.x <= pow6.position.x + 5.5 && pelota.position.x >= pow6.position.x - 5.5 &&
			pow6.visible == true
		)
		{
			pow6.visible = false;
			console.log("tocamos el power!!!");
		}
	}
}

function movPaletas()
{
	//oponente CPU------------------------
	//paleta copia direccion de pelota y la dificultad indica la rapidez/precision entre mayor el numero mas dificil
	paleta2DirY = (pelota.position.y - paleta2.position.y) * difficulty;
	paleta2.position.y += paleta2DirY;
	//hacemos la nueva posicion unnuemor absoluto
	
	// Jugador ----------------------
	// movimiento izquierda
	if (Key.isDown(Key.A) || Key.isDown(Key.L))		
	{
		if (paleta1.position.y < mesaHeight * 0.40)
		{
			paleta1DirY = paletaVel * 0.5;
		}
		else
		{
			paleta1DirY = 0;
		}
	}
	
	// movimiento derecha
	else if (Key.isDown(Key.D) || Key.isDown(Key.R))
	{
		if (paleta1.position.y > -mesaHeight * 0.40)
		{
			paleta1DirY = -paletaVel * 0.5;
		}
		else
		{
			paleta1DirY = 0;
		}
	}
	else
	{
		paleta1DirY = 0;
	}
	paleta1.position.y += paleta1DirY;
}

// logica de la colision de paleta
function fisicaPaleta()
{
	//Paleta jugador
	//Revisamos que la pelota toque la paleta en posicion 'x' y 'y'
	if (pelota.position.x <= paleta1.position.x + paletaWidth &&  pelota.position.x >= paleta1.position.x)
	{
		if (pelota.position.y <= paleta1.position.y + paletaHeight/2 &&  pelota.position.y >= paleta1.position.y - paletaHeight/2)
		{
			//revisamos que la pelota vaya en direccion del jugador
			if (pelotaDirX < 0)
			{
				//sonido de 'toque'
				//Cambiamos la direccion de la pelota
				pelotaDirX = -pelotaDirX;
				
				//creamos un efecto slice, cambiando el angulo de direccion en y
				pelotaDirY -= paleta1DirY * 0.7;
			}
		}
	}
	
	// paleta CPU
	//Revisamos que la pelota toque la paleta en posicion 'x' y 'y'
	if (pelota.position.x <= paleta2.position.x + paletaWidth &&  pelota.position.x >= paleta2.position.x)
	{
		if (pelota.position.y <= paleta2.position.y + paletaHeight/2 &&  pelota.position.y >= paleta2.position.y - paletaHeight/2)
		{
			//revisamos que la pelota vaya en direccion del jugador
			if (pelotaDirX > 0)
			{
				//agregar sonido
				//Cambiamos la direccion de la pelota
				pelotaDirX = -pelotaDirX;

				//creamos un efecto slice, cambiando el angulo de direccion en y
				pelotaDirY -= paleta2DirY * 0.7;
			}
		}
	}
}

function pelotaReset(perdedor)
{
	// Ponemos la pelota en el centro de la mesa
	pelota.position.x = 0;
	pelota.position.y = 0;
	pelotaVel=0;

	setTimeout(() => { 
			// si el CPU anoto le enviamos la pelota a CPU y viceversa
			if (perdedor == 1)
			{
				pelotaDirX = -1;
			}
			else
			{
				pelotaDirX = 1;
			}
			pelotaVel = 2.5;
			pelotaDirY = 1;
			
	}, 700)	
}

function ganador()
{
	// jugador gana
	if (scorePlayer >= maxScore || scoreCPU >= maxScore)
	{
		// detener pelota
		pelotaVel = 0;
		if(scorePlayer>= maxScore){
			document.getElementById("scores").innerHTML = "Player wins!";
			paleta1.position.z = 14 + Math.sin(brinco * 0.1) * 10;
		}else{
			document.getElementById("scores").innerHTML = "CPU wins!";
			paleta2.position.z = 14 + Math.sin(brinco * 0.1) * 10;
		}
		brinco++;
	}
}
//se corre un random, si entra, de forma random se selecciona un PU
//Se evalua si ya està desplegado de lo contrario semuestra
function showPowerUps()
{	
	if(Math.floor(Math.random() * 1000) > 996){
		var pow = 3;//Math.floor(Math.random() * 7) ;
		if(pow==1 && !scene.getObjectByName('pow1')){
			pow1.visible=true;
			scene.add(pow1);
			pow1.position.x = Math.floor(Math.random() * 200) - 100;
			pow1.position.y = Math.floor(Math.random() * 200) - 100;
			pow1.position.z = 5;
			//despues de 6 segundos el PU es eliminado
			setTimeout(() => {
				scene.remove(pow1);
			}, 6000)	
		}
		else if(pow == 2 && !scene.getObjectByName('pow2')){
			pow2.visible = true;
			scene.add(pow2);
			pow2.position.x = 0 //Math.floor(Math.random() * 200) - 100;
			pow2.position.y = 0//Math.floor(Math.random() * 200) - 100;
			pow2.position.z = 5;
			setTimeout(() => {
				scene.remove(pow2);
			}, 6000)	
		}
		else if(pow == 3 && !scene.getObjectByName('pow3')){
			pow3.visible = true;
			scene.add(pow3);
			pow3.position.x =0//Math.floor(Math.random() * 200) - 100;
			pow3.position.y =0 //Math.floor(Math.random() * 200) - 100;
			pow3.position.z = 5;
			setTimeout(() => {
				scene.remove(pow3);
			}, 6000)
		}
		else if(pow == 4 && !scene.getObjectByName('pow4')){
			pow4.visible = true;
			scene.add(pow4);
			pow4.position.x = Math.floor(Math.random() * 200) - 100;
			pow4.position.y = Math.floor(Math.random() * 200) - 100;
			pow4.position.z = 5;
			setTimeout(() => {
				scene.remove(pow4);
			}, 6000)
		}
		else if(pow == 5 && !scene.getObjectByName('pow5')){
			pow5.visible = true;
			scene.add(pow5);
			pow5.position.x = Math.floor(Math.random() * 200) - 100;
			pow5.position.y = Math.floor(Math.random() * 200) - 100;
			pow5.position.z = 5;
			setTimeout(() => {
				scene.remove(pow5);
			}, 6000)
		}
		else if(pow == 6 && !scene.getObjectByName('pow6')){
			pow6.visible = true;
			scene.add(pow6);
			pow6.position.x = Math.floor(Math.random() * 200) - 100;
			pow6.position.y = Math.floor(Math.random() * 200) - 100;
			pow6.position.z = 5;
			setTimeout(() => {
				scene.remove(pow6);
			}, 6000)	
		}
	}
}

window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

var Key = {
  _pressed: {},

  A: 65,
  D: 68,
  SPACE: 32,
  L:37,
  R:39,
  
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


function pelotaClon()
{
	// actualizamos la posicion de la pelota
	pelotaClon.position.x += pelotaClonDirX * pelotaVel;
	pelotaClon.position.y += pelotaClonDirY * pelotaVel;

	// Vemos quien metio gol
	if (pelotaClon.position.x <= -mesaWidth/2 || pelotaClon.position.x >= mesaWidth/2 )
	{	
		if(pelotaClon.position.x <= -mesaWidth/2){
			// CPU anota
			scoreCPU++;
			document.getElementById("scores").innerHTML = scorePlayer + "-" + scoreCPU;
			// reset pelota to centerada
			pelotaReset(2);
		}else{
			// jugador anota
			scorePlayer++;
			document.getElementById("scores").innerHTML = scorePlayer + "-" + scoreCPU;
			pelotaReset(1);
		}
	}
	
	// si la pelota toca los costados
	if (pelotaClon.position.y <= -mesaHeight/2 || pelotaClon.position.y >= mesaHeight/2 )
	{
		pelotaClonDirY = -pelotaClonDirY;
	}
}
