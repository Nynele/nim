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
    name: 'Melias',
    description:
      'Built a Discord server from scratch, developed a custom bot and manage the community for a +300k YouTube creator.',
    link: 'https://github.com/Nynele',
    images: [
      '/projects/melias/melias-1.png',
      '/projects/melias/melias-2.png',
      '/projects/melias/melias-3.png',
    ],
    id: 'project1',
  },
  {
    name: 'Rules of Engagement: The Grey State',
    description:
      'Official video game server. Currently serving as Moderator with active server management and structured moderation.',
    link: 'https://discord.gg/rulesofengagement',
    images: [
      '/projects/rulesofengagement/f256a35a2318137d853acc40843cbb94.webp',
    ],
    id: 'project2',
    verified: true,
  },
]

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: 'Rules of Engagement: The Grey State',
    title: 'Moderator',
    start: '2025',
    end: 'Present',
    link: 'https://discord.gg/rulesofengagement',
    id: 'work-roe',
    verified: true,
  },
  {
    company: 'Melias',
    title: 'Discord Community Manager',
    start: '2025',
    end: 'Present',
    link: 'https://github.com/Nynele',
    id: 'work1',
  },
  {
    company: 'OWN',
    title: 'Discord Community Manager',
    start: '2025',
    end: '2025',
    link: 'https://github.com/Nynele',
    id: 'work3',
  },
  {
    company: 'ByteMate',
    title: 'Discord Designer',
    start: '2025',
    end: '2025',
    link: 'https://github.com/Nynele',
    id: 'work2',
  },
  {
    company: 'Metacraft Network',
    title: 'Discord Server Setup',
    start: '2025',
    end: '2025',
    link: 'https://github.com/Nynele',
    id: 'work4',
  },
  {
    company: 'Dawnlands',
    title: 'Moderator',
    start: '2023',
    end: '2025',
    link: 'https://discord.gg/8P3p3HBJ8w',
    id: 'work5',
    verified: true,
  },
]

export const BLOG_POSTS: BlogPost[] = [
  {
    title: 'My Toolkit: The Apps and Languages I Use Every Day',
    description: 'Affinity, Photoshop, VS Code, JavaScript, Python, Discohook and more.',
    link: '/blog/my-toolkit',
    uid: 'blog-1',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'GitHub',
    link: 'https://github.com/Nynele',
  },
  {
    label: 'Twitter',
    link: 'https://x.com/nyneletwitch',
  },
  {
    label: 'Discord',
    link: 'https://discord.com/users/799251427839049818',
  },
]

export const EMAIL = 'nyneletwitch@gmail.com'
