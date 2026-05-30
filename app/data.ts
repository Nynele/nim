export type LocalizedString = string | {
  en: string;
  es: string;
  it: string;
  fr: string;
  de: string;
  pt: string;
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
      en: 'Hospitality Officer in a verified Discord server. Active member supporting the community with moderation and engagement since 2026.',
      es: 'Hospitality Officer en un servidor de Discord verificado. Miembro activo que apoya a la comunidad con moderación y participación desde 2026.',
      it: 'Hospitality Officer in un server Discord verificato. Membro attivo che supporta la community con moderazione e coinvolgimento dal 2026.',
      fr: 'Hospitality Officer dans un server Discord vérifié. Membre actif qui supporte la communauté avec de la modération et de l\'engagement depuis 2026.',
      de: 'Hospitality Officer auf einem verifizierten Discord-Server. Aktives Mitglied, das die Community seit 2026 mit Moderation und Engagement unterstützt.',
      pt: 'Hospitality Officer em um servidor verificado do Discord. Membro ativo apoiando a comunidade com moderação e engajamento desde 2026.'
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
      es: 'Diseño y escalado de infraestructura de servidores de alto rendimiento. Permisos avanzados y desarrollo de bots personalizados para una gran comunidad.',
      it: 'Progettazione e scalabilità di infrastrutture server ad alte prestazioni. Permessi avanzati e sviluppo di bot personalizzati per una grande community.',
      fr: 'Conception et évolution d\'infrastructures de serveurs haute performance. Permissions avancées et développement de bots personnalisés pour une grande communauté.',
      de: 'Konzeption und Skalierung hochleistungsfähiger Serverinfrastrukturen. Erweiterte Berechtigungen und maßgeschneiderte Bot-Entwicklung für eine große Community.',
      pt: 'Projetando e escalando infraestrutura de servidor de alto desempenho. Permissões avançadas e desenvolvimento de bots personalizados para uma grande comunidade.'
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
      en: 'Hospitality Officer',
      es: 'Hospitality Officer',
      it: 'Hospitality Officer',
      fr: 'Hospitality Officer',
      de: 'Hospitality Officer',
      pt: 'Hospitality Officer'
    },
    start: '2026',
    end: {
      en: 'Present',
      es: 'Presente',
      it: 'Presente',
      fr: 'Présent',
      de: 'Heute',
      pt: 'Presente'
    },
    link: 'https://discord.gg/enginefall',
    id: 'work-enginefall',
    verified: true,
  },
  {
    company: 'Rules of Engagement',
    title: {
      en: 'Moderator',
      es: 'Moderador',
      it: 'Moderatore',
      fr: 'Modérateur',
      de: 'Moderator',
      pt: 'Moderador'
    },
    start: '2023',
    end: {
      en: 'Present',
      es: 'Presente',
      it: 'Presente',
      fr: 'Présent',
      de: 'Heute',
      pt: 'Presente'
    },
    link: 'https://discord.gg/rulesofengagement',
    id: 'work-roe',
    verified: true,
  },
  {
    company: 'Melias',
    title: {
      en: 'Discord Community Manager',
      es: 'Community Manager de Discord',
      it: 'Community Manager di Discord',
      fr: 'Community Manager Discord',
      de: 'Discord Community Manager',
      pt: 'Community Manager de Discord'
    },
    start: '2025',
    end: {
      en: 'Present',
      es: 'Presente',
      it: 'Presente',
      fr: 'Présent',
      de: 'Heute',
      pt: 'Presente'
    },
    link: 'https://github.com/Nynele',
    id: 'work-melias',
  },
  {
    company: 'OWN',
    title: {
      en: 'Discord Community Manager',
      es: 'Community Manager de Discord',
      it: 'Community Manager di Discord',
      fr: 'Community Manager Discord',
      de: 'Discord Community Manager',
      pt: 'Community Manager de Discord'
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
      es: 'Diseñador de Discord',
      it: 'Designer di Discord',
      fr: 'Designer Discord',
      de: 'Discord-Designer',
      pt: 'Designer de Discord'
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
      es: 'Configuración de Servidor de Discord',
      it: 'Configurazione Server Discord',
      fr: 'Configuration Serveur Discord',
      de: 'Discord-Server-Setup',
      pt: 'Configuração de Servidor Discord'
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
      es: 'Moderador',
      it: 'Moderatore',
      fr: 'Modérateur',
      de: 'Moderator',
      pt: 'Moderador'
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
