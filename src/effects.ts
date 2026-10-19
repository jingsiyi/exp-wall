import gsap from 'gsap'

type Point = { x: number; y: number; vx: number; vy: number; el: HTMLElement }

export function setupInteraction(root: HTMLElement) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const points: Point[] = Array.from(root.querySelectorAll<HTMLElement>('[data-cloth]')).map(el => ({ x: 0, y: 0, vx: 0, vy: 0, el }))
  const cursor = { x: -9999, y: -9999, active: false }
  const trails: HTMLElement[] = []
  let raf = 0
  const move = (event: MouseEvent) => { cursor.x = event.clientX; cursor.y = event.clientY; cursor.active = true }
  const leave = () => { cursor.active = false }
  const tick = () => {
    points.forEach(point => {
      const rect = point.el.getBoundingClientRect()
      const dx = rect.left + rect.width / 2 - cursor.x
      const dy = rect.top + rect.height / 2 - cursor.y
      const distance = Math.max(80, Math.hypot(dx, dy))
      const force = cursor.active ? Math.max(0, 1 - distance / 380) * 9 : 0
      point.vx += (dx / distance) * force
      point.vy += (dy / distance) * force
      point.vx *= 0.86; point.vy *= 0.86; point.x += point.vx; point.y += point.vy
      gsap.set(point.el, { x: point.x, y: point.y, rotate: point.vx * 0.18, transformOrigin: 'center' })
    })
    raf = requestAnimationFrame(tick)
  }
  const splash = (x: number, y: number) => {
    const el = document.createElement('span')
    el.className = 'ink-splash'; el.style.left = `${x}px`; el.style.top = `${y}px`
    el.style.setProperty('--hue', `${Math.floor(Math.random() * 360)}deg`)
    root.appendChild(el); gsap.fromTo(el, { scale: 0, opacity: 0.9 }, { scale: 1, opacity: 0, duration: 2.5, ease: 'power2.out', onComplete: () => el.remove() })
  }
  const click = (event: MouseEvent) => { splash(event.clientX, event.clientY) }
  const drag = (event: MouseEvent) => {
    if (!event.buttons) return
    const el = document.createElement('span'); el.className = 'ink-trail'; el.style.left = `${event.clientX}px`; el.style.top = `${event.clientY}px`
    el.style.setProperty('--hue', `${Math.floor(Math.random() * 360)}deg`); root.appendChild(el); trails.push(el)
    gsap.to(el, { opacity: 0, scale: 3, x: Math.random() * 20 - 10, y: Math.random() * 20 - 10, duration: 1.2, onComplete: () => el.remove() })
  }
  if (!reduced) { root.addEventListener('mousemove', move); root.addEventListener('mousemove', drag); root.addEventListener('mouseleave', leave); root.addEventListener('click', click); raf = requestAnimationFrame(tick) }
  return () => { cancelAnimationFrame(raf); root.removeEventListener('mousemove', move); root.removeEventListener('mousemove', drag); root.removeEventListener('mouseleave', leave); root.removeEventListener('click', click); trails.forEach(el => el.remove()) }
}
