import GUI from 'lil-gui'
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'

// canvas
const canvas = document.querySelector('canvas.webgl')
if (!canvas) {
  console.error('Canvas with class "webgl" not found! Make sure index.html has <canvas class="webgl"></canvas>')
}

// Scene
const scene = new THREE.Scene()

// material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4
material.metalness = 0.2

// objects
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
*/

// 1. Ambient Light – base fill light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
scene.add(ambientLight)

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
const hemisphereHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
const directionalHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
const pointHelper = new THREE.PointLightHelper(pointLight, 0.2)
const spotHelper = new THREE.SpotLightHelper(spotLight)
const rectAreaHelper = new RectAreaLightHelper(rectAreaLight)

scene.add(hemisphereHelper, directionalHelper, pointHelper, spotHelper, rectAreaHelper)

/**
 * GUI
 */
const gui = new GUI({ width: 320 })

const params = {
  ambientOn: true,
  ambientIntensity: ambientLight.intensity,
  ambientColor: `#${ambientLight.color.getHexString()}`,

  directionalOn: true,
  directionalIntensity: directionalLight.intensity,
  directionalColor: `#${directionalLight.color.getHexString()}`,
  dirPosX: directionalLight.position.x,
  dirPosY: directionalLight.position.y,
  dirPosZ: directionalLight.position.z,

  hemisphereOn: true,
  hemisphereIntensity: hemisphereLight.intensity,
  hemisphereSkyColor: `#${hemisphereLight.color.getHexString()}`,
  hemisphereGroundColor: `#${hemisphereLight.groundColor.getHexString()}`,

  pointOn: true,
  pointIntensity: pointLight.intensity,
  pointColor: `#${pointLight.color.getHexString()}`,

  rectAreaOn: true,
  rectAreaIntensity: rectAreaLight.intensity,
  rectAreaColor: `#${rectAreaLight.color.getHexString()}`,
  rectAreaWidth: rectAreaLight.width,
  rectAreaHeight: rectAreaLight.height,

  spotOn: true,
  spotIntensity: spotLight.intensity,
  spotDistance: spotLight.distance,
  spotAngle: spotLight.angle,
  spotPenumbra: spotLight.penumbra,
  spotColor: `#${spotLight.color.getHexString()}`,
  spotPosX: spotLight.position.x,
  spotPosY: spotLight.position.y,
  spotPosZ: spotLight.position.z, 

  helpersVisible: true,
}

// Ambient folder
const fAmbient = gui.addFolder('Ambient Light')
fAmbient.add(params, 'ambientOn').name('On / Off').onChange((v) => { ambientLight.visible = v })
fAmbient.add(params, 'ambientIntensity', 0, 2, 0.01).name('Intensity').onChange((val) => { ambientLight.intensity = val })
fAmbient.addColor(params, 'ambientColor').name('Color').onChange((value) => { ambientLight.color.set(value) })
fAmbient.open()

// Directional folder
const fDir = gui.addFolder('Directional Light')
fDir.add(params, 'directionalOn').name('On / Off').onChange((v) => { directionalLight.visible = v })
fDir.add(params, 'directionalIntensity', 0, 4, 0.01).name('Intensity').onChange((val) => { directionalLight.intensity = val })
fDir.addColor(params, 'directionalColor').name('Color').onChange((value) => { directionalLight.color.set(value) })
fDir.add(params, 'dirPosX', -10, 10, 0.1).name('Position X').onChange((val) => { directionalLight.position.x = val })
fDir.add(params, 'dirPosY', -10, 10, 0.1).name('Position Y').onChange((val) => { directionalLight.position.y = val })
fDir.add(params, 'dirPosZ', -10, 10, 0.1).name('Position Z').onChange((val) => { directionalLight.position.z = val })
fDir.open()

// Hemisphere folder (FIXED names to match params)
const fHemi = gui.addFolder('Hemisphere Light')
fHemi.add(params, 'hemisphereOn').name('On / Off').onChange((v) => { hemisphereLight.visible = v })
fHemi.add(params, 'hemisphereIntensity', 0, 2, 0.01).name('Intensity').onChange((val) => { hemisphereLight.intensity = val })
fHemi.addColor(params, 'hemisphereSkyColor').name('Sky color').onChange((val) => hemisphereLight.color.set(val))
fHemi.addColor(params, 'hemisphereGroundColor').name('Ground color').onChange((val) => hemisphereLight.groundColor.set(val))
fHemi.open()

// Point folder (ensure keys match)
const fPoint = gui.addFolder('Point Light')
fPoint.add(params, 'pointOn').name('On / Off').onChange((v) => { pointLight.visible = v })
fPoint.add(params, 'pointIntensity', 0, 4, 0.01).name('Intensity').onChange((val) => { pointLight.intensity = val })
fPoint.addColor(params, 'pointColor').name('Color').onChange((val) => pointLight.color.set(val))
fPoint.open()

// RectArea folder (fixed keys)
const fRect = gui.addFolder('RectArea Light')
fRect.add(params, 'rectAreaOn').name('On / Off').onChange((v) => { rectAreaLight.visible = v })
fRect.add(params, 'rectAreaIntensity', 0, 8, 0.01).name('Intensity').onChange((val) => { rectAreaLight.intensity = val })
fRect.addColor(params, 'rectAreaColor').name('Color').onChange((val) => rectAreaLight.color.set(val))
fRect.add(params, 'rectAreaWidth', 0.1, 5, 0.01).name('Width').onChange((val) => { rectAreaLight.width = val })
fRect.add(params, 'rectAreaHeight', 0.1, 5, 0.01).name('Height').onChange((val) => { rectAreaLight.height = val })
fRect.open()

// Spot folder
const fSpot = gui.addFolder('Spot Light')
fSpot.add(params, 'spotOn').name('On / Off').onChange((v) => { spotLight.visible = v })
fSpot.add(params, 'spotIntensity', 0, 8, 0.01).name('Intensity').onChange((val) => { spotLight.intensity = val })
fSpot.addColor(params, 'spotColor').name('Color').onChange((val) => spotLight.color.set(val))
fSpot.add(params, 'spotAngle', 0, Math.PI / 2, 0.001).name('Angle').onChange((val) => { spotLight.angle = val })
fSpot.add(params, 'spotPenumbra', 0, 1, 0.01).name('Penumbra').onChange((val) => { spotLight.penumbra = val })
fSpot.add(params, 'spotPosX', -10, 10, 0.01).name('pos X').onChange((v) => { spotLight.position.x = v })
fSpot.add(params, 'spotPosY', -10, 10, 0.01).name('pos Y').onChange((v) => { spotLight.position.y = v })
fSpot.add(params, 'spotPosZ', -10, 10, 0.01).name('pos Z').onChange((v) => { spotLight.position.z = v })
fSpot.open()

// Helpers toggle
gui.add(params, 'helpersVisible').name('Helpers Visible').onChange((v) => {
  hemisphereHelper.visible = v
  directionalHelper.visible = v
  pointHelper.visible = v
  spotHelper.visible = v
  rectAreaHelper.visible = v
})

// sizes
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

  // Animate objects slightly so light effects visible
  sphere.rotation.y = 0.2 * elapsedTime
  cube.rotation.y = 0.2 * elapsedTime
  torus.rotation.y = 0.2 * elapsedTime

  sphere.rotation.x = 0.1 * elapsedTime
  cube.rotation.x = 0.1 * elapsedTime
  torus.rotation.x = 0.1 * elapsedTime

  // update spot helper (necessary)
  spotHelper.update()

  controls.update()
  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}

tick()
