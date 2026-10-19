import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, X } from 'lucide-react'
import { chapters, marqueeImages } from './data'
import { AnimatedText, ContactButton, FadeIn, ProjectCard } from './components'
import Nebula from './Nebula'
import { setupInteraction } from './effects'

const projectNames = ['Liminal / 01', 'Nocturne / 02', 'Signal / 03', 'Afterimage / 04']

export default function App() {
  const root = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [offset, setOffset] = useState(0)
  useEffect(() => { if (root.current) return setupInteraction(root.current) }, [])
  useEffect(() => {
    const onScroll = () => setOffset((window.scrollY - (document.querySelector('.marquee')?.getBoundingClientRect().top ?? 0) + innerHeight) * 0.3)
    addEventListener('scroll', onScroll, { passive: true }); onScroll(); return () => removeEventListener('scroll', onScroll)
  }, [])
  const openStory = (_image?: string) => {
    void fetch('/story.md')
      .then(response => {
        if (!response.ok) throw new Error(`story.md request failed: ${response.status}`)
        return response.text()
      })
      .then(setSelected)
      .catch(error => setSelected(`无法读取 story.md\n\n${error instanceof Error ? error.message : '未知读取错误'}`))
  }
  return <main ref={root} className="app">
    <Nebula />
    <section className="hero" id="top">
      <FadeIn className="nav" delay={0}><a href="#about">About</a><a href="#projects">Projects</a><a href="#contact">Contact</a></FadeIn>
      <FadeIn className="hero-title-wrap" delay={0.15} y={40}><h1 className="hero-heading">英雄之家</h1></FadeIn>
      <div className="hero-footer"><FadeIn delay={0.35} y={20}><p>Creative developer<br />& visual storyteller</p></FadeIn><FadeIn delay={0.5} y={20}><ContactButton onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })} /></FadeIn></div>
      <FadeIn className="portrait" delay={0.6} y={30}><div className="portrait-ring">EP</div></FadeIn>
    </section>
    <section className="marquee" aria-label="image marquee">
      <div className="marquee-row" style={{ transform: `translateX(${offset - 200}px)` }}>{[...marqueeImages.slice(0, 11), ...marqueeImages.slice(0, 11), ...marqueeImages.slice(0, 11)].map((src, i) => <img key={i} src={src} alt="" loading="lazy" onClick={() => openStory(src)} />)}</div>
      <div className="marquee-row" style={{ transform: `translateX(${-(offset - 200)}px)` }}>{[...marqueeImages.slice(11), ...marqueeImages.slice(11), ...marqueeImages.slice(11)].map((src, i) => <img key={i} src={src} alt="" loading="lazy" onClick={() => openStory(src)} />)}</div>
    </section>
    <section className="about" id="about"><FadeIn><h2 className="hero-heading">About me</h2></FadeIn><AnimatedText text="这里放你的自我介绍啊喂" /><FadeIn delay={0.2}><ContactButton onClick={() => openStory()} /></FadeIn></section>
    <section className="projects" id="projects"><FadeIn><h2 className="hero-heading">Project</h2></FadeIn><div className="project-stack">{projectNames.map((name, index) => <ProjectCard key={name} index={index} name={name} images={[chapters[index * 3].image, chapters[index * 3 + 1].image, chapters[index * 3 + 2].image]} onImageClick={openStory} />)}</div></section>
    <footer id="contact"><p>Have a story to tell?</p><a href="mailto:hello@example.com">hello@example.com <ArrowUpRight size={18} /></a></footer>
    {selected && <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={() => setSelected(null)}><div className="story-modal" onClick={event => event.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)} aria-label="关闭"><X /></button><pre>{selected}</pre></div></div>}
  </main>
}
