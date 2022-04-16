'use strict'

import { useEffect, useRef, useState } from 'react'
import './App.css'
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
// import * as dat from "dat.gui"

import backImg from './assets/img/space.jpg'
import * as lil from 'lil-gui'

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

  const clock = new THREE.Clock();
  const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // update camera
    // camera.position.x = cursor.x
    // camera.position.y = cursor.y

    controls.update()

    // Render
    renderer.render(scene, camera)

    // call
    window.requestAnimationFrame(tick)
  }
  tick()

  const parameters = {
    count: 1000,
    size: 0.02,
    radius: 5,
    branches: 3,
    spin: 1,
  }

  let geometry: THREE.BufferGeometry
  let material: THREE.PointsMaterial
  let points: THREE.Points
  const generateGalaxy = () => {
    // destroy old galaxy
    if(points != undefined) {
      geometry.dispose()
      material.dispose()
      scene.remove(points)
    }
    // Geometry
    geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(parameters.count * 3)

    for (let i = 0; i < parameters.count; i++) {
      const i3 = i * 3
      const radius = Math.random() * parameters.radius
      const spinAngle = radius * parameters.spin
      const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

      positions[i3    ] = Math.cos(branchAngle + spinAngle) * radius
      positions[i3 + 1] = 0
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    // Material
    material = new THREE.PointsMaterial({
      size: parameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    // Points
    points = new THREE.Points(geometry, material)
    scene.add(points)
  }
  generateGalaxy()

  gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
  gui.add(parameters, 'size').min(0.001).step(0.001).onFinishChange(generateGalaxy)
  gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
  gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
  gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)

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
