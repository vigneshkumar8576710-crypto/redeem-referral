const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// PARTICLES
const geometry = new THREE.BufferGeometry()
const vertices = []

for (let i = 0; i < 10000; i++) {
  vertices.push(
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20
  )
}

geometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(vertices, 3)
)

const material = new THREE.PointsMaterial({
  color: 0x00ffff,
  size: 0.03
})

const particles = new THREE.Points(geometry, material)
scene.add(particles)

camera.position.z = 6

// MOUSE INTERACTION
let mouseX = 0
let mouseY = 0

window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2
})

// ANIMATION LOOP
function animate() {
  requestAnimationFrame(animate)

  particles.rotation.y += 0.001

  particles.rotation.x = mouseY * 0.4
  particles.rotation.y = mouseX * 0.6

  particles.position.z = Math.sin(Date.now() * 0.001) * 0.5

  renderer.render(scene, camera)
}

animate()

// RESPONSIVE
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
