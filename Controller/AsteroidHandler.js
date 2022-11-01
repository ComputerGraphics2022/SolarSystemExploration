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

		var loc = [];
		// x 108~140 사이
		for (var i=0; i<3; i++) {
			loc[i] = Math.random() * (140 - 108) + 108;
		}

		// 소행성 여러 개 돌리기
		loader.load('./gltf/asteroid2/scene.gltf', (gltf) => {
			gltf = gltf.scene.children[0];
			gltf.scale.set(2, 2, 2);
			//gltf.position.set(50, 10, 0);
			gltf.position.set(loc[0], loc[1], loc[2]);
			console.log(gltf.position);
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
		var temp = this.model.rotation;
		for (var i = 0; i < 10; i++) {
			this.model.rotation.x *= -0.5;
		 	this.model.rotation.y *- -0.5;
		 	this.model.rotation.z *= -0.5;
		 }
		 
		//camera의 시점도 변경해야 함
		//this.model.rotation = temp;
		console.log(this.model);

		

}
}