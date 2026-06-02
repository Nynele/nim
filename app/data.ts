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
  skills?: string[]
  members?: string
  online?: string
  serverId?: string
  gameInfo?: LocalizedString
  logo?: string
}

export type WorkExperience = {
  company: string
  title: LocalizedString
  description: LocalizedString
  skills: string[]
  start: string
  end: LocalizedString
  link: string
  id: string
  verified?: boolean
  members?: string
  online?: string
  serverId?: string
  gameInfo?: LocalizedString
  images?: string[]
  logo?: string
}

export type Repository = {
  name: string
  description: LocalizedString
  language: string
  languageColor: string
  link: string
  id: string
  skills?: string[]
}

export const PROJECTS: Project[] = [
  {
    name: 'EngineFall',
    description: {
      en: 'Hospitality Officer in a verified Discord server. Active member supporting the community with moderation and engagement since 2026.',
      es: 'Hospitality Officer en un servidor de Discord verificado. Miembro activo que apoya a la comunidad con moderación y participación desde 2026.',
      it: 'Hospitality Officer in un server Discord verificato. Membro attivo che supporta la community con moderazione e coinvolgimento dal 2026.',
      fr: 'Hospitality Officer dans un serveur Discord vérifié. Membre actif qui supporte la communauté avec de la modération et de l\'engagement depuis 2026.',
      de: 'Hospitality Officer auf einem verifizierten Discord-Server. Aktives Mitglied, das die Community seit 2026 mit Moderation und Engagement unterstützt.',
      pt: 'Hospitality Officer em um servidor verificado do Discord. Membro ativo apoiando a comunidade com moderação e engajamento desde 2026.'
    },
    link: 'https://discord.gg/enginefall',
    images: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2437390/header.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2437390/a5ce42805d97b88a54847c194204c255b2497f80/ss_a5ce42805d97b88a54847c194204c255b2497f80.1920x1080.jpg?t=1779980348',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2437390/eb04caa5c8ec96f018d91a2ef58ce08698a7cd05/ss_eb04caa5c8ec96f018d91a2ef58ce08698a7cd05.1920x1080.jpg?t=1779980348',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2437390/fb478ed8b8f35e9f3c90d7da26d5039e039090c6/ss_fb478ed8b8f35e9f3c90d7da26d5039e039090c6.1920x1080.jpg?t=1779980348'
    ],
    id: 'project-enginefall',
    verified: true,
    skills: ['Discord API', 'Community Moderation', 'Onboarding Systems', 'Event Management'],
    members: '15,529',
    online: '3,907',
    serverId: '1139094495883972638',
    logo: '/projects/enginefall/enginefall_profilepicture_high_res.png',
    gameInfo: {
      en: 'Welcome aboard Shirley, a titanic train traveling through a wild, post-apocalyptic world! Shirley is a social experiment where players are confined to limited spaces, and where trust, betrayal, and rebellion are key to survival. In this PvP survival-crafting shooter, start your journey at the tail of the train and fight your way up to the locomotive to take control as the conductor, making your own rules and laws. Scavenge, craft, raid, kill, and backstab in an ecosystem with its own economy and social dynamics.',
      es: '¡Te damos la bienvenida a bordo de Shirley, un tren titánico que viaja por un mundo salvaje y postapocalíptico! Shirley es un experimento social donde los jugadores están confinados en espacios limitados, y donde la confianza, la traición y la rebelión son clave para sobrevivir. En este shooter de supervivencia, creación y PvP, comienza tu viaje en la cola del tren y ábrete paso hasta la locomotora para tomar el control como conductor, dictando tus propias reglas y leyes. Busca recursos, fabrica equipo, asalta, elimina y traiciona en un ecosistema con su propia economía y dinámica social.',
      it: 'Benvenuto a bordo di Shirley, un treno titanico che viaggia attraverso un mondo selvaggio e post-apocalittico! Shirley è un esperimento sociale in cui i giocatori sono confinati in spazi limitati, e dove fiducia, tradimento e ribellione sono fondamentali per la sopravvivenza. In questo sparatutto PvP survival-crafting, inizia il tuo viaggio dalla coda del treno e fatti strada fino alla locomotiva per assumere il controllo come capotreno, stabilendo le tue regole e leggi. Raccogli risorse, crea oggetti, assalta, uccidi e tradisci in un ecosistema con la propria economia e dinamiche sociali.',
      fr: 'Bienvenue à bord de Shirley, un train titanesque voyageant à travers un monde sauvage et post-apocalyptique ! Shirley est une expérience sociale où les joueurs sont confinés dans des espaces limités, et où la confiance, la trahison et la rébellion sont la clé de la survie. Dans ce jeu de tir PvP de survie et de craft, commencez votre voyage à la queue du train et combattez jusqu\'à la locomotive pour en prendre le contrôle en tant que conducteur, imposant vos propres règles et lois. Récupérez des ressources, fabriquez du matériel, pillez, tuez et trahissez dans un écosystème doté de sa propre économie et de sa propre dynamique sociale.',
      de: 'Willkommen an Bord von Shirley, einem titanischen Zug, der durch eine wilde, postapokalyptische Welt fährt! Shirley ist ein soziales Experiment, bei dem die Spieler auf engem Raum zusammenleben und bei dem Vertrauen, Verrat und Rebellion der Schlüssel zum Überleben sind. In diesem PvP-Survival-Crafting-Shooter beginnst du deine Reise am Ende des Zugs und kämpfst dich bis zur Lokomotive vor, um als Lokführer die Kontrolle zu übernehmen und deine eigenen Regeln und Gesetze aufzustellen. Plündere, bastle, überfalle, töte und hintergehe in einem Ökosystem mit eigener Wirtschaft und sozialer Dynamik.',
      pt: 'Bem-vindo a bordo do Shirley, um trem titânico que viaja por um mundo selvagem e pós-apocalíptico! Shirley é um experimento social onde os jogadores estão confinados a espaços limitados, e onde a confiança, a traição e a rebelião são essenciais para a sobrevivência. Neste shooter de sobrevivência, criação e PvP, comece sua jornada na cauda do trem e lute até a locomotiva para assumir o controle como condutor, criando suas próprias regras e leis. Colete recursos, crie itens, invada, mate e traia em um ecossistema com sua própria economia e dinâmica social.'
    }
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
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3978820/header.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3978820/021cd602e6708373746ad677dd0d577651b6897e/ss_021cd602e6708373746ad677dd0d577651b6897e.1920x1080.jpg?t=1778642131',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3978820/588619646fe68f5099488437d2867577a50ec620/ss_588619646fe68f5099488437d2867577a50ec620.1920x1080.jpg?t=1778642131',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3978820/29cee55c93d24971ced9477b095d4653410de4d0/ss_29cee55c93d24971ced9477b095d4653410de4d0.1920x1080.jpg?t=1778642131'
    ],
    id: 'project-roe',
    verified: true,
    skills: ['Server Architecture', 'Advanced Permissions', 'Bot Development', 'Security Protocols'],
    members: '30,000+',
    serverId: '1139094495883972638',
    logo: '/projects/rulesofengagement/f256a35a2318137d853acc40843cbb94.webp',
    gameInfo: {
      en: 'Rules of Engagement: The Grey State is an upcoming free-to-play tactical PvPvE extraction shooter developed by Grey State Studio (Tencent). Operatives known as Striders enter "The Grey State", a horror-themed dimension, to secure valuable Vertex artifacts.',
      es: 'Rules of Engagement: The Grey State es un shooter de extracción táctico PvPvE gratuito desarrollado por Grey State Studio (Tencent). Los operativos llamados Striders se adentran en "El Estado Gris", una dimensión de terror, para asegurar valiosos artefactos Vertex.',
      it: 'Rules of Engagement: The Grey State è un imminente sparatutto tattico PvPvE di estrazione gratuito sviluppato da Grey State Studio (Tencent). Gli operativi chiamati Strider entrano nel "Grey State", una dimensione horror, per recuperare manufatti Vertex.',
      fr: 'Rules of Engagement: The Grey State est un jeu de tir d\'extraction tactique PvPvE gratuit en développement par Grey State Studio (Tencent). Les Striders pénètrent dans le "Grey State", une dimension d\'horreur, pour s\'emparer de précieux artefacts Vertex.',
      de: 'Rules of Engagement: The Grey State ist ein kommender kostenloser taktischer PvPvE-Extraction-Shooter von Grey State Studio (Tencent). Als Striders dringen Spieler in die Horror-Dimension "The Grey State" ein, um Vertex-Artefakte zu bergen.',
      pt: 'Rules of Engagement: The Grey State é um futuro shooter tático de extração PvPvE gratuito desenvolvido pela Grey State Studio (Tencent). Operacionais entram no "Grey State", uma dimensão de terror, para obter artefatos Vertex valiosos.'
    }
  },
]

