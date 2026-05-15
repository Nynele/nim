export type LocalizedString = string | {
  en: string;
  es: string;
};

export type Project = {
  name: string
  description: LocalizedString
  link: string
  images: string[]
  id: string
  verified?: boolean
}

export type WorkExperience = {
  company: string
  title: LocalizedString
  start: string
  end: LocalizedString
  link: string
  id: string
  verified?: boolean
}

export const PROJECTS: Project[] = [
  {
    name: 'EngineFall',
    description: {
      en: 'Community Helper in a verified Discord server. Active member supporting the community with moderation and engagement since 2026.',
      es: 'Ayudante de la comunidad en un servidor de Discord verificado. Miembro activo que apoya a la comunidad con moderación y participación desde 2026.'
    },
    link: 'https://discord.gg/enginefall',
    images: [
      'https://cdn.discordapp.com/icons/1139094495883972638/44c2b9edc6218a28049e2a14aa8a9083.webp?size=1024',
    ],
    id: 'project-enginefall',
    verified: true,
  },
  {
    name: 'Rules of Engagement: The Grey State',
    description: {
      en: 'Designing and scaling high-performance server infrastructure. Advanced permissions and custom bot development for a major community.',
      es: 'Diseño y escalado de infraestructura de servidores de alto rendimiento. Permisos avanzados y desarrollo de bots personalizados para una gran comunidad.'
    },
    link: 'https://discord.gg/rulesofengagement',
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
    title: {
      en: 'Community Helper',
      es: 'Ayudante de la Comunidad'
    },
    start: '2026',
    end: {
      en: 'Present',
      es: 'Presente'
    },
    link: 'https://discord.gg/enginefall',
    id: 'work-enginefall',
    verified: true,
  },
  {
    company: 'Rules of Engagement',
    title: {
      en: 'Discord Designer',
      es: 'Diseñador de Discord'
    },
    start: '2023',
    end: {
      en: 'Present',
      es: 'Presente'
    },
    link: 'https://discord.gg/rulesofengagement',
    id: 'work-roe',
    verified: true,
  },
  {
    company: 'Melias',
    title: {
      en: 'Discord Community Manager',
      es: 'Community Manager de Discord'
    },
    start: '2025',
    end: {
      en: 'Present',
      es: 'Presente'
    },
    link: 'https://github.com/Nynele',
    id: 'work-melias',
  },
  {
    company: 'OWN',
    title: {
      en: 'Discord Community Manager',
      es: 'Community Manager de Discord'
    },
    start: '2025',
    end: '2025',
    link: 'https://github.com/Nynele',
    id: 'work-own',
  },
  {
    company: 'ByteMate',
    title: {
      en: 'Discord Designer',
      es: 'Diseñador de Discord'
    },
    start: '2025',
    end: '2025',
    link: 'https://github.com/Nynele',
    id: 'work-bytemate',
  },
  {
    company: 'Metacraft Network',
    title: {
      en: 'Discord Server Setup',
      es: 'Configuración de Servidor de Discord'
    },
    start: '2025',
    end: '2025',
    link: 'https://github.com/Nynele',
    id: 'work-metacraft',
  },
  {
    company: 'Dawnlands',
    title: {
      en: 'Moderator',
      es: 'Moderador'
    },
    start: '2023',
    end: '2025',
    link: 'https://discord.gg/8P3p3HBJ8w',
    id: 'work-dawnlands',
    verified: true,
  },
]

export const SOCIAL_LINKS = {
  github: 'https://github.com/Nynele',
  twitter: 'https://twitter.com/nynele',
  discord: 'https://discord.com/users/799251427839049818',
};

export const EMAIL = 'nyneletwitch@gmail.com'
