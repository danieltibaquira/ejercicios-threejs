import * as THREE from '/build/three.module.js';
import {OrbitControls} from '/jsm/controls/OrbitControls.js';
import {FirstPersonControls} from '/jsm/controls/FirstPersonControls.js';
import {PointerLockControls} from '/jsm/controls/PointerLockControls.js';

//variables a usar
var g_camera, g_controls, g_controls_pointer,
    g_scene, g_renderer,
    g_mars;

// Radio de Marte en km
var RADIUS=3390; // Km


//Corriendo esta función genero la geometría, el mapa y las funcionalidades de escena
function main() {

    setupScene();
    setupCamera();
    setupRenderer();

    drawMars(scaleValue(RADIUS));

    startAnimation();
}

//Funciones para dibujar la esfera, en este caso, Marte, con un radio especificado
function drawMars(radius){
    var segments=50;

    var loader = new THREE.TextureLoader();

    //Mapa obtenido de http://planetpixelemporium.com/mars5672.html
    var tex = loader.load('./mars.jpg')
    var normal = loader.load('./mars_normal.jpg');
    var topo = loader.load('./mars_topo.jpg');

    var geometry = new THREE.SphereGeometry(radius,segments,segments);
    //Seleccioné Phong, pero fue arbitrario, se pueden hacer experimentos de cómo se vería con otro tipo
    var material = new THREE.MeshPhongMaterial({
        map: tex,
        bumpMap: topo,
        normalMap: normal
    });

    //A la geometría Sphere le agrego el material (el mapa)
    g_mars = new THREE.Mesh(geometry, material);

    g_scene.add(g_mars);

}


// Funciones auxiliares para trabajar con el valor del radio
function scaleValue(size){
    var newSize=size*100/RADIUS;
    return newSize;
}

function scalePoint(point){
    var newPoint={x:0,y:0,z:0};

    newPoint["x"]=scaleValue(point["x"]);
    newPoint["y"]=scaleValue(point["y"]);
    newPoint["z"]=scaleValue(point["z"]);

    return newPoint;
}


//Funciones para control del luz, escena, cambios de tamaño de ventana, etc.
// Es un boiler plate muy útil que vale la pena usar en el resto de los proyectos
function setupScene(){


    g_scene = new THREE.Scene();
    g_scene.background = new THREE.Color(0x000000);
    var ambient = new THREE.AmbientLight(0xffffff);
    g_scene.add(ambient);
}

function setupCamera(){
    g_camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    g_camera.position.z = 300;
}

function setupRenderer(){
    g_renderer = new THREE.WebGLRenderer({
        antialias: false
    });

    g_renderer.setPixelRatio(window.devicePixelRatio);
    g_renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(g_renderer.domElement);

    g_controls = new FirstPersonControls(g_camera, g_renderer.domElement);
    // First Person Controls
    g_controls.autoFoward = false;
    // Si quiero una vista más orbital se cambia este a false
    // Si lo activo es mejor bajar la velocidad de refresco
    g_controls.activeLook = false;


    // g_controls_pointer = new PointerLockControls(g_camera, g_renderer.domElement);
    // g_controls_pointer.update();
}

function startAnimation() {
    requestAnimationFrame(startAnimation);
    g_renderer.render(g_scene, g_camera);
    g_controls.update(1.5);
    // g_controls_pointer.connect();
    // g_controls_pointer.lock();
}

// Llamado a la función que calcula todo
main();