export const REPOSITORIES: Repository[] = [
  {
    name: 'Dagger Designer',
    description: {
      en: 'Interactive web application for designing and visualizing tactical daggers and custom layouts.',
      es: 'Aplicación web interactiva para diseñar y visualizar dagas tácticas y esquemas personalizados.',
      it: 'Applicazione web interattiva per progettare e visualizzare pugnali tattici e layout personalizzati.',
      fr: 'Application web interactive pour concevoir et visualiser des dagues tactiques et des configurations personnalisées.',
      de: 'Interaktive Web-Anwendung zum Entwerfen und Visualisieren von taktischen Dolchen und benutzerdefinierten Layouts.',
      pt: 'Aplicativo web interativo para projetar e visualizar adagas táticas e layouts personalizados.'
    },
    language: 'JavaScript',
    languageColor: '#f1e05a',
    link: 'https://dagger-designer.vercel.app/',
    id: 'repo-dagger-designer',
    skills: ['JavaScript', 'Canvas API', 'Interactive UI', 'Tactical Visualization']
  },
  {
    name: 'QR ASCII Maker',
    description: {
      en: 'A command-line tool that generates QR codes rendered in ASCII art directly inside the terminal.',
      es: 'Una herramienta de línea de comandos que genera códigos QR renderizados en arte ASCII directamente en la terminal.',
      it: 'Uno strumento da riga di comando che genera codici QR renderizzati in formato ASCII direttamente nel terminale.',
      fr: 'Un outil en ligne de commande qui génère des codes QR rendus en art ASCII directement dans le terminal.',
      de: 'Ein Befehlszeilenwerkzeug, das direkt im Terminal gerenderte QR-Codes im ASCII-Format erzeugt.',
      pt: 'Uma ferramenta de linha de comando que gera códigos QR renderizados en arte ASCII diretamente no terminal.'
    },
    language: 'Python',
    languageColor: '#3572A5',
    link: 'https://github.com/Nynele/QR-Ascii-Maker',
    id: 'repo-qr-ascii-maker',
    skills: ['Python', 'ASCII Art', 'CLI Tool', 'QR Generation']
  },
  {
    name: 'Discord Webhook Builder & Sender for Obsidian',
    description: {
      en: 'Obsidian plugin to design, test, and send Discord Webhook messages directly from your notes.',
      es: 'Plugin de Obsidian para diseñar, probar y enviar mensajes de Discord Webhook directamente desde tus notas.',
      it: 'Plugin di Obsidian per progettare, testare e inviare messaggi Webhook di Discord direttamente dalle tue note.',
      fr: 'Plugin Obsidian pour concevoir, tester et envoyer des messages Discord Webhook directement depuis vos notes.',
      de: 'Obsidian-Plugin zum Entwerfen, Testen und Senden von Discord-Webhook-Nachrichten direkt aus Ihren Notizen.',
      pt: 'Plugin do Obsidian para projetar, testar e enviar mensagens de Webhook do Discord directamente de suas notas.'
    },
    language: 'JavaScript',
    languageColor: '#f1e05a',
    link: 'https://github.com/Nynele/Discord-Webhook-builder-Sender-for-Obsidian',
    id: 'repo-discord-webhook-obsidian',
    skills: ['JavaScript', 'Obsidian API', 'Discord Webhooks', 'JSON Templates']
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
    description: {
      en: 'Responsible for welcoming and onboarding new community members, managing moderation, and fostering an active, safe, and engaging environment. Collaborated with core staff on community initiatives.',
      es: 'Responsable de la bienvenida e integración de nuevos miembros de la comunidad, gestión de moderación y fomento de un ambiente activo, seguro y participativo. Colaboré con el personal principal en iniciativas comunitarias.',
      it: 'Responsabile dell\'accoglienza e dell\'inserimento dei nuovi membri della community, della moderazione e della promozione di un ambiente attivo, sicuro e coinvolgente. Collaborato con lo staff principale per iniziative comunitarie.',
      fr: 'Responsable de l\'accueil et de l\'intégration des nouveaux membres, de la modération et du développement d\'un environnement actif, sûr et engageant. Collaboration avec l\'équipe principale sur des projets communautaires.',
      de: 'Verantwortlich für die Begrüßung und Einarbeitung neuer Community-Mitglieder, die Moderation und Förderung einer aktiven, sicheren und ansprechenden Umgebung. Zusammenarbeit mit dem Kernteam an Community-Projekten.',
      pt: 'Responsável por receber e integrar novos membros, gerenciar a moderação e promover um ambiente ativo, seguro e engajador. Colaboração com a equipe principal em iniciativas comunitárias.'
    },
    skills: ['Community Management', 'Moderation', 'Event Planning', 'Customer Support'],
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
    members: '15,529',
    online: '3,907',
    serverId: '1139094495883972638',
    logo: '/projects/enginefall/enginefall_profilepicture_high_res.png',
    images: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2437390/header.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2437390/a5ce42805d97b88a54847c194204c255b2497f80/ss_a5ce42805d97b88a54847c194204c255b2497f80.1920x1080.jpg?t=1779980348',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2437390/eb04caa5c8ec96f018d91a2ef58ce08698a7cd05/ss_eb04caa5c8ec96f018d91a2ef58ce08698a7cd05.1920x1080.jpg?t=1779980348',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2437390/fb478ed8b8f35e9f3c90d7da26d5039e039090c6/ss_fb478ed8b8f35e9f3c90d7da26d5039e039090c6.1920x1080.jpg?t=1779980348'
    ],
    gameInfo: {
      en: 'Welcome aboard Shirley, a titanic train traveling through a wild, post-apocalyptic world! Shirley is a social experiment where players are confined to limited spaces, and where trust, betrayal, and rebellion are key to survival. In this PvP survival-crafting shooter, start your journey at the tail of the train and fight your way up to the locomotive to take control as the conductor, making your own rules and laws. Scavenge, craft, raid, kill, and backstab in an ecosystem with its own economy and social dynamics.',
      es: '¡Te damos la bienvenida a bordo de Shirley, un tren titánico que viaja por un mundo salvaje y postapocalíptico! Shirley es un experimento social donde los jugadores están confinados en espacios limitados, y donde la confianza, la traición y la rebelión son clave para sobrevivir. En este shooter de supervivencia, creación y PvP, comienza tu viaje en la cola del tren y ábrete paso hasta la locomotora para tomar el control como conductor, dictando tus propias reglas y leyes. Busca recursos, fabrica equipo, asalta, elimina y traiciona en un ecosistema con su propia economía y dinámica social.',
      it: 'Benvenuto a bordo di Shirley, un treno titanico che viaggia attraverso un mondo selvaggio e post-apocalittico! Shirley è un esperimento sociale in cui i giocatori sono confinati in spazi limitati, e dove fiducia, tradimento e ribellione sono fondamentali per la sopravvivenza. In questo sparatutto PvP survival-crafting, inizia il tuo viaggio dalla coda del treno e fatti strada fino alla locomotiva per assumere il controllo come capotreno, stabilendo le tue regole e leggi. Raccogli risorse, crea oggetti, assalta, uccidi e tradisci in un ecosistema con la propria economia e dinamiche sociali.',
      fr: 'Bienvenue à bord de Shirley, un train titanesque voyageant à travers un monde sauvage et post-apocalyptique ! Shirley est une expérience sociale où les joueurs sont confinés dans des espaces limités, et où la confiance, la trahison et la rébellion sont la clé de la survie. Dans ce jeu de tir PvP de survie et de craft, commencez votre voyage à la queue du train et combattez jusqu\'à la locomotive pour en prendre le contrôle en tant que conducteur, imposant vos propres règles et lois. Récupérez des ressources, fabriquez du matériel, pillez, tuez et trahissez dans un écosystème doté de sa propre économie et de sa propre dynamique sociale.',
      de: 'Willkommen an Bord von Shirley, einem titanischen Zug, der durch eine wilde, postapokalyptische Welt fährt! Shirley ist ein soziales Experiment, bei dem die Spieler auf engem Raum zusammenleben und bei dem Vertrauen, Verrat und Rebellion der Schlüssel zum Überleben sind. In diesem PvP-Survival-Crafting-Shooter beginnst du deine Reise am Ende des Zugs und kämpfst dich bis zur Lokomotive vor, um als Lokführer die Kontrolle zu übernehmen und deine eigenen Regeln und Gesetze aufzustellen. Plündere, bastle, überfalle, töte und hintergehe in einem Ökosystem mit eigener Wirtschaft und sozialer Dynamik.',
      pt: 'Bem-vindo a bordo do Shirley, um trem titânico que viaja por um mundo selvagem e pós-apocalíptico! Shirley é um experimento social onde os jogadores estão confinados a espaços limitados, e onde a confiança, a traição e a rebelião são essenciais para a sobrevivência. Neste shooter de sobrevivência, criação e PvP, comece sua jornada na cauda do trem e lute até a locomotiva para assumir o controle como condutor, criando suas próprias regras e leis. Colete recursos, crie itens, invada, mate e traia em um ecossistema com sua própria economia e dinâmica social.'
    }
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
    description: {
      en: 'Administered daily community activity, resolved conflicts, and maintained server standards. Helped implement advanced security measures and channel organizations for a massive gaming player base.',
      es: 'Administré la actividad diaria de la comunidad, resolví conflictos y mantuve los estándares del servidor. Ayudé a implementar medidas de seguridad avanzadas y organización de canales para una base masiva de jugadores.',
      it: 'Gestito l\'attività quotidiana della community, risolto conflitti e mantenuto gli standard del server. Contribuito a implementare misure di sicurezza avanzate e organizzazione dei canali per una base enorme di giocatori.',
      fr: 'Gestion des activités quotidiennes de la communauté, résolution des conflits et maintien des standards du serveur. Contribution à la mise en place de mesures de sécurité avancées pour une base de joueurs massive.',
      de: 'Verwaltung der täglichen Aktivitäten, Konfliktlösung und Aufrechterhaltung der Serverstandards. Unterstützung bei der Einführung erweiterter Sicherheitsmaßnahmen und Kanalstrukturen für eine große Gaming-Community.',
      pt: 'Gerenciei a atividade diária, resolvi conflitos e mantive os padrões do servidor. Ajudei a implementar medidas de segurança avançadas e organização de canais para uma grande comunidade de jogadores.'
    },
    skills: ['Conflict Resolution', 'Security Design', 'Discord Moderation', 'Player Support'],
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
    members: '30,000+',
    serverId: '1139094495883972638',
    logo: '/projects/rulesofengagement/f256a35a2318137d853acc40843cbb94.webp',
    images: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3978820/header.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3978820/021cd602e6708373746ad677dd0d577651b6897e/ss_021cd602e6708373746ad677dd0d577651b6897e.1920x1080.jpg?t=1778642131',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3978820/588619646fe68f5099488437d2867577a50ec620/ss_588619646fe68f5099488437d2867577a50ec620.1920x1080.jpg?t=1778642131',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3978820/29cee55c93d24971ced9477b095d4653410de4d0/ss_29cee55c93d24971ced9477b095d4653410de4d0.1920x1080.jpg?t=1778642131'
    ],
    gameInfo: {
      en: 'Rules of Engagement: The Grey State is a tactical PvPvE extraction shooter developed by Grey State Studio (Tencent), set in a dimension of reality-warped horror.',
      es: 'Rules of Engagement: The Grey State es un shooter de extracción táctico PvPvE desarrollado por Grey State Studio (Tencent), ambientado en una dimensión de horror.',
      it: 'Rules of Engagement: The Grey State è uno sparatutto tattico PvPvE di estrazione horror in fase di sviluppo da Grey State Studio (Tencent).',
      fr: 'Rules of Engagement: The Grey State est un jeu de tir d\'extraction tactique PvPvE d\'horreur par Grey State Studio (Tencent).',
      de: 'Rules of Engagement: The Grey State ist ein taktischer PvPvE-Extraction-Shooter mit Horror-Thematik von Grey State Studio (Tencent).',
      pt: 'Rules of Engagement: The Grey State é um shooter tático de extração PvPvE de terror desenvolvido pela Grey State Studio (Tencent).'
    }
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
    description: {
      en: 'Structured and managed the official Discord server for content creator Melias. Automated content delivery, designed rules and alerts, and organized high-engagement server activities.',
      es: 'Estructuré y gestioné el servidor de Discord oficial para el creador de contenido Melias. Automaticé el envío de contenido, diseñé normativas y alertas, y organicé actividades de alta participación.',
      it: 'Strutturato e gestito il server Discord ufficiale per il content creator Melias. Automatizzato l\'invio di contenuti, progettato regole e avvisi e organizzato attività ad alto coinvolgimento.',
      fr: 'Structuration et gestion du serveur Discord officiel du créateur de contenu Melias. Automatisation de la diffusion, création des règles et des alertes, et organisation d\'activités à fort engagement.',
      de: 'Strukturierung und Verwaltung des offiziellen Discord-Servers für den Content Creator Melias. Automatisierung der Inhaltsbereitstellung, Entwurf von Regeln und Benachrichtigungen sowie Organisation von Aktivitäten.',
      pt: 'Estruturei e gerenciei o servidor oficial do Discord para o criador de conteúdo Melias. Automatizei o envio de conteúdos, criei regras e alertas, e organizei atividades de alto engajamento.'
    },
    skills: ['Community Management', 'Content Automation', 'Webhook Integration', 'Event Management'],
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
    members: '5,000+',
    logo: '/projects/melias/a6005e5b874dcce81712ffb13240030e.webp',
    images: ['/projects/melias/melias-1.png', '/projects/melias/melias-3.png']
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
    description: {
      en: 'Drove community growth and recruitment campaigns. Created structured guidelines for the moderation team and optimized the user onboarding funnel to maximize initial retention.',
      es: 'Impulsé el crecimiento de la comunidad y campañas de reclutamiento. Creé directrices estructuradas para el equipo de moderación y optimicé el embudo de bienvenida para maximizar la retención inicial.',
      it: 'Guidato la crescita della community e le campagne di reclutamento. Creato linee guida strutturate per le team di moderazione e ottimizzato il flusso di onboarding per massimizzare la fidelizzazione.',
      fr: 'Dynamisation de la croissance et campagnes de recrutement. Création de directives structurées pour la modération et optimisation du parcours d\'intégration des nouveaux membres.',
      de: 'Förderung des Community-Wachstums und Rekrutierungskampagnen. Erstellung strukturierter Richtlinien für das Moderationsteam und Optimierung der Einarbeitung zur Maximierung der Mitgliederbindung.',
      pt: 'Promovi o crescimento da comunidade e campanhas de recrutamento. Criei diretrizes estructuradas para a equipe de moderação e otimizei o fluxo de integração para maximizar a retenção inicial.'
    },
    skills: ['Growth Strategies', 'Moderator Training', 'Onboarding Optimization', 'Team Coordination'],
    start: '2025',
    end: '2025',
    link: 'https://github.com/Nynele',
    id: 'work-own',
    members: '8,000+',
    images: ['/projects/own/own-1.png']
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
    description: {
      en: 'Conceptualized and executed full visual makeovers for community servers. Designed professional assets, custom embed themes, and banner layouts that aligned with the brand identity.',
      es: 'Conceptualicé y ejecuté renovaciones visuales completas para servidores de la comunidad. Diseñé recursos gráficos profesionales, temas de embeds y banners alineados con la identidad de marca.',
      it: 'Ideato ed eseguito restyling visivi completi per server di community. Progettato risorse professionali, temi embed personalizzati e layout di banner in linea con l\'identità del brand.',
      fr: 'Conception et réalisation de refontes visuelles complètes pour des serveurs communautaires. Création d\'éléments graphiques, de thèmes d\'intégration d\'inserts et de bannières conformes à l\'identité visuelle.',
      de: 'Konzeption und Umsetzung vollständiger visueller Neugestaltungen für Community-Server. Entwurf professioneller Grafiken, benutzerdefinierter Embed-Designs und Banner passend zur Markenidentität.',
      pt: 'Conceituei e executei reformas visuais completas para servidores. Criei elementos visuais profissionais, temas de embeds e layouts de banners alinhados com a identidade de marca.'
    },
    skills: ['Graphic Design', 'Brand Identity', 'UI Layout', 'Visual Communication'],
    start: '2025',
    end: '2025',
    link: 'https://github.com/Nynele',
    id: 'work-bytemate',
    members: '2,500+',
    images: ['/projects/bytemate/bytemate-1.png', '/projects/bytemate/bytemate-2.png', '/projects/bytemate/bytemate-3.png', '/projects/bytemate/bytemate-4.png']
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
    description: {
      en: 'Configured complex Discord server infrastructure including bot verification systems, security gates, and role hierarchical permissions. Implemented anti-raid filters for protection.',
      es: 'Configuré una compleja infraestructura de servidor de Discord, incluyendo sistemas de verificación por bot, pasarelas de seguridad y permisos jerárquicos de roles. Implementé filtros anti-raid.',
      it: 'Configurato infrastrutture server complesse, inclusi sistemi di verifica bot, gate di segurança e permessi gerarchici dei ruoli. Implementato filtri anti-raid per la protezione.',
      fr: 'Configuration d\'infrastructures Discord complexes : systèmes de vérification, barrières de sécurité et gestion des permissions. Implémentation de filtres anti-raid pour la protection.',
      de: 'Konfiguration komplexer Serverinfrastrukturen, einschließlich Bot-Verifizierungssystemen, Sicherheitsbarrieren und hierarchischer Rollenberechtigungen. Implementierung von Anti-Raid-Filtern.',
      pt: 'Configurei infraestrutura complexa de servidores, incluindo verificação por bots, portões de segurança e permissões hierárquicas. Implementei filtros anti-raid para proteção.'
    },
    skills: ['Server Security', 'Verification Systems', 'Permission Hierarchies', 'Anti-Raid Filters'],
    start: '2025',
    end: '2025',
    link: 'https://github.com/Nynele',
    id: 'work-metacraft',
    members: '1,500+'
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
    description: {
      en: 'Provided user assistance and moderated general chat areas. Handled ticketing workflows for bug reporting, and collaborated with community management to support live server operations.',
      es: 'Proporcioné asistencia a usuarios y moderé áreas de chat general. Gestioné flujos de tickets para reporte de bugs y colaboré con el juego y personal en las operaciones del servidor en vivo.',
      it: 'Fornito assistenza agli utenti e moderato le chat generali. Gestito i ticket per la segnalazione di bug e collaborato con il community management per supportare le operazioni del server.',
      fr: 'Assistance aux utilisateurs et modération des salons généraux. Gestion des tickets pour le signalement de bugs et collaboration avec le community management pour les opérations du serveur.',
      de: 'Nutzerunterstützung und Moderation allgemeiner Chats. Bearbeitung von Ticket-Workflows für Fehlermeldungen und Zusammenarbeit mit dem Management bei Server-Aktivitäten.',
      pt: 'Prestei assistência a usuários e moderei canais de bate-papo geral. Gerenciei o fluxo de tickets para reporte de bugs e colaborei com o gerente de comunidade em transmissões ao vivo.'
    },
    skills: ['User Support', 'Ticketing Workflows', 'Bug Management', 'Team Collaboration'],
    start: '2023',
    end: '2025',
    link: 'https://discord.gg/8P3p3HBJ8w',
    id: 'work-dawnlands',
    verified: true,
    members: '30,000+',
    serverId: '985782517451853844',
    images: [
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2197910/header.jpg',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2197910/ss_8db1c5c05d811eee5e2243fb213c5defdec9be18.1920x1080.jpg?t=1777487292',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2197910/ss_56033e3625063258869e4398b888a2d574bae309.1920x1080.jpg?t=1777487292',
      'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2197910/ss_15736831ffa5ee2573a4855fc4d545f537022624.1920x1080.jpg?t=1777487292'
    ],
    gameInfo: {
      en: 'Dawnlands is an open-world survival crafting adventure game by Seasun Games, featuring multiplayer exploration, crafting, and building.',
      es: 'Dawnlands es un juego de exploración, supervivencia y creación en mundo abierto desarrollado por Seasun Games, con soporte cooperativo multijugador.',
      it: 'Dawnlands è un gioco d\'avventura survival-crafting open world di Seasun Games, con esplorazione multiplayer, costruzione e crafting.',
      fr: 'Dawnlands est un jeu d\'aventure open-world de survie et craft par Seasun Games, jouable en coopération multijoueur.',
      de: 'Dawnlands ist ein Open-World-Survival-Crafting-Adventure von Seasun Games mit Koop-Erkundung und Basenbau.',
      pt: 'Dawnlands é um jogo de aventura open-world de sobrevivência e criação da Seasun Games, com foco em exploração cooperativa.'
    }
  },
]

export const SOCIAL_LINKS = {
  github: 'https://github.com/Nynele',
  twitter: 'https://twitter.com/nynele',
  discord: 'https://discord.com/users/799251427839049818',
  kofi: 'https://ko-fi.com/nynele',
};

export const EMAIL = 'nyneletwitch@gmail.com'
