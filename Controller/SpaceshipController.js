class SpaceshipController { //controls spaceship 
    constructor() {
      this._Init();
    }
  
    _Init() {
      //this._decceleration = new THREE.Vector3(-0.001, -1.0, -0.001);
	  this._decceleration = new THREE.Vector3(-5, -1.5, -5);
      this._acceleration = new THREE.Vector3(0.5, 50.0, 40.0);
      this._velocity = new THREE.Vector3(0, 0, 0);
	  this._position = new THREE.Vector3();	
      this._input = new keyboardListener ();
  
      this._LoadModels();
    }
  
    _LoadModels() { //load spaceship gltf
      const loader = new THREE.GLTFLoader();
      loader.load('./gltf/spaceship/scene.gltf', (gltf) => {
        gltf = gltf.scene.children[0];
        gltf.scale.set(0.5,0.5,0.5);
		gltf.position.set(0, 0, -100);
		gltf.rotation.z = 1;
		this.spaceship=gltf;
		scene.add(gltf);
      }, undefined, function (error) {
        //console.error(error);      
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
	  
	  frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
	  	  Math.abs(frameDecceleration.z), Math.abs(velocity.z));

	
  
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
	  if (this._input._keys.up) {
		velocity.z +=acc.z * timeInSeconds;
	  }
	  if (this._input._keys.down) {
		velocity.z -=acc.z * timeInSeconds;
	  }
      if (this._input._keys.left) {
        _A.set(0, 0, 1);
        _Q.setFromAxisAngle(_A, 0.9 * Math.PI * timeInSeconds * this._acceleration.x);
        _R.multiply(_Q);
      }
      if (this._input._keys.right) {
        _A.set(0, 0, 1);
        _Q.setFromAxisAngle(_A, 0.9 * -Math.PI * timeInSeconds * this._acceleration.x);
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

	  var updown = new THREE.Vector3(0, 0, 1);
      updown.applyQuaternion(controlObject.quaternion);
	  
      updown.normalize();
  
      sideways.multiplyScalar(velocity.x * timeInSeconds);
      forward.multiplyScalar(velocity.y * timeInSeconds);
	  updown.multiplyScalar(velocity.z * timeInSeconds);

	  controlObject.position.add(forward);
      controlObject.position.add(sideways);
      controlObject.position.add(updown);

	  
  
      oldPosition.copy(controlObject.position);
	  this._position.copy(controlObject.position);
  
	  //console.log(this.Position)
    }
};

