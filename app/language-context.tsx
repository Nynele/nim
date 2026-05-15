'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    'hero.title': 'Discord Designer & Community Manager.',
    'hero.subtitle': 'Proven expertise in designing and scaling high-performance server infrastructure. Advanced permissions and custom bot development.',
    'section.projects': 'Selected Projects',
    'section.experience': 'Work Experience',
    'cta.title': "Let's work together.",
    'cta.subtitle': "I'm currently available for freelance work. If you have a project that you want to get started, think you need my help with something or just fancy saying hey, then get in touch.",
    'cta.button': 'Email me',
    'discord.listening': 'Listening to',
    'discord.playing': 'Playing',
    'discord.activity': 'Activity',
    'discord.chilling': 'Currently chilling...',
    'discord.message': 'Send Discord Message',
    'footer.copy': 'Nynele.',
    'time.local': 'LOCAL TIME',
    'job.present': 'Present',
    '404.title': 'Page not found',
    '404.subtitle': "The page you are looking for doesn't exist or has been moved. Don't worry, even the best designers get lost sometimes.",
    '404.button': 'Back to Home',
    'pitch.hero.title': 'Discord Designer & Community Manager.',
    'pitch.hero.subtitle': 'Proven expertise in designing and scaling high-performance server infrastructure. Advanced permissions and custom bot development.',
    'pitch.why.title': 'Why hire me?',
    'pitch.why.1': 'Expert Configuration',
    'pitch.why.1.desc': 'Advanced permissions and hierarchy setup.',
    'pitch.why.2': 'Custom Automation',
    'pitch.why.2.desc': 'Tailored bot solutions for your specific needs.',
    'pitch.why.3': 'Community Growth',
    'pitch.why.3.desc': 'Proven strategies to increase engagement and retention.',
    'pitch.cta': 'Ready to scale?',
    'pitch.results.title': 'The Results',
    'pitch.results.subtitle': "I don't just build servers; I build ecosystems. Here is what my architecture looks like under the hood.",
    'pitch.final.title': "Let's build something great.",
    'pitch.final.subtitle': 'Available for new partnerships and consultations.',
    'pitch.final.button': 'Get Started via Discord',
    'pitch.example.bot.name': 'Community Hub',
    'pitch.example.bot.msg': 'Poll created by Nynele 🤫',
    'pitch.example.bot.embed.title': 'Question',
    'pitch.example.bot.embed.desc': 'Do you like this new dashboard? 💕',
    'pitch.example.bot.embed.field1': 'Choices',
    'pitch.example.bot.embed.field1.val': 'A: Yes | B: Definitely | C: Absolutely!!!',
    'pitch.example.bot.embed.field2': 'Ends',
    'pitch.example.bot.embed.field2.val': 'In 1 day',
    'pitch.stats.servers': 'Servers Optimized',
    'pitch.stats.members': 'Members Managed',
    'pitch.stats.experience': 'Years Experience',
    'pitch.commands.title': 'Interactive Commands',
    'pitch.commands.hire.desc': 'Open a ticket to discuss your project.',
    'pitch.commands.info.desc': 'View my services and pricing.',
    'pitch.commands.portfolio.desc': 'Browse my latest Discord setups.',
    'pitch.feature.mod.title': 'Advanced Moderation',
    'pitch.feature.mod.desc': 'Keep your community safe with multi-user bans, kicks, and advanced logging. Automate protection against raids and spam without breaking a sweat.',
    'pitch.feature.notifications.title': 'Real-time Notifications',
    'pitch.feature.notifications.desc': 'Keep your users informed with automated YouTube, Twitch, and Social Media alerts directly in your channels.',
    'pitch.feature.embeds.title': 'Beautiful Embeds',
    'pitch.feature.embeds.desc': 'Professional documentation and rule sets designed with high-impact visuals and intuitive structure.',
    'pitch.feature.custom.title': 'Total Customization',
    'pitch.feature.custom.desc': 'Every bot I design is unique. From branding to specific logic, I build features that fit your community like a glove.',
    // Sledge Example
    'pitch.example.mod.title': '[ALERT] Anti-Scam Detection',
    'pitch.example.mod.desc': 'A suspicious message was detected and removed.',
    'pitch.example.mod.field.overview': 'Moderation Overview',
    'pitch.example.mod.field.user': 'User',
    'pitch.example.mod.field.channel': 'Channel',
    'pitch.example.mod.field.incident': 'Incident',
    'pitch.example.mod.btn.ban': 'Ban',
    'pitch.example.mod.btn.history': 'History',
    'pitch.example.mod.btn.dismiss': 'Dismiss',
    'pitch.example.mod.btn.evidence': 'Evidence',
    // MeliasBot Example
    'pitch.example.notif.msg': '📹 Melias just started a live stream on Twitch!\nhttps://twitch.tv/meliasoficial\n@Mention - Directos',
    'pitch.example.notif.embed.title': 'Twitch',
    'pitch.example.notif.embed.desc': 'meliasoficial - Twitch',
    // Normativas Example
    'pitch.example.rules.desc': '🔨 **Compliance with the rules is mandatory.**\n\nThis server is governed by the **Terms of Service** and **Community Guidelines** of Discord.\n\n`The rules are mandatory to ensure a peaceful and respectful stay. Ignorance of them does not exempt you from them.`',
    'pitch.example.rules.f1': '🔴 Behavior',
    'pitch.example.rules.f1.v': 'Treat users with respect. Discrimination or harassment is not allowed.',
    'pitch.example.rules.f2': '🔴 Chat usage',
    'pitch.example.rules.f2.v': 'Avoid repetitive messages, chains or promotions.',
    'pitch.example.rules.f3': '🔴 Appropriate content',
    'pitch.example.rules.f3.v': 'NSFW or similar content is not allowed.',
    'pitch.example.rules.f4': '🔴 Channel usage',
    'pitch.example.rules.f4.v': 'Use each channel for what it was created for.',
    'pitch.example.rules.f5': '🔴 Privacy',
    'pitch.example.rules.f5.v': 'Do not share personal information of any kind.',
    'pitch.example.rules.f6': '🔴 Moderation',
    'pitch.example.rules.f6.v': 'Do not question the decisions of the staff.',
    'pitch.example.rules.footer': 'In case of doubts, visit the server info, or contact the staff.',
    'pitch.example.rules.btn1': 'Review rules',
    'pitch.example.rules.btn2': 'View info',
    // Customization Examples
    'pitch.example.custom.bio1': 'The most complete bot for Melias community. Developed by Nynele Studio.',
    'pitch.example.custom.bio2': 'Advanced security and tactical moderation for professional servers.',
    'pitch.example.custom.status': '🛡️ Protecting your server',
  },
  es: {
    'hero.title': 'Diseñador de Discord y Community Manager.',
    'hero.subtitle': 'Experiencia demostrada en el diseño y escalado de infraestructura de servidores de alto rendimiento. Permisos avanzados y desarrollo de bots personalizados.',
    'section.projects': 'Proyectos Seleccionados',
    'section.experience': 'Experiencia Laboral',
    'cta.title': 'Trabajemos juntos.',
    'cta.subtitle': 'Actualmente estoy disponible para trabajos freelance. Si tienes un proyecto que quieras empezar, crees que necesitas mi ayuda o simplemente quieres saludar, ponte en contacto.',
    'cta.button': 'Enviame un email',
    'discord.listening': 'Escuchando',
    'discord.playing': 'Jugando a',
    'discord.activity': 'Actividad',
    'discord.chilling': 'Relajándose...',
    'discord.message': 'Enviar mensaje por Discord',
    'footer.copy': 'Nynele.',
    'time.local': 'HORA LOCAL',
    'job.present': 'Presente',
    '404.title': 'Página no encontrada',
    '404.subtitle': 'La página que buscas no existe o ha sido movida. No te preocupes, hasta los mejores diseñadores se pierden a veces.',
    '404.button': 'Volver al Inicio',
    'pitch.hero.title': 'Diseñador de Discord y Community Manager.',
    'pitch.hero.subtitle': 'Experiencia demostrada en el diseño y escalado de infraestructura de servidores de alto rendimiento. Permisos avanzados y desarrollo de bots personalizados.',
    'pitch.why.title': '¿Por qué contratarme?',
    'pitch.why.1': 'Configuración Experta',
    'pitch.why.1.desc': 'Configuración avanzada de permisos y jerarquías.',
    'pitch.why.2': 'Automatización a Medida',
    'pitch.why.2.desc': 'Soluciones de bots personalizadas para tus necesidades.',
    'pitch.why.3': 'Crecimiento de Comunidad',
    'pitch.why.3.desc': 'Estrategias probadas para aumentar la participación y retención.',
    'pitch.cta': '¿Listo para escalar?',
    'pitch.results.title': 'Los Resultados',
    'pitch.results.subtitle': 'No solo construyo servidores; construyo ecosistemas. Así es como se ve mi arquitectura por dentro.',
    'pitch.final.title': 'Construyamos algo grande.',
    'pitch.final.subtitle': 'Disponible para nuevas colaboraciones y consultorías.',
    'pitch.final.button': 'Empezar vía Discord',
    'pitch.example.bot.name': 'Centro de Comunidad',
    'pitch.example.bot.msg': 'Encuesta creada por Nynele 🤫',
    'pitch.example.bot.embed.title': 'Pregunta',
    'pitch.example.bot.embed.desc': '¿Te gusta este nuevo panel? 💕',
    'pitch.example.bot.embed.field1': 'Opciones',
    'pitch.example.bot.embed.field1.val': 'A: Sí | B: Definitivamente | C: ¡Absolutamente!',
    'pitch.example.bot.embed.field2': 'Termina',
    'pitch.example.bot.embed.field2.val': 'En 1 día',
    'pitch.stats.servers': 'Servidores Optimizados',
    'pitch.stats.members': 'Miembros Gestionados',
    'pitch.stats.experience': 'Años de Experiencia',
    'pitch.commands.title': 'Comandos Interactivos',
    'pitch.commands.hire.desc': 'Abre un ticket para hablar de tu proyecto.',
    'pitch.commands.info.desc': 'Ver mis servicios y precios.',
    'pitch.commands.portfolio.desc': 'Explora mis últimos trabajos en Discord.',
    'pitch.feature.mod.title': 'Moderación Avanzada',
    'pitch.feature.mod.desc': 'Mantén tu comunidad segura con baneos múltiples, expulsiones y registros avanzados. Automatiza la protección contra raids y spam sin esfuerzo.',
    'pitch.feature.notifications.title': 'Notificaciones en Tiempo Real',
    'pitch.feature.notifications.desc': 'Mantén a tus usuarios informados con alertas automáticas de YouTube, Twitch y Redes Sociales directamente en tus canales.',
    'pitch.feature.embeds.title': 'Embeds Preciosos',
    'pitch.feature.embeds.desc': 'Documentación profesional y normativas diseñadas con visuales de alto impacto y estructura intuitiva.',
    'pitch.feature.custom.title': 'Personalización Total',
    'pitch.feature.custom.desc': 'Cada bot que diseño es único. Desde la marca hasta la lógica específica, construyo funcionalidades que se adaptan a tu comunidad como un guante.',
    // Sledge Example
    'pitch.example.mod.title': '[ALERTA] Detección de Anti-Scam',
    'pitch.example.mod.desc': 'Se ha detectado y eliminado un mensaje sospechoso.',
    'pitch.example.mod.field.overview': 'Resumen de Moderación',
    'pitch.example.mod.field.user': 'Usuario',
    'pitch.example.mod.field.channel': 'Canal',
    'pitch.example.mod.field.incident': 'Incidente',
    'pitch.example.mod.btn.ban': 'Banear',
    'pitch.example.mod.btn.history': 'Historial',
    'pitch.example.mod.btn.dismiss': 'Descartar',
    'pitch.example.mod.btn.evidence': 'Evidencia',
    // MeliasBot Example
    'pitch.example.notif.msg': '📹 ¡Melias acaba de hacer empezar directo en Twitch!\nhttps://twitch.tv/meliasoficial\n@Mención - Directos',
    'pitch.example.notif.embed.title': 'Twitch',
    'pitch.example.notif.embed.desc': 'meliasoficial - Twitch',
    // Normativas Example
    'pitch.example.rules.desc': '🔨 **El cumplimiento de la normativa es obligatorio.**\n\nEste servidor se rige con los **Terminos de Servicio** y **Directrices de la Comunidad** de Discord.\n\n\`Las normas son de cumplimiento obligatorio para asegurar una estancia pacifica y respetuosa. El desconocimiento de ellas no te exime de las mismas.\`',
    'pitch.example.rules.f1': '🔴 Comportamiento',
    'pitch.example.rules.f1.v': 'Trata a los usuarios con respeto. No se permite la discriminación ni acoso.',
    'pitch.example.rules.f2': '🔴 Uso de chats',
    'pitch.example.rules.f2.v': 'Evita mensajes repetitivos, cadenas o promociones.',
    'pitch.example.rules.f3': '🔴 Contenido apropiado',
    'pitch.example.rules.f3.v': 'No está permitido el contenido NSFW o similares.',
    'pitch.example.rules.f4': '🔴 Uso de canales',
    'pitch.example.rules.f4.v': 'Utiliza cada canal para lo que fue creado.',
    'pitch.example.rules.f5': '🔴 Privacidad',
    'pitch.example.rules.f5.v': 'No compartas información personal de ningún tipo.',
    'pitch.example.rules.f6': '🔴 Moderación',
    'pitch.example.rules.f6.v': 'No pongas en duda las desiciones del personal.',
    'pitch.example.rules.footer': 'En caso de dudas, visita la info del servidor, o contacta con el personal.',
    'pitch.example.rules.btn1': 'Revisar la normativa',
    'pitch.example.rules.btn2': 'Ver información',
    // Customization Examples
    'pitch.example.custom.bio1': 'El bot más completo para la comunidad de Melias. Desarrollado por Nynele Studio.',
    'pitch.example.custom.bio2': 'Seguridad avanzada y moderación táctica para servidores profesionales.',
    'pitch.example.custom.status': '🛡️ Protegiendo tu servidor',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'es')) {
      setLanguageState(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'es') {
        setLanguageState('es');
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
