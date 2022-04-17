'use strict'

import { useEffect, useRef, useState } from 'react'
import './App.css'
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
// import * as dat from "dat.gui"

import backImg from './assets/img/space.jpg'
import * as lil from 'lil-gui'
import { Raycaster } from 'three'

const gui = new lil.GUI()

const backImageStyle = {
  width: '100%',
  height: '100%',
  backgroundImage: `url(${backImg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center'
};


const App = () => {
  // const [count, setCount] = useState(0)
  const mountRef = useRef<HTMLDivElement>(null)
  const scene = new THREE.Scene()

  const aspectRatio = window.innerWidth / window.innerHeight
  const camera = new THREE.PerspectiveCamera(75, aspectRatio, 1, 1000)
  // camera.position.z = 3
  camera.position.set(1, 1, 3)
  scene.add(camera)

  const renderer = new THREE.WebGLRenderer({ alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.render(scene, camera)

  const controls = new OrbitControls(camera, renderer.domElement)

  const obj1 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 })
  )
  obj1.position.x = -2
  const obj2 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 })
  )
  const obj3 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 })
  )
  obj3.position.x = 2

  scene.add(obj1, obj2, obj3)

  /* create raycaster */
  const raycaster = new THREE.Raycaster()

  const rayOrigin = new THREE.Vector3(-3, 0, 0)
  const rayDirection = new THREE.Vector3(1, 0, 0)
  rayDirection.normalize()

  raycaster.set(rayOrigin, rayDirection)

  const intersect = raycaster.intersectObject(obj2)
  console.log(intersect)

  const intersects = raycaster.intersectObjects([obj1, obj2, obj3])
  console.log(intersects)

  const clock = new THREE.Clock();
  const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // animate object
    obj1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    obj2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    obj3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

    // cast a ray
    const rayOrigin = new THREE.Vector3(-3, 0, 0)
    const rayDirection = new THREE.Vector3(1, 0, 0)
    rayDirection.normalize()

    raycaster.set(rayOrigin, rayDirection)

    const objectToTest = [obj1, obj2, obj3]
    const intersects = raycaster.intersectObjects(objectToTest)

    console.log(intersects)
    controls.update()

    // Render
    renderer.render(scene, camera)

    // call
    window.requestAnimationFrame(tick)
  }
  tick()

  useEffect(() => {
    const elem = mountRef.current
    elem?.appendChild(renderer.domElement)

    // コンストラクタとコールバック
    const observer = new ResizeObserver((entries) => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
    });

    // 要素を監視
    if(mountRef.current) observer.observe(mountRef.current);

    // クリーンアップ関数で監視を解く
    return () => {
      observer.disconnect();
    };
  })
  return (
    <div className="App" ref={mountRef} style = { backImageStyle }>
    </div>
  )
}

export default App
