class AsteroidHandler {


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

		var loc = [];
		for (var i=0; i<3; i++) {
			loc[i] = Math.random() * 300 + 100;
		}
	
		loader.load('./gltf/asteroid/scene.gltf', (gltf) => {
			gltf = gltf.scene.children[0];
			gltf.scale.set(10, 10, 10);
			gltf.position.set(loc[0], loc[1], loc[2]);
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
    this.model.rotation.x = rot;
	// move blackhole depending on spaceship position
	if (this.spaceship.Position.x < 100) {
		if (this.spaceship.Position.y < 100) {
			this.model.position.set(-300, -300, 0);
		}
		else this.model.position.set(-300, 300, 0);
	}
	else {
		if (this.spaceship.Position.z < 100) {
			this.model.position.set(300, -300, 0);
		}
		else this.model.position.set(300, 300, 0);
	}
   	//renderer.render(scene,camera);
   	//requestAnimationFrame(animate);
	
	}

	onClicked() {
		//
		const response = confirm('Reload the page?');
		if (response) location.reload();

}
}