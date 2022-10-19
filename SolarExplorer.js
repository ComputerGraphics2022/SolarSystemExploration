var sceneID = null;

window.onload = function init() 
{
	var rotSpeed = 0.0001;
	var revSpeed = 0;
	const canvas = document.getElementById( "gl-canvas" );
	const renderer = new THREE.WebGLRenderer({canvas});

	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.01, 1000);
	camera.position.z = 200;

	scene.add(new THREE.AmbientLight(0xffffff, 0.8));

	// add lightsources
	var sunLight = new THREE.PointLight(0xffffff, 1);
	sunLight.position.set(0, 0, 0);
	scene.add(sunLight);


	// add sun and planets
	var sun = createSun(10, 32);
	sun.rotation.y = 10;
	scene.add(sun);

	var sunAtmosphere = createSunAtmos(10.2, 64);
	scene.add(sunAtmosphere);
	
	var mercury = createMercury(1, 32);
	mercury.position.set(20, 0, 0);
	mercury.rotation.y = 5;
	scene.add(mercury);

	var venus = createVenus(2.5, 32);
	venus.position.set(37.4, 0, 0);
	mercury.rotation.y = 5;
	scene.add(venus);

    var earth = createEarth(2.6, 32);
	earth.position.set(51, 0, 0);
	earth.rotation.y = 5; 
	scene.add(earth);

    var cloud_earth = createCloud_earth(2.61, 32);
	cloud_earth.position.set(51, 0, 0);
	cloud_earth.rotation.y = 5;
	scene.add(cloud_earth);

	var mars = createMars(1.9, 32);
	mars.position.set(78, 0, 0);
	mars.rotation.y = 5;
	scene.add(mars);


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



	render();


	// render canvas
	function render() {
		controls.update();
		sun.rotation.y += rotSpeed;
		earth.rotation.y += rotSpeed;
		cloud_earth.rotation.y += rotSpeed;
		mercury.rotation.y += rotSpeed;
		venus.rotation.y += rotSpeed;
		mars.rotation.y += rotSpeed;

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


