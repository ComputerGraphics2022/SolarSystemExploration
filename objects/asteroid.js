import * as THREE from "three";

const createAsteroid = (
  group,
  count,
  minX,
  maxX,
  minY,
  maxY,
  minZ,
  maxZ,
  minScale,
  maxScale,
) => {
  for (let i = 0; i < count; i++) {
    const x = Math.random() * (maxX - minX) + minX;
    const z = Math.random() * (maxY - minY) + minY;
    const y = Math.random() * (maxZ - minZ) + minZ;

    const asteroidGeometry = new THREE.DodecahedronGeometry(2, 0);
    const asteroidMaterial = new THREE.MeshStandardMaterial({
      color: "#b2b6b1",
    });

    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);

    asteroid.castShadow = true;
    asteroid.receiveShadow = true;

    asteroid.scale.set(
      Math.random() * (maxScale - minScale) + minScale,
      Math.random() * (maxScale - minScale) + minScale,
      Math.random() * (maxScale - minScale) + minScale,
    );

    asteroid.position.set(x, y, z);

    asteroid.rotation.z = (Math.random() - 0.5) * 0.5;
    asteroid.rotation.y = (Math.random() - 0.5) * 0.5;

    group.add(asteroid);
  }

  return {
    group,
    setPosition(x, y, z) {
      this.group.position.set(x, y, z);
    },
  };
};

export { createAsteroid };