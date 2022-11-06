class BlackholeController {

    constructor(spaceship) {
        this._Init();
		this._position = new THREE.Vector3();	
		this.distance = new THREE.Vector3();	
		this.spaceship = spaceship;
    }

    _Init() {
		
		//this._position = new THREE.Vector3();	
        this._LoadModels();
    }
    
    
	/* create black hole */
    _LoadModels() {
        const loader = new THREE.GLTFLoader();
	
		loader.load('./gltf/blackhole/scene.gltf', (gltf) => {
			gltf = gltf.scene.children[0];
			gltf.scale.set(10, 10, 10);
			gltf.position.set(300, 150, 0);
			this.model = gltf;
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
	if (!this.model) {
			return;
	}
	
	time *= 0.001;  // convert time to seconds
    const speed = 1 * .3;
    const rot = time * speed;
    this.model.rotation.z = rot;
	// move blackhole depending on spaceship position
	if (this.spaceship.Position.x < 100) {
		if (this.spaceship.Position.y < 100) {
			this.model.position.set(-300, -50, 0);
		}
		else this.model.position.set(-300, 50, 0);
	}
	else {
		if (this.spaceship.Position.z < 100) {
			this.model.position.set(300, -50, 0);
		}
		else this.model.position.set(300, 50, 0);
	}

	var shipPos = new THREE.Vector3().set(this.spaceship.Position.x, this.spaceship.Position.y, this.spaceship.Position.z);
	if (this.model && (shipPos.distanceTo(this.model.position)< 40)) {

		this.onCrashed();
		return;
	}

   	//renderer.render(scene,camera);
   	//requestAnimationFrame(animate);
	
	}

	onCrashed() {
		//
		const response = confirm('Reload the page?');
		if (response) location.reload();
		//else this.model.position *= 0.8;

}
}