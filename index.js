import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// --- Containers ---
const container1 = document.getElementById('3D_Test');

// For a 3D model you need 3 things:
// Renderer, Camera, Scene (+ Loader + Light)

// --- Renderer ---
const w = container1.innerWidth;
const h = container1.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(w, h);
renderer.setClearColor(0x000000, 0);
container1.appendChild(renderer.domElement);

// --- Camera ---
const fov = 40;
const aspect = w / h;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 0, 300);
camera.lookAt(0, 0, 0);

// --- Scene ---
const scene = new THREE.Scene();

// --- DRACO Loader ---
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");

// --- GLTF Loader ---
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

loader.load('Images/4.glb',

	function (gltf) {
		scene.add(gltf.scene);
		console.log('Model added to scene');
	},
	function (xhr) {
		console.log((xhr.loaded / xhr.total * 100) + '% loaded');
	},
	function (error) {
		console.error('An error happened:', error);
		console.error('Error details:', error.message || error);
	}
);

// --- Light ---
const ambLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambLight);

// --- Controls ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

// --- Animation ---
function animate(t = 0) {
	requestAnimationFrame(animate);
	// scene.rotation.y = t * 0.0001;
	renderer.render(scene, camera);
	controls.update();
}
animate();

window.addEventListener('resize', onWindowResize, false);


function onWindowResize() {
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
	renderer.setSize(w, h);
}