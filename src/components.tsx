import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

export function ContactButton({ onClick }: { onClick?: () => void }) {
  return <button className="contact-button" onClick={onClick}>联系我</button>
}

export function FadeIn({ children, delay = 0, duration = 0.8, x = 0, y = 0, className = '' }: {
  children: ReactNode; delay?: number; duration?: number; x?: number; y?: number; className?: string
}) {
  return <motion.div className={className} initial={{ opacity: 0, x, y }} whileInView={{ opacity: 1, x: 0, y: 0 }}
    viewport={{ once: true, margin: '50px' }} transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}>{children}</motion.div>
}

export function AnimatedText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] })
  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1])
  return <motion.p ref={ref} style={{ opacity }} className="animated-text">
    {Array.from(text).map((char, index) => <span key={`${char}-${index}`}>{char}</span>)}
  </motion.p>
}

export function ProjectCard({ index, name, images, onImageClick }: { index: number; name: string; images: string[]; onImageClick: (image: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] })
  const targetScale = 1 - (3 - index) * 0.03
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale])
  return <motion.article ref={ref} style={{ scale, top: `${index * 28}px` }} className="project-card">
    <div className="project-card__top"><span className="project-number">0{index + 1}</span><h3>{name}</h3></div>
    <div className="project-card__images">
      <div className="project-col project-col--small"><img src={images[0]} alt="" loading="lazy" onClick={() => onImageClick(images[0])} /><img src={images[1]} alt="" loading="lazy" onClick={() => onImageClick(images[1])} /></div>
      <div className="project-col project-col--large"><img src={images[2]} alt="" loading="lazy" onClick={() => onImageClick(images[2])} /></div>
    </div>
  </motion.article>
}
