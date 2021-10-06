import * as THREE from '/build/three.module.js';

import { PeppersGhostEffect } from '/jsm/effects/PeppersGhostEffect.js';

let container;

let camera, scene, renderer, effect;
let group;

let socket = io.connect("http://localhost:3004", { forceNew: true });

init();
animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );

    scene = new THREE.Scene();

    group = new THREE.Group();
    scene.add( group );

    const geometry = new THREE.BoxGeometry().toNonIndexed();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    group.add( cube );


    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    container.appendChild( renderer.domElement );

    effect = new PeppersGhostEffect( renderer );
    effect.setSize( window.innerWidth, window.innerHeight );
    effect.cameraDistance = 5;

    window.addEventListener( 'resize', onWindowResize );

}


function scaleValue(size){
    var newSize=size*100/RADIUS;
    return newSize;
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    effect.setSize( window.innerWidth, window.innerHeight );

}

let anterior = 0;
let actual;
function animate() {

    requestAnimationFrame( animate );

    socket.on("messages", function (value, raw) {
      actual = value.value;
      // if(actual != anterior){
        console.log(actual)
        anterior = actual;
        if(actual >= 512){
            group.rotation.y += 100;
        }else{
            group.rotation.x += 100;
        }
      // }
    })

    effect.render( scene, camera );

}
