type Project = {
  name: string
  description: string
  link: string
  images: string[]
  id: string
  verified?: boolean
}

type WorkExperience = {
  company: string
  title: string
  start: string
  end: string
  link: string
  id: string
  verified?: boolean
}

type BlogPost = {
  title: string
  description: string
  link: string
  uid: string
}

type SocialLink = {
  label: string
  link: string
}

export const PROJECTS: Project[] = [
  {
    name: 'EngineFall',
    description:
      'Community Helper in a verified Discord server. Active member supporting the community with moderation and engagement since 2026.',
    link: 'https://discord.gg/enginefall',
    images: [
      'https://cdn.discordapp.com/icons/1139094495883972638/44c2b9edc6218a28049e2a14aa8a9083.webp?size=1024',
    ],
    id: 'project-enginefall',
    verified: true,
  },
  {
    name: 'Rules of Engagement',
    description:
      'Designing and scaling high-performance server infrastructure. Advanced permissions and custom bot development for a major community.',
    link: 'https://discord.gg/roe',
    images: [
      'https://cdn.discordapp.com/icons/1283296063020863518/f256a35a2318137d853acc40843cbb94.webp?size=1024',
    ],
    id: 'project-roe',
    verified: true,
  },
]

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: 'EngineFall',
    title: 'Community Helper',
    start: '2026',
    end: 'Present',
    link: 'https://discord.gg/enginefall',
    id: 'work-enginefall',
    verified: true,
  },
  {
    company: 'Rules of Engagement',
    title: 'Discord Designer',
    start: '2023',
    end: 'Present',
    link: 'https://discord.gg/roe',
    id: 'work-roe',
    verified: true,
  },
]

export const BLOG_POSTS: BlogPost[] = [
  {
    title: 'Advanced Discord Server Permissions',
    description: 'A deep dive into hierarchical permissions and security.',
    link: '#',
    uid: 'blog-1',
  },
]

export const SOCIAL_LINKS = {
  github: 'https://github.com/Nynele',
  twitter: 'https://twitter.com/nynele',
  discord: 'https://discord.com/users/799251427839049818',
};

export const EMAIL = 'nynele@example.com'
