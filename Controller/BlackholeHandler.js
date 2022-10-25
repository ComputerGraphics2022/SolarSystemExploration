// class?
function makeObject(loader) {
    loader.load('./images/blackhole/scene.gltf', function(gltf){
		blackhole = gltf.scene.children[0];
		blackhole.scale.set(10, 10, 10);
		
		blackhole.position.set(400, 0, 0);		
		scene.add(gltf.scene);
		animate(blackhole);
		  
		}, undefined, function (error) {
			console.error(error);
		});

}

	// for rotating black hole 
function animate(time) {

		time *= 0.001;  // convert time to seconds

      	const speed = 1 * .3;
      	const rot = time * speed;
      	blackhole.rotation.x = rot;
		// blackhole position in one of four directions, depending on the spacecraft's position
		// location criterion needed
		if (spaceship.Position.x < 100) {
			if (spaceship.Position.y < 100) {
				blackhole.position.set(-200, -200, 0);
			}
			else blackhole.position.set(-200, 200, 0);
		}
		else {
			if (spaceship.Position.y < 100) {
				blackhole.position.set(200, -200, 0);
			}
			else blackhole.position.set(200, 200, 0);
		}

	   renderer.render(scene,camera);
	   requestAnimationFrame(animate);
	}
