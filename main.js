import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
//引入性能监视器stats.js,显示帧率
import Stats from "three/addons/libs/stats.module.js";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

//创建stats对象
const stats = new Stats();
//Stats.domElement:web页面上输出计算结果,一个div元素
document.body.appendChild(stats.domElement);

// 三维场景
const scene = new THREE.Scene();

// // 创建网格模型对象
// const geometry = new THREE.BoxGeometry(100, 100, 100);
// // 漫反射网格材质；MeshLambertMaterial
// const material = new THREE.MeshLambertMaterial({
//   color: 0x00ffff, //设置材质颜色
//   transparent: true, //开启透明
//   opacity: 0.5, //设置透明度
// });
// const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
// scene.add(mesh); //网格模型添加到场景中

// Load 3D model in GLB format
const loader = new GLTFLoader();
let model;
loader.load('building.glb', (gltf) => {
    model = gltf.scene;
    model.scale.set(1,1,1);
    model.position.z = -2;
    model.position.x = 2;
    model.position.y = 1;
    scene.add(gltf.scene)
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
  },
  (error) => {
    console.log(error)
  }
);

//辅助观察的坐标系
const axesHelper = new THREE.AxesHelper(50);
scene.add(axesHelper);

//光源设置
// const pointLight = new THREE.PointLight(0xffffff, 1.0);
// pointLight.position.set(400, 200, 300);
// scene.add(pointLight);
// const ambient = new THREE.AmbientLight(0xffffff, 0.4);
// scene.add(ambient);
const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight(0xffffff,2)
directionalLight.position.set(0,1,0)
scene.add(directionalLight)

//渲染器和相机
const width = window.innerWidth;
const height = window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.set(0, 1, 2);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

// 渲染循环
function render() {
  stats.update(); //渲染循环中执行stats.update()来刷新时间
  renderer.render(scene, camera);
  //mesh.rotateY(0.01);
  //model.rotation.x += 0.05;
  //model.rotation.y += 0.05;
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
