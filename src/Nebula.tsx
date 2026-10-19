import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Nebula() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const mount = ref.current!
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 3000); camera.position.z = 220
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(innerWidth, innerHeight); mount.appendChild(renderer.domElement)
    const positions = new Float32Array(6000 * 3)
    for (let i = 0; i < positions.length; i++) positions[i] = (Math.random() - 0.5) * 1200
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const points = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x5aa9ff, size: 1.4, transparent: true, opacity: 0.55 }))
    scene.add(points)
    let frame = 0
    const animate = () => { points.rotation.y += 0.0012; points.rotation.x += 0.0004; renderer.render(scene, camera); frame = requestAnimationFrame(animate) }
    const resize = () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight) }
    addEventListener('resize', resize); animate()
    return () => { cancelAnimationFrame(frame); removeEventListener('resize', resize); geometry.dispose(); (points.material as THREE.Material).dispose(); renderer.dispose(); mount.removeChild(renderer.domElement) }
  }, [])
  return <div ref={ref} className="nebula" aria-hidden="true" />
}
