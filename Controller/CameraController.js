
class CameraController { //controls camera
	constructor(object) {
	  this._object = object;
	  this._currentPosition = new THREE.Vector3();
	  this._currentLookat = new THREE.Vector3();
	}
  
	_CalculateIdealOffset() { // calculate camera position
	  var idealOffset; 

	  if (firstPerspective==true){ //first perspective
		idealOffset=new THREE.Vector3(0, -2, 3);//(left/right,forward/backward,up/down)
	  }
	  else {//third perspective
		idealOffset=new THREE.Vector3(0, 18, 15);
	  }
	  idealOffset.applyQuaternion(this._object.Rotation);
	  idealOffset.add(this._object.Position);
	  return idealOffset;
	}
  
	_CalculateIdealLookat() { // calculate camera lookat
	  var idealLookat; 

	  if (firstPerspective == true){ //first perspective
		idealLookat = new THREE.Vector3(0, -10, 2); //(0,0,0) heads to object direction
	  }
	  else { //third perspective
		idealLookat = new THREE.Vector3(0, -5, 5);
	  }
	 
	  idealLookat.applyQuaternion(this._object.Rotation);
	  idealLookat.add(this._object.Position);
	  return idealLookat;
	}
  
	Update(timeElapsed) {
	  const idealOffset = this._CalculateIdealOffset();
	  const idealLookat = this._CalculateIdealLookat();
  
	  // const t = 0.05;
	  // const t = 4.0 * timeElapsed;
	  const t = 1.0 - Math.pow(0.001, timeElapsed);
  
	  this._currentPosition.copy(idealOffset);
	  this._currentLookat.copy(idealLookat);
	  camera.position.copy(this._currentPosition);
	  camera.lookAt(this._currentLookat);
	}
};
