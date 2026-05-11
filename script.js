const canvas = document.getElementById("bg")

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

camera.position.z = 6

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)

// PARTICLE GEOMETRY
const geometry = new THREE.BufferGeometry()
const count = 15000
const positions = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 20
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// SHADER MATERIAL (IMPORTANT)
const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 }
  },
  vertexShader: `
    uniform float time;
    void main() {
      vec3 pos = position;

      pos.z += sin(pos.x * 2.0 + time) * 0.5;
      pos.y += cos(pos.x * 1.5 + time) * 0.3;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
      gl_PointSize = 2.0;
    }
  `,
  fragmentShader: `
    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if(dist > 0.5) discard;

      gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);
    }
  `,
  transparent: true
})

const particles = new THREE.Points(geometry, material)
scene.add(particles)

// MOUSE
let mouseX = 0
let mouseY = 0

window.addEventListener("mousemove", (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2
})

// ANIMATION LOOP
function animate(time) {
  requestAnimationFrame(animate)

  material.uniforms.time.value = time * 0.001

  particles.rotation.y += 0.001
  particles.rotation.x = mouseY * 0.3
  particles.rotation.y = mouseX * 0.5

  camera.position.x += (mouseX * 2 - camera.position.x) * 0.05
  camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05
  camera.lookAt(scene.position)

  renderer.render(scene, camera)
}

animate()

// RESIZE
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
  renderer.setSize(window.innerWidth, window.innerHeight)
})
