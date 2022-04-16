'use strict'

import { useEffect, useRef, useState } from 'react'
import './App.css'
import * as THREE from "three"
import gsap from 'gsap'

import backImg from './assets/img/space.jpg'

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
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
  camera.position.z = 3
  scene.add(camera)

  const renderer = new THREE.WebGLRenderer({ alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.render(scene, camera)

  const axesHelper = new THREE.AxesHelper(2)
  scene.add(axesHelper)

  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ color: '#ff0000' })
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  gsap.to(mesh.position, {duration: 1, delay: 1, x: 2})
  const clock = new THREE.Clock();
  const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // update objects
    // mesh.position.x = Math.cos(elapsedTime)
    // mesh.position.y = Math.sin(elapsedTime)

    // // camera rotation
    // camera.position.x = Math.cos(elapsedTime)
    // camera.position.y = Math.sin(elapsedTime)
    // camera.lookAt(mesh.position)

    // Render
    renderer.render(scene, camera)

    // call
    window.requestAnimationFrame(tick)
  }
  tick()


  useEffect(() => {
    const elem = mountRef.current
    elem?.appendChild(renderer.domElement)

    // // コンストラクタとコールバック
    // const observer = new ResizeObserver((entries) => {
    //   renderer.setSize(window.innerWidth, window.innerHeight)
    //   camera.aspect = window.innerWidth / window.innerHeight
    //   camera.updateProjectionMatrix()
    // });

    // // 要素を監視
    // if(mountRef.current) observer.observe(mountRef.current);

    // // クリーンアップ関数で監視を解く
    // return () => {
    //   observer.disconnect();
    // };
  })
  return (
    <div className="App" ref={mountRef} style = { backImageStyle }>
    </div>
  )
}

export default App
