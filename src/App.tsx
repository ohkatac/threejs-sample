'use strict'

import { useEffect, useRef, useState } from 'react'
import './App.css'
import * as THREE from "three"

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

  const axesHelper = new THREE.AxesHelper(2)
  scene.add(axesHelper)

  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ color: '#ff0000' })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.x = 0.7
  mesh.position.y = -0.6
  mesh.position.z = 1
  scene.add(mesh)

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
  camera.position.z = 3
  scene.add(camera)

  const renderer = new THREE.WebGLRenderer({ alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.render(scene, camera)

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
