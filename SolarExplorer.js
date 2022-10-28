var sceneID = null;
var camera;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var scene;
var canvas;
var firstPerspective=true;
var thirdPerspective=false;
var trackballControl=false;

window.onload = function init() 
{
	var rotSpeed = 1;
	var revSpeed = 1;
	var theta  = 0;
	canvas = document.getElementById( "gl-canvas" );
	const renderer = new THREE.WebGLRenderer({canvas});

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.01, 2000);
	camera.position.set(0, 15, -150);

	// add lightsources
	scene.add(new THREE.AmbientLight(0xffffff, 0.5));

	var sunLight = new THREE.PointLight(0xf4e99b, 0.8);
	sunLight.position.set(0, 0, 0);
	scene.add(sunLight);


	// add sun/planets
	var sun = createSun(40, 32);
	scene.add(sun);

	var sunAtmosphere = createSunAtmos(41, 64);
	sunAtmosphere.material.emissive.setHex(0xFF0000);
	scene.add(sunAtmosphere);

	var outerSunAtmosphere = createSunAtmos(43, 64);
	outerSunAtmosphere.material.color.setHex(0xFFFF00);
	outerSunAtmosphere.material.emissive.setHex(0xFFFF00);
	outerSunAtmosphere.material.opacity = 0.2;
	scene.add(outerSunAtmosphere);
	
	var mercury = createMercury(1, 32);
	mercury.position.set(50, 0, 0);
	scene.add(mercury);

	var venus = createVenus(2.5, 32);
	venus.position.set(67.4, 0, 0);
	scene.add(venus);

    var earth = createEarth(2.6, 32);
	earth.position.set(81, 0, 0);
	scene.add(earth);

    var cloud_earth = createCloud_earth(2.61, 32);
	cloud_earth.position.set(81, 0, 0);
	scene.add(cloud_earth);

	var moon = createMoon(0.4, 32);
	const moonContainer = new THREE.Object3D;			// set moon container as sun's child element: orbit around sun
	moonContainer.add(moon);
	earth.add(moon);									// set moon as earth's child element: orbit around earth
	sun.add(moonContainer);

	var mars = createMars(1.9, 32);
	mars.position.set(108, 0, 0);
	scene.add(mars);

	var jupiter = createJupiter(10, 32);
	jupiter.position.set(140, 0, 0);
	scene.add(jupiter);

	var saturn = createSaturn(9, 32);
	saturn.position.set(200, 0, 0);
	scene.add(saturn);

	var saturnRingGeo = new THREE.RingGeometry(11, 15, 64);
	var saturnRingMat = new THREE.MeshPhongMaterial({map: THREE.ImageUtils.loadTexture('images/8k_saturn_ring.png'), side: THREE.DoubleSide});
	var saturnRing = new THREE.Mesh(saturnRingGeo, saturnRingMat);
	var pos = saturnRingGeo.attributes.position;
	var v3 = new THREE.Vector3();
	for(var i = 0; i < pos.count; i++){
		v3.fromBufferAttribute(pos, i);
		saturnRingGeo.attributes.uv.setXY(i, v3.length() < 12 ? 0 : 1, 1);
	}
	saturnRing.rotation.x = 20;
	saturnRing.position.set(200, 0, 0);
	scene.add(saturnRing);

	var uranus = createUranus(7, 32);
	uranus.position.set(260, 0, 0);
	scene.add(uranus);

	var neptune = createNeptune(7, 32);
	neptune.position.set(320, 0, 0);
	scene.add(neptune);

	// add canvas background
	var stars = createStars(1000, 64);
	scene.add(stars);

	var spaceship = new SpaceshipController();
	var previousTime = null;

	/* blackhole */
	var bcontroller = new BlackholeController(spaceship);

	/* click event --> move to clickHandler.js */
	canvas.addEventListener("click", event => {
		let pos = new THREE.Vector3();
		pos.set(
    			(event.clientX / canvas.width) * 2 - 1,
    			- (event.clientY / canvas.height) * 2 + 1,
    			0
		);
		pos.unproject(camera);
		console.log(pos); // for check
		console.log(bcontroller.blackhole.position);

		// accuracy correction required
		if (Math.abs(pos.x - bcontroller.blackhole.position.x) < 150 &&
			Math.abs(pos.y == bcontroller.blackhole.position.y) < 150 &&
			Math.abs(pos.z == bcontroller.blackhole.position.z) < 100) {
				//hit
				bcontroller.onClicked();

				
			}

		
	})	

	
	var cameraControl = new CameraController(spaceship);

	var controls = new THREE.TrackballControls(camera, renderer.domElement);

	render();


	// render canvas
	function render(time) {

		document.getElementById("rotSpeed").oninput = function(event){
			rotSpeed = parseFloat(event.target.value);
		};

		document.getElementById("revSpeed").oninput = function(event){
			theta = 0;
			revSpeed = parseFloat(event.target.value);

			//console.log(theta + " " + revSpeed);
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
		spaceship.Update(timeElapsed);
		bcontroller.Update(timeElapsed);

		//camera update
		if(firstPerspective==true || thirdPerspective==true){
			cameraControl.Update(timeElapsed);
		}
		else{
			controls.update();
		}
		previousTime = time;

		//console.log('ship',spaceship.Position);
		//console.log('camera',camera.position)



		// rotate sun/plantes
		// sun			1109	->	0.9, for visual effects
		// mercury    	1.6		->	1.6
		// venus    	1		->	1
		// earth    	258		->	2.5
		// mars    		134		->	2
		// jupiter    	7000	->	7
		// saturn      	5438	->	5
		// uranus   	1438	->	4
		// neptune   	1488	->	4
		sun.rotation.y += 0.0005 * 0.9 * rotSpeed;
		mercury.rotation.y -= 0.0005 * rotSpeed * 1.6;
		venus.rotation.y -= 0.0005 * rotSpeed;
		earth.rotation.y += 0.0005 * rotSpeed * 2.5;
		cloud_earth.rotation.y += 0.0005 * rotSpeed * 2.5;
		moon.rotation.y += 0.0005 * rotSpeed * 1.1;
		mars.rotation.y += 0.0005 * rotSpeed * 2;
		jupiter.rotation.y += 0.0005 * rotSpeed * 7;
		saturn.rotation.y += 0.0005 * rotSpeed * 5;
		saturnRing.rotation.z += 0.0005 * rotSpeed * 5;
		uranus.rotation.y += 0.0005 * rotSpeed * 4;
		neptune.rotation.y += 0.0005 * rotSpeed * 4;

		// revolve planets
		// mercury    	8.6
		// venus    	6.4
		// earth    	5.4
		// mars    		4.4
		// jupiter    	2.4
		// saturn      	1.7
		// uranus   	1.3
		// neptune   	1
		theta += 0.0001;
		mercury.position.z = 50 * Math.sin(theta * 8.6 * revSpeed);
    	mercury.position.x = 50 * Math.cos(theta * 8.6 * revSpeed);
		venus.position.z = 67.4 * Math.sin(theta * 6.4 * revSpeed);
    	venus.position.x = 67.4 * Math.cos(theta * 6.4 * revSpeed);
		earth.position.z = 81 * Math.sin(theta * 5.4 * revSpeed);
    	earth.position.x = 81 * Math.cos(theta * 5.4 * revSpeed);
		moon.position.z = 4 * Math.sin(theta * 200 * revSpeed);
    	moon.position.x = 4 * Math.cos(theta * 200 * revSpeed);
		moonContainer.position.z = 85 * Math.sin(theta * 2 * revSpeed);
    	moonContainer.position.x = 85 * Math.cos(theta * 2 * revSpeed);
		cloud_earth.position.z = 81 * Math.sin(theta * 5.4 * revSpeed);
    	cloud_earth.position.x = 81 * Math.cos(theta * 5.4 * revSpeed);
		mars.position.z = 108 * Math.sin(theta * 4.4 * revSpeed);
    	mars.position.x = 108 * Math.cos(theta * 4.4 * revSpeed);
		jupiter.position.z = 140 * Math.sin(theta * 2.4 * revSpeed);
    	jupiter.position.x = 140 * Math.cos(theta * 2.4 * revSpeed);
		saturn.position.z = 200 * Math.sin(theta * 1.7 * revSpeed);
    	saturn.position.x = 200 * Math.cos(theta * 1.7 * revSpeed);
		saturnRing.position.z = 200 * Math.sin(theta * 1.7 * revSpeed);
    	saturnRing.position.x = 200 * Math.cos(theta * 1.7 * revSpeed);
		uranus.position.z = 260 * Math.sin(theta * 1.3 * revSpeed);
    	uranus.position.x = 260 * Math.cos(theta * 1.3 * revSpeed);
		neptune.position.z = 320 * Math.sin(theta * 1 * revSpeed);
    	neptune.position.x = 320 * Math.cos(theta * 1 * revSpeed);



		//console.log(sun.rotation.y);
		sceneID = requestAnimationFrame(render);
		renderer.render(scene, camera);
	}





	// functions for rendering sun and planets
	function createSun(radius, segments){
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:		THREE.ImageUtils.loadTexture('images/8k_sun.jpg'),
				emissive:	0xFF0000
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

	function createMoon(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/8k_moon.jpg')						
			})
		);
	}

	function createMars(radius, segments){
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:		THREE.ImageUtils.loadTexture('images/8k_mars.jpg'),
				bumpMap:	THREE.ImageUtils.loadTexture('images/marsbump2.png'),
				bumpScale:	0.005
			})
		);
	}

	function createJupiter(radius, segments){
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:		THREE.ImageUtils.loadTexture('images/8k_jupiter.jpg')
			})
		);
	}

	function createSaturn(radius, segments){
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:		THREE.ImageUtils.loadTexture('images/8k_saturn.jpg')
			})
		);
	}

	function createUranus(radius, segments){
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:		THREE.ImageUtils.loadTexture('images/2k_uranus.jpg')
			})
		);
	}

	function createNeptune(radius, segments){
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:		THREE.ImageUtils.loadTexture('images/2k_neptune.jpg')
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


