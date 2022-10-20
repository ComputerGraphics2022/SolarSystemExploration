var sceneID = null;

window.onload = function init() 
{
	var rotSpeed = 1;
	var revSpeed = 1;
	var theta  = 0;
	const canvas = document.getElementById( "gl-canvas" );
	const renderer = new THREE.WebGLRenderer({canvas});

	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.01, 1000);
	camera.position.z = 200;

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

	// add canvas background
	var stars = createStars(150, 64);
	scene.add(stars);

	var controls = new THREE.TrackballControls(camera, renderer.domElement);

	document.getElementById("rotSpeed").oninput = function(event){
		rotSpeed = parseFloat(event.target.value);
		
		// discard previous render frame to initialize rotation speed(0.0005)
		if(sceneID !== null){	
			cancelAnimationFrame(sceneID);
		}
		render();
	}
	document.getElementById("revSpeed").oninput = function(event){
		revSpeed = parseFloat(event.target.value);

		if(sceneID !== null){	
			cancelAnimationFrame(sceneID);
		}
		render();
	}



	render();


	// render canvas
	function render() {
		controls.update();
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


