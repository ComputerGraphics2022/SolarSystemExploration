class BlackholeController {
    constructor() {
        this._Init();
		this._position = new THREE.Vector3();	
    }

    _Init() {
		
		//this._position = new THREE.Vector3();	
        this._LoadModels();
    }
    
    
	/* create black hole */
    _LoadModels() {
        const loader = new THREE.GLTFLoader();
	
		loader.load('./images/blackhole/scene.gltf', (gltf) => {
			gltf = gltf.scene.children[0];
			gltf.scale.set(10, 10, 10);
			gltf.position.set(400, 0, 0);
		
			this.blackhole = gltf;
			scene.add(gltf);
			//animate();
		  
		}, undefined, function (error) {
			console.error(error);
		});
	}
	
	
	get Position() { 
		return this._position;
	  }

// for rotating black hole 
 	Update(time) {

	time *= 0.001;  // convert time to seconds

    const speed = 1 * .3;
    const rot = time * speed;
    this.blackhole.rotation.x = rot;
	// move blackhole depending on spaceship position
	if (spaceship.Position.x < 100) {
		if (spaceship.Position.y < 100) {
			this.blackhole.position.set(-300, -300, 0);
		}
		else this.blackhole.position.set(-300, 300, 0);
	}
	else {
		if (spaceship.Position.z < 100) {
			this.blackhole.position.set(300, -300, 0);
		}
		else this.blackhole.position.set(300, 300, 0);
	}
   renderer.render(scene,camera);
   requestAnimationFrame(animate);
	}

	onClicked() {
		//
		const response = confirm('Reload the page?');
		if (response) location.reload();

}
}