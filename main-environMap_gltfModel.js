import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Pane } from 'tweakpane';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

// init pane
const pane = new Pane();

// add loader
const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath("./textures/");

// 三维场景
const scene = new THREE.Scene();

//add the environment map - cube mapping
// const path = './textures/cube/Park3Med/';
// const format = '.jpg';
// const urls = [
// 	path + 'px' + format, path + 'nx' + format,
// 	path + 'py' + format, path + 'ny' + format,
// 	path + 'pz' + format, path + 'nz' + format
// ];
// const envMap = new THREE.CubeTextureLoader().load( urls );
const envMap = new THREE.CubeTextureLoader()
	.setPath( './textures/cube/Park3Med/' )
	.load([ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
scene.background = envMap;
scene.environment = envMap;

// Load 3D model in GLB format
const gltfLoader = new GLTFLoader();
gltfLoader.load('./models/boomBoxGLTF/BoomBox.gltf', (gltf) => {
    const modelScene = gltf.scene;
    const material = modelScene.children[0].material;
    pane.addBinding(material, 'roughness', {
      min: 0,
      max: 1,
      step: 0.01,
    });
    // material.envMap = envMap;
    material.envMapIntensity = 2;
    modelScene.scale.setScalar(50);
    scene.add(gltf.scene);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log(error);
  }
);

//光源设置
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(2,2,2);
scene.add(directionalLight);

//渲染器和相机
const width = window.innerWidth;
const height = window.innerHeight;
const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 200);
camera.position.set(0, 1, 2);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

// 渲染循环
function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();

const controls = new OrbitControls(camera, renderer.domElement);

// 画布跟随窗口变化
window.onresize = function () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};
