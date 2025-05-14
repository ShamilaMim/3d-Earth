import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import getStarfield from './Star/star';


const width = window.innerWidth
const height = window.innerHeight
let fov = 75
let aspect= width/height
let near = 0.1
let far = 1000

/**
 * Basic setup: Scene, Camera, Renderer
 */

//create scene
const scene = new THREE.Scene()

// Create a perspective camera
const camera = new THREE.PerspectiveCamera(fov,aspect,near,far)
camera.position.set(0, 0, 5);

// Create a WebGL renderer
const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize(width,height)
document.body.appendChild(renderer.domElement)




/**
 * Fundamentals: Texure,Geometry, Material, Mesh
 */
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('./earthmap1k.jpg')
const lightTexture = textureLoader.load('./03_earthlights1k.jpg')

const geometry = new THREE.IcosahedronGeometry(1.4,20)
const material = new THREE.MeshStandardMaterial({
    map: texture,
    
})

const lightMaterial = new THREE.MeshBasicMaterial({
    map: lightTexture,
    transparent:0.2,
    blending: THREE.AdditiveBlending
})

const mesh = new THREE.Mesh(geometry,material);

const lightMesh = new THREE.Mesh(geometry,lightMaterial);



//create a Earth Group
const g = new THREE.Group()
g.rotation.z = -23.4 * Math.PI/180
g.add(mesh,lightMesh) 

// Add Directional light to the scene
const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(-2.5,0.5,1.5)

const stars = getStarfield({numStars:2000})
scene.add(g,sunLight,stars)



// Set up orbit controls for camera interaction
const controls = new OrbitControls(camera, renderer.domElement);

// Animation loop
function animate() {
    mesh.rotation.y += 0.001; // Rotate the earth mesh on the Y-axis
    lightMesh.rotation.y +=0.001 // Rotate the light mesh on the Y-axis
    renderer.render(scene, camera); // Render the scene with updated transformations
    requestAnimationFrame(animate); // Request next frame
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); 
    renderer.setSize(window.innerWidth, window.innerHeight);
});


animate();