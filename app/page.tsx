'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'motion/react'
import {
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  MonitorIcon,
  MoonIcon,
  SunIcon,
  Music2Icon,
  BadgeCheckIcon,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Spotlight } from '@/components/ui/spotlight'
import { Magnetic } from '@/components/ui/magnetic'
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogContainer,
} from '@/components/ui/morphing-dialog'
import Link from 'next/link'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { TextEffect } from '@/components/ui/text-effect'
import {
  PROJECTS,
  WORK_EXPERIENCE,
  BLOG_POSTS,
  EMAIL,
  SOCIAL_LINKS,
} from './data'

// â”€â”€ Animation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

const TRANSITION_SECTION = { duration: 0.3 }

// â”€â”€ Project image carousel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function ProjectImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [current, setCurrent] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800/60">
        <p className="text-xs text-zinc-400">Coming soon</p>
      </div>
    )
  }

  return (
    <MorphingDialog transition={{ type: 'spring', bounce: 0, duration: 0.3 }}>
      <MorphingDialogTrigger>
        <div className="group relative aspect-video w-full cursor-zoom-in overflow-hidden rounded-xl">
          <img src={images[current]} alt={`${alt} ${current + 1}`} className="h-full w-full object-cover" />
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setCurrent((current - 1 + images.length) % images.length) }}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <ChevronLeftIcon className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setCurrent((current + 1) % images.length) }}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <ChevronRightIcon className="h-3.5 w-3.5" />
              </button>
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setCurrent(i) }}
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/40'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent className="relative rounded-2xl bg-zinc-50 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950 dark:ring-zinc-800/50">
          <img src={images[current]} alt={`${alt} ${current + 1}`} className="h-[50vh] w-full rounded-xl object-cover md:h-[70vh]" />
        </MorphingDialogContent>
        <MorphingDialogClose
          className="fixed top-6 right-6 h-fit w-fit rounded-full bg-white p-1"
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { delay: 0.3, duration: 0.1 } },
            exit: { opacity: 0, transition: { duration: 0 } },
          }}
        >
          <XIcon className="h-5 w-5 text-zinc-500" />
        </MorphingDialogClose>
      </MorphingDialogContainer>
    </MorphingDialog>
  )
}

// â”€â”€ Social link â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function MagneticSocialLink({ children, link }: { children: React.ReactNode; link: string }) {
  return (
    <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-[1px] rounded-full bg-zinc-100 px-2.5 py-1 text-sm text-black transition-colors hover:bg-zinc-950 hover:text-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
      >
        {children}
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="h-3 w-3">
          <path d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
        </svg>
      </a>
    </Magnetic>
  )
}

// â”€â”€ Work experience list (scrollable with fade) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const WORK_VISIBLE_HEIGHT = 228

function WorkExperienceList() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollUp, setCanScrollUp] = useState(false)
  const [canScrollDown, setCanScrollDown] = useState(false)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollUp(el.scrollTop > 4)
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 4)
  }, [])

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    el?.addEventListener('scroll', checkScroll, { passive: true })
    const ro = new ResizeObserver(checkScroll)
    if (el) ro.observe(el)
    return () => { el?.removeEventListener('scroll', checkScroll); ro.disconnect() }
  }, [checkScroll])

  const scrollBy = (dir: -1 | 1) =>
    scrollRef.current?.scrollBy({ top: dir * 80, behavior: 'smooth' })

  return (
    <div className="relative">
      <div className={`pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-white to-transparent transition-opacity duration-200 dark:from-zinc-950 ${canScrollUp ? 'opacity-100' : 'opacity-0'}`} />
      <div className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-white to-transparent transition-opacity duration-200 dark:from-zinc-950 ${canScrollDown ? 'opacity-100' : 'opacity-0'}`} />
      {canScrollUp && (
        <button type="button" onClick={() => scrollBy(-1)} className="absolute inset-x-0 top-0.5 z-20 mx-auto flex w-fit rounded-full bg-white/80 p-0.5 text-zinc-400 shadow-sm backdrop-blur-sm transition-colors hover:text-zinc-700 dark:bg-zinc-900/80 dark:hover:text-zinc-200">
          <ChevronUpIcon className="h-3.5 w-3.5" />
        </button>
      )}
      {canScrollDown && (
        <button type="button" onClick={() => scrollBy(1)} className="absolute inset-x-0 bottom-0.5 z-20 mx-auto flex w-fit rounded-full bg-white/80 p-0.5 text-zinc-400 shadow-sm backdrop-blur-sm transition-colors hover:text-zinc-700 dark:bg-zinc-900/80 dark:hover:text-zinc-200">
          <ChevronDownIcon className="h-3.5 w-3.5" />
        </button>
      )}
      <div ref={scrollRef} style={{ maxHeight: WORK_VISIBLE_HEIGHT }} className="scrollbar-hide overflow-y-auto">
        <div className="flex flex-col space-y-2">
          {WORK_EXPERIENCE.map((job) => (
            <a
              key={job.id}
              className="relative overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30"
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Spotlight className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50" size={64} />
              <div className="relative h-full w-full rounded-[15px] bg-white p-4 dark:bg-zinc-950">
                <div className="flex w-full flex-row justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{job.title}</h4>
                      {job.verified && (
                        <span title="Discord Verified Server" className="inline-flex items-center gap-0.5 rounded-full bg-[#5865F2]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#5865F2] dark:bg-[#5865F2]/20">
                          <BadgeCheckIcon className="h-3 w-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{job.company}</p>
                  </div>
                  <p className="shrink-0 pl-4 text-sm text-zinc-400 dark:text-zinc-500">{job.start} – {job.end}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

// â”€â”€ Theme switch â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const THEME_OPTIONS = [
  { label: 'Light', id: 'light', icon: <SunIcon className="h-4 w-4" /> },
  { label: 'Dark', id: 'dark', icon: <MoonIcon className="h-4 w-4" /> },
  { label: 'System', id: 'system', icon: <MonitorIcon className="h-4 w-4" /> },
]

function ThemeSwitch() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return (
    <AnimatedBackground
      className="pointer-events-none rounded-lg bg-zinc-100 dark:bg-zinc-800"
      defaultValue={theme}
      transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
      enableHover={false}
      onValueChange={(id) => setTheme(id as string)}
    >
      {THEME_OPTIONS.map((t) => (
        <button key={t.id} type="button" aria-label={`Switch to ${t.label}`} data-id={t.id}
          className="inline-flex h-7 w-7 items-center justify-center text-zinc-500 transition-colors focus-visible:outline-2 data-[checked=true]:text-zinc-950 dark:text-zinc-400 dark:data-[checked=true]:text-zinc-50"
        >
          {t.icon}
        </button>
      ))}
    </AnimatedBackground>
  )
}

// â”€â”€ Last.fm widget â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type LastfmTrack = { name: string; artist: string; image: string; nowplaying: boolean }

function LastfmWidget() {
  const [track, setTrack] = useState<LastfmTrack | null>(null)

  const fetchTrack = useCallback(async () => {
    const user = process.env.NEXT_PUBLIC_LASTFM_USER
    const key = process.env.NEXT_PUBLIC_LASTFM_API_KEY
    if (!user || !key) return
    try {
      const res = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${key}&format=json&limit=1`)
      const data = await res.json()
      const t = data.recenttracks?.track?.[0]
      if (!t) return
      setTrack({ name: t.name, artist: t.artist['#text'], image: t.image?.[2]?.['#text'] ?? '', nowplaying: t['@attr']?.nowplaying === 'true' })
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    fetchTrack()
    const id = setInterval(fetchTrack, 30_000)
    return () => clearInterval(id)
  }, [fetchTrack])

  if (!track) return null

  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-900/60">
      {track.image
        ? <img src={track.image} alt={track.name} className="h-8 w-8 shrink-0 rounded-md object-cover" />
        : <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-zinc-200 dark:bg-zinc-800"><Music2Icon className="h-3.5 w-3.5 text-zinc-400" /></div>
      }
      <div className="min-w-0">
        <p className="flex items-center gap-1 text-[10px] text-zinc-400">
          {track.nowplaying && <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />}
          {track.nowplaying ? 'Now playing' : 'Last played'}
        </p>
        <p className="truncate text-xs font-medium text-zinc-700 dark:text-zinc-200">{track.name}</p>
        <p className="truncate text-[10px] text-zinc-500">{track.artist}</p>
      </div>
    </div>
  )
}

// â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function Personal() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden md:flex-row">

      {/* LEFT â€” fixed identity panel */}
      <motion.aside
        className="flex shrink-0 flex-col justify-between border-b border-zinc-100 p-8 dark:border-zinc-800/60 md:h-full md:w-72 md:overflow-hidden md:border-b-0 md:border-r lg:w-80"
        initial={{ opacity: 0, filter: 'blur(8px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.4 }}
      >
        <div className="space-y-5">
          <div>
            <Link href="/" className="text-lg font-semibold text-black dark:text-white">
              Nynele
            </Link>
            <TextEffect as="p" preset="fade" per="char" className="text-sm text-zinc-500" delay={0.4}>
              Discord Designer & Community Manager
            </TextEffect>
          </div>

          <p className="text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
            Proven expertise in designing and scaling high-performance server infrastructure. Advanced permissions and custom bot development.
          </p>

          <div className="flex flex-wrap gap-2">
            {SOCIAL_LINKS.map((link) => (
              <MagneticSocialLink key={link.label} link={link.link}>
                {link.label}
              </MagneticSocialLink>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <LastfmWidget />
          <ThemeSwitch />
        </div>
      </motion.aside>

      {/* RIGHT â€” scrollable content */}
      <motion.main
        className="scrollbar-hide flex-1 overflow-y-auto"
        variants={VARIANTS_CONTAINER}
        initial="hidden"
        animate="visible"
      >
        <div className="flex min-h-full flex-col">
          <div className="flex-1" />
          <div className="mx-auto w-full max-w-2xl space-y-16 px-8 py-12">

          {/* Selected Projects */}
          <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Selected Projects</h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {PROJECTS.map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="relative rounded-xl bg-zinc-50/40 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50">
                    <ProjectImageCarousel images={project.images} alt={project.name} />
                  </div>
                  <div className="px-0.5">
                    <div className="flex items-center gap-1.5">
                      <a className="group relative inline-block text-sm font-medium text-zinc-900 dark:text-zinc-50" href={project.link} target="_blank">
                        {project.name}
                        <span className="absolute bottom-0.5 left-0 block h-[1px] w-full max-w-0 bg-zinc-900 transition-all duration-200 group-hover:max-w-full dark:bg-zinc-50" />
                      </a>
                      {project.verified && (
                        <span title="Discord Verified Server" className="inline-flex items-center gap-0.5 rounded-full bg-[#5865F2]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#5865F2] dark:bg-[#5865F2]/20">
                          <BadgeCheckIcon className="h-3 w-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{project.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Work Experience */}
          <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Work Experience</h3>
            <WorkExperienceList />
          </motion.section>

          {/* Blog */}
          <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Blog</h3>
            <AnimatedBackground
              enableHover
              className="h-full w-full rounded-lg bg-zinc-100 dark:bg-zinc-900/80"
              transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
            >
              {BLOG_POSTS.map((post) => (
                <Link key={post.uid} className="-mx-3 rounded-xl px-3 py-3" href={post.link} data-id={post.uid}>
                  <div className="flex flex-col space-y-0.5">
                    <h4 className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{post.title}</h4>
                    <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{post.description}</p>
                  </div>
                </Link>
              ))}
            </AnimatedBackground>
          </motion.section>

          </div>
          <div className="flex-1" />

          {/* Connect — bottom full-width */}
          <motion.section
            variants={VARIANTS_SECTION}
            transition={TRANSITION_SECTION}
            className="w-full py-10 text-center"
          >
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Connect</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Feel free to reach me at{' '}
              <a className="underline underline-offset-2 dark:text-zinc-300" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
            </p>
            <p className="mt-6 text-xs text-zinc-400">&copy; 2026 Nynele.</p>
          </motion.section>

        </div>
      </motion.main>
    </div>
  )
}
