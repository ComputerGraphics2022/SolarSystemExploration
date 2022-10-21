class SpaceshipController { //controls spaceship 
    constructor() {
      this._Init();
    }
  
    _Init() {
      this._decceleration = new THREE.Vector3(-0.0005, -5.0, -0.0001);
      this._acceleration = new THREE.Vector3(1, 50.0, 0.25);
      this._velocity = new THREE.Vector3(0, 0, 0);
	  this._position = new THREE.Vector3();	
      this._input = new keyboardListener();
  
      this._LoadModels();
    }
  
    _LoadModels() { //load spaceship gltf
      const loader = new THREE.GLTFLoader();
      loader.load('./gltf/spaceship/scene.gltf', (gltf) => {
        gltf = gltf.scene.children[0];
        gltf.scale.set(0.5,0.5,0.5);
		gltf.position.set(0,0,-30);
		this.spaceship=gltf;
		scene.add(gltf);
      }, undefined, function (error) {
        console.error(error);      
      });
    }
    get Position() { 
	  return this._position;
	}
	
	get Rotation() { 
		if (!this.spaceship) {
			return new THREE.Quaternion();
		}
	  	return this.spaceship.quaternion;
	}

    Update(timeInSeconds) { // Update spaceship position
      if (!this.spaceship) {
        return;
      }
  
      var velocity = this._velocity;
      var frameDecceleration = new THREE.Vector3(
          velocity.x * this._decceleration.x,
          velocity.y * this._decceleration.y,
          velocity.z * this._decceleration.z
      );
      frameDecceleration.multiplyScalar(timeInSeconds);
	  frameDecceleration.y = Math.sign(frameDecceleration.y) * Math.min(
		  Math.abs(frameDecceleration.y), Math.abs(velocity.y));
  
      velocity.add(frameDecceleration);
  
      var controlObject = this.spaceship;
      var _Q = new THREE.Quaternion(); 		//Quarternion(angle,vertex)
      var _A = new THREE.Vector3();		//axis
      var _R = controlObject.quaternion.clone(); //result
  
      var acc = this._acceleration.clone();
      if (this._input._keys.shift) {
        acc.multiplyScalar(2.0);
      }
	  
      if (this._input._keys.forward) {
        velocity.y -= acc.y * timeInSeconds;
      }
      if (this._input._keys.backward) {
        velocity.y += acc.y * timeInSeconds;
      }
      if (this._input._keys.left) {
        _A.set(0, 0, 1);
        _Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeInSeconds * this._acceleration.z);
        _R.multiply(_Q);
      }
      if (this._input._keys.right) {
        _A.set(0, 0, 1);
        _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * this._acceleration.z);
        _R.multiply(_Q);
      }
  
      controlObject.quaternion.copy(_R);
  
      var oldPosition = new THREE.Vector3();
      oldPosition.copy(controlObject.position);
  
      var forward = new THREE.Vector3(0, 1, 0);
      forward.applyQuaternion(controlObject.quaternion);
      forward.normalize();
  
      var sideways = new THREE.Vector3(1, 0, 0);
      sideways.applyQuaternion(controlObject.quaternion);
      sideways.normalize();
  
      sideways.multiplyScalar(velocity.x * timeInSeconds);
      forward.multiplyScalar(velocity.y * timeInSeconds);
  
      controlObject.position.add(forward);
      controlObject.position.add(sideways);
  
      oldPosition.copy(controlObject.position);
	  this._position.copy(controlObject.position);
  
	  console.log(this.Position)
    }
};

class keyboardListener { // keyboard event listener
	constructor() {
		this._Init();    
	}

	_Init() {
		this._keys = {
		forward: false,
		backward: false,
		left: false,
		right: false,
		space: false,
		shift: false,
		};
		document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
		document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
	}

	_onKeyDown(event) {
		switch (event.keyCode) {
		case 87: // w
			this._keys.forward = true;
			break;
		case 65: // a
			this._keys.left = true;
			break;
		case 83: // s
			this._keys.backward = true;
			break;
		case 68: // d
			this._keys.right = true;
			break;
		case 32: // SPACE
			this._keys.space = true;
			break;
		case 16: // SHIFT
			this._keys.shift = true;
			break;
		}
	}

	_onKeyUp(event) {
		switch(event.keyCode) {
		case 87: // w
			this._keys.forward = false;
			break;
		case 65: // a
			this._keys.left = false;
			break;
		case 83: // s
			this._keys.backward = false;
			break;
		case 68: // d
			this._keys.right = false;
			break;
		case 32: // SPACE
			this._keys.space = false;
			break;
		case 16: // SHIFT
			this._keys.shift = false;
			break;
		}
	}
};

