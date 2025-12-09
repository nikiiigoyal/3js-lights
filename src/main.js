import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
// import * as dat from 'dat.gui' // optional GUI for controls

/**
 * Canvas
 */
const canvas = document.querySelector('canvas.webgl')

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * MATERIAL
 * MeshStandardMaterial hi use karna hai
 * (RectAreaLight isi material ke saath kaam karta hai)
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4
material.metalness = 0.2

/**
 * OBJECTS
 */
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  material
)
sphere.position.x = -1.5

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(0.75, 0.75, 0.75),
  material
)

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  material
)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.65

scene.add(sphere, cube, torus, plane)

/**
 * LIGHTS SECTION
 * --------------------------------
 * Yahaan har light ko alag color / position de rahe hain
 * taaki effect clearly visible ho
 */

// 1. Ambient Light – base fill light
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
// scene.add(ambientLight)

// 2. Directional Light – sun-like light
const directionalLight = new THREE.DirectionalLight(0xffddaa, 0.4)
directionalLight.position.set(2, 2, 1)
scene.add(directionalLight)

// 3. Hemisphere Light – sky + ground
const hemisphereLight = new THREE.HemisphereLight(0x00aaff, 0xff8800, 0.3)
scene.add(hemisphereLight)

// 4. Point Light – bulb
const pointLight = new THREE.PointLight(0xffffff, 0.8, 5, 2)
pointLight.position.set(0, 1, 2)
scene.add(pointLight)

// 5. RectArea Light – window/softbox
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1)
rectAreaLight.position.set(-1.5, 0.5, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)

// 6. Spot Light – torch/stage
const spotLight = new THREE.SpotLight(
  0x78ff00,
  0.7,
  10,
  Math.PI / 8,
  0.3,
  1
)
spotLight.position.set(0, 3, 3)
spotLight.target.position.set(-0.5, 0, 0)
scene.add(spotLight, spotLight.target)

/**
 * HELPERS – 
 */
// const hemisphereHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
// scene.add(hemisphereHelper)

// const directionalHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
// scene.add(directionalHelper)

// const pointHelper = new THREE.PointLightHelper(pointLight, 0.2)
// scene.add(pointHelper)

// const spotHelper = new THREE.SpotLightHelper(spotLight)
// scene.add(spotHelper)

// const rectAreaHelper = new RectAreaLightHelper(rectAreaLight)
// scene.add(rectAreaHelper)

/**
 * SIZES
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * CAMERA
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.set(2, 2, 4)
scene.add(camera)

/**
 * CONTROLS
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * RENDERER
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true // lights realistic behave karenge

/**
 * ANIMATION LOOP
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Animate objects slightly so light effects visible ho
  sphere.rotation.y = 0.2 * elapsedTime
  cube.rotation.y = 0.2 * elapsedTime
  torus.rotation.y = 0.2 * elapsedTime

  sphere.rotation.x = 0.1 * elapsedTime
  cube.rotation.x = 0.1 * elapsedTime
  torus.rotation.x = 0.1 * elapsedTime

  controls.update()
  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}

tick()
