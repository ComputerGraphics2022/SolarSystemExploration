class AsteroidHandler {


    constructor(spaceship) {
        this._Init();
		this._position = new THREE.Vector3();
		this.spaceship = spaceship;
    }

    _Init() {
		
		//this._position = new THREE.Vector3();	
        this._LoadModels();
    }
    
    
	/* create black hole */
    _LoadModels() {
        const loader = new THREE.GLTFLoader();
		//const group = new THREE.Object3D();

		var loc = [];

		// 소행성 여러 개 돌리기
		for (var j=0; j<3; j++) {
				loc[j] = Math.random() * (140 - 108) + 108;
		}
		// x 108~140 사이

		loader.load('./gltf/asteroid2/scene.gltf', (gltf) => {
			//gltf = gltf.scene.children[0];
			gltf = gltf.scene.children[0];	
			gltf.scale.set(2, 2, 2);
			gltf.position.set(loc[0], loc[1], loc[2]);
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
	/*if (!this.model) {
			return;
	} */
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
		const FogColor = 0xff0000;
		
		scene.fog = new THREE.FogExp2(FogColor, 0.002);
		//this.moveCamera();
		//console.log(camera);

		setTimeout(function() {
			scene.fog = null;
			//camera.rotation.z /= Math.PI * 0.5;
		}, 1000);
		console.log(camera);

		//camera의 시점도 변경해야 함

		

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