import * as THREE from '/build/three.module.js';
import {OrbitControls} from '/jsm/controls/OrbitControls.js';
import Stats from '/jsm/libs/stats.module.js';
import { GLTFLoader } from '/jsm/loaders/GLTFLoader.js'


 var scene, camera, renderer;


console.log("Created Scene")
scene = new THREE.Scene();
scene.background = new THREE.Color('rgb(238, 238, 238)');

camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight);
camera.position.set(0, 100, 800);


renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new OrbitControls(camera, renderer.domElement);
controls.update();

var abint = new THREE.AmbientLight(0xEEEEEE, 5)
scene.add(abint);

const loader = new GLTFLoader();
loader.load( 'model/scene.gltf', function ( gltf ) {
  gltf.scene.scale.set(1.5, 1.5, 1.5);
    scene.add( gltf.scene );
    console.log("Loaded model");

}, undefined, function ( error ) {
	console.error( error );
} );

function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