class CameraController { //controls camera
	constructor(object) {
	  this._object = object;
	  this._currentPosition = new THREE.Vector3();
	  this._currentLookat = new THREE.Vector3();
	}
  
	_CalculateIdealOffset() { // calculate camera position
	  var idealOffset; 

	  if (firstPerspective==true){ //1인칭
		idealOffset=new THREE.Vector3(0, -2, 3);//(좌우,앞뒤,위아래)
	  }
	  else {//3인칭
		idealOffset=new THREE.Vector3(0, 18, 15);
	  }
	  idealOffset.applyQuaternion(this._object.Rotation);
	  idealOffset.add(this._object.Position);
	  return idealOffset;
	}
  
	_CalculateIdealLookat() { // calculate camera lookat
	  var idealLookat; 

	  if (firstPerspective == true){ //1인칭
		idealLookat = new THREE.Vector3(0, -10, 2); //(0,0,0)은 물체 방향
	  }
	  else { //3인칭
		idealLookat = new THREE.Vector3(0, -5, 5);
	  }
	 
	  idealLookat.applyQuaternion(this._object.Rotation);
	  idealLookat.add(this._object.Position);
	  return idealLookat;
	}
  
	Update(timeElapsed) {
	  const idealOffset = this._CalculateIdealOffset();
	  const idealLookat = this._CalculateIdealLookat();
  
	  // const t = 0.05;
	  // const t = 4.0 * timeElapsed;
	  const t = 1.0 - Math.pow(0.001, timeElapsed);
  
	  this._currentPosition.copy(idealOffset);
	  this._currentLookat.copy(idealLookat);
	  camera.position.copy(this._currentPosition);
	  camera.lookAt(this._currentLookat);
	}
};
  


var sceneID = null;
var camera;
var scene;
var firstPerspective=true;
var thirdPerspective=false;
var trackballControl=false;

window.onload = function init() 
{
	var rotSpeed = 1;
	var revSpeed = 1;
	var theta  = 0;
	const canvas = document.getElementById( "gl-canvas" );
	const renderer = new THREE.WebGLRenderer({canvas});

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.01, 1000);
	camera.position.set(0,15,-50);

	// add lightsources
	scene.add(new THREE.AmbientLight(0xffffff, 0.8));

	var sunLight = new THREE.PointLight(0xffffff, 1);
	sunLight.position.set(0, 0, 0);
	scene.add(sunLight);


	// add sun/planets
	var sun = createSun(10, 32);
	sun.rotation.y = 10;
	scene.add(sun);

	var sunAtmosphere = createSunAtmos(11, 64);
	scene.add(sunAtmosphere);
	
	var mercury = createMercury(1, 32);
	mercury.position.set(20, 0, 0);
	scene.add(mercury);

	var venus = createVenus(2.5, 32);
	venus.position.set(37.4, 0, 0);
	scene.add(venus);

    var earth = createEarth(2.6, 32);
	earth.position.set(51, 0, 0);
	scene.add(earth);

    var cloud_earth = createCloud_earth(2.61, 32);
	cloud_earth.position.set(51, 0, 0);
	scene.add(cloud_earth);

	var mars = createMars(1.9, 32);
	mars.position.set(78, 0, 0);
	scene.add(mars);

	/* create black hole */
	// change : create to 4 ways
	const loader = new THREE.GLTFLoader();
	loader.load('./images/blackhole/scene.gltf', function(gltf){
	  blackhole = gltf.scene.children[0];
	  blackhole.scale.set(10, 10, 10);
	  blackhole.position.set(100, 100, 0);
	  scene.add(gltf.scene);
	  animate();
	  
	}, undefined, function (error) {
		console.error(error);
	});
	// for rotating black hole 
	function animate(time) {

		time *= 0.001;  // convert time to seconds

      	const speed = 1 * .3;
      	const rot = time * speed;
      	blackhole.rotation.x = rot;
  
	   renderer.render(scene,camera);
	   requestAnimationFrame(animate);
	}

	// add canvas background
	var stars = createStars(300, 64);
	scene.add(stars);

	var spaceship=new SpaceshipController();
	var previousTime = null;


	var cameraControl = new CameraController(spaceship);

	var controls = new THREE.TrackballControls(camera, renderer.domElement);

	render();


	// render canvas
	function render(time) {

		document.getElementById("rotSpeed").oninput = function(event){
			rotSpeed = parseFloat(event.target.value);
		};

		document.getElementById("revSpeed").onchange = function(event){
			revSpeed = parseFloat(event.target.value);
		};

		document.getElementById("firstPerspective").onclick = function(){
			firstPerspective=true;
			thirdPerspective=false;
			trackballControl=false;
		};
		document.getElementById("thirdPerspective").onclick = function(){
			thirdPerspective=true;
			firstPerspective=false;
			trackballControl=false;
		};
		document.getElementById("trackballControl").onclick = function(){
			trackballControl=true;
			firstPerspective=false;
			thirdPerspective=false;
		};

		if (previousTime === null) {
			previousTime = time;
		}

		//spaceship update
		var timeElapsed = time - previousTime;
		timeElapsed *= 0.001; //second
		spaceship.Update(timeElapsed) 

		//camera update
		if(firstPerspective==true || thirdPerspective==true){
			cameraControl.Update(timeElapsed);
		}
		else{
			controls.update();
		}
		previousTime = time;

		console.log('ship',spaceship.Position);
		console.log('camera',camera.position)



		// rotate sun/plantes
		// sun			1109	->	10
		// mercury    	1.6		->	1.6
		// venus    	1		->	1
		// earth    	258		->	2.5
		// mars    		134		->	2
		// jupiter    	7000	->	20
		// saturn      	5438	->	18
		// uranus   	1438	->	12
		// neptune   	1488	->	12
		sun.rotation.y += 0.0005 * 10 * rotSpeed;
		mercury.rotation.y -= 0.0005 * rotSpeed * 1.6;
		venus.rotation.y -= 0.0005 * rotSpeed;
		earth.rotation.y += 0.0005 * rotSpeed * 2.5;
		cloud_earth.rotation.y += 0.0005 * rotSpeed * 2.5;
		mars.rotation.y += 0.0005 * rotSpeed * 2;

		// revolve planets
		// mercury    	8.6
		// venus    	6.4
		// earth    	5.4
		// mars    		4.4
		// jupiter    	2.4
		// saturn      	1.7
		// uranus   	1.3
		// neptune   	1
		theta += 0.001;
		mercury.position.z = 20 * Math.sin(theta * 8.6 * revSpeed);
    	mercury.position.x = 20 * Math.cos(theta * 8.6 * revSpeed);
		venus.position.z = 37.4 * Math.sin(theta * 6.4 * revSpeed);
    	venus.position.x = 37.4 * Math.cos(theta * 6.4 * revSpeed);
		earth.position.z = 51 * Math.sin(theta * 5.4 * revSpeed);
    	earth.position.x = 51 * Math.cos(theta * 5.4 * revSpeed);
		cloud_earth.position.z = 51 * Math.sin(theta * 5.4 * revSpeed);
    	cloud_earth.position.x = 51 * Math.cos(theta * 5.4 * revSpeed);
		mars.position.z = 78 * Math.sin(theta * 4.4 * revSpeed);
    	mars.position.x = 78 * Math.cos(theta * 4.4 * revSpeed);



		//console.log(sun.rotation.y);
		sceneID = requestAnimationFrame(render);
		renderer.render(scene, camera);
	}




	// functions for rendering sun and planets
	function createSun(radius, segments){
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:		THREE.ImageUtils.loadTexture('images/8k_sun.jpg')
			})
		);
	}

	function createSunAtmos(radius, segments){
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),			
			new THREE.MeshPhongMaterial({
				color: 0xFF0000,
				opacity: 0.3,
				transparent: true
			})
		);	
	}

	function createMercury(radius, segments){
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:		THREE.ImageUtils.loadTexture('images/8k_mercury.jpg'),
				bumpMap:	THREE.ImageUtils.loadTexture('images/mercurybump.jpg'),
				bumpScale:	0.005
			})
		);
	}

	function createVenus(radius, segments){
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:		THREE.ImageUtils.loadTexture('images/8k_venus.jpg'),
				bumpMap:	THREE.ImageUtils.loadTexture('images/venusbump.png'),
				bumpScale:	0.005
			})
		);
	}

	function createEarth(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/2_no_clouds_4k.jpg'),
				bumpMap:     THREE.ImageUtils.loadTexture('images/elev_bump_4k.jpg'),
				bumpScale:   0.005,
				specularMap: THREE.ImageUtils.loadTexture('images/water_4k.png'),
				specular:    new THREE.Color('grey')								
			})
		);
	}

	function createCloud_earth(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius + 0.003, segments, segments),			
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/fair_clouds_4k.png'),
				transparent: true
			})
		);		
	}

	function createMars(radius, segments){
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:		THREE.ImageUtils.loadTexture('images/8k_mars.jpg'),
				bumpMap:	THREE.ImageUtils.loadTexture('images/marsbump.jpg'),
				bumpScale:	0.005
			})
		);
	}

	// create canvas background
	function createStars(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments), 
			new THREE.MeshBasicMaterial({
				map:  THREE.ImageUtils.loadTexture('images/8k_stars_milky_way.jpg'), 
				side: THREE.BackSide
			})
		);
	}
}


