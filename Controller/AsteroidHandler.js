class AsteroidHandler {


    constructor(spaceship, flag) {
		this._position = new THREE.Vector3();
		this.spaceship = spaceship;
		this.flag = Number(flag);
        this._Init();
    }

    _Init() {
		
		//this._position = new THREE.Vector3();	
        this._LoadModels();
    }
    
    
	/* create black hole */
    _LoadModels() {
        const loader = new THREE.GLTFLoader();
		//const group = new THREE.Object3D();

		// position 108~140 사이
		var loc = [];
		for (var j=0; j<3; j++) {
				var temp = Math.random() * (140 - 108) + 108;
				loc[j] = temp * this.flag;
		
		}
		
		var scale = Math.random() * (3 - 0.5) + 0.5;

		loader.load('./gltf/asteroid2/scene.gltf', (gltf) => {
			//gltf = gltf.scene.children[0];
			gltf = gltf.scene.children[0];	
			gltf.scale.set(scale, scale, scale);
			gltf.position.set(loc[0], loc[1] + 50, loc[2]);
			//group.add(gltf);
			this.model = gltf;
			scene.add(gltf);
			//animate();
			  
		}, undefined, function (error) {
			console.error(error);
		});

		//scene.add(group);

	}
	
	get Position() { 
		return this._position;
	  }

// move asteroid in a way and has collision
 	Update(time) {

	if (!this.model) {
		return;
	}
	//
	var shipPos = new THREE.Vector3().set(this.spaceship.Position.x, this.spaceship.Position.y, this.spaceship.Position.z);
	if (this.model && (shipPos.distanceTo(this.model.position) < 5)) {

		this.onCrashed();
	}
   	//renderer.render(scene,camera);
   	//requestAnimationFrame(animate);
	
	}

	onCrashed() {
		//시야 빨갛게, 카메라 흔들림 구현하기
		const FogColor = 0x20ff0000;
		scene.fog = new THREE.FogExp2(FogColor, 0.002);
		
		setTimeout(function() {
			scene.fog = null;
			
		}, 800);

	}

	moveCamera() {
		let force = 10;
		camera.lookAt(new THREE.Vector3(0, force, 0));
		setTimeout(this.restoreCamera, 2000);


	}

	restoreCamera() {
		console.log(this.model);
		camera.lookAt(new THREE.Vector3(this.model.position));
	}
}