// The only hard-coded texts of the site (technical spec D-03): they are shown precisely
// when the content files cannot be loaded, so they cannot come from those files.

export const FALLBACK_LINKS = {
  linkedin: 'https://www.linkedin.com/in/harlinacero',
  cv: { en: 'assets/cv/harlin-acero-cv-en.pdf', es: 'assets/cv/harlin-acero-cv-es.pdf' },
};

export const FALLBACK_MESSAGES = {
  en: {
    title: 'Sorry, the CV could not be loaded.',
    text: 'Please try again in a moment. Meanwhile, you can find my profile here:',
    linkedin: 'LinkedIn profile',
    cv: 'Download CV (PDF)',
  },
  es: {
    title: 'Lo siento, no se pudo cargar la hoja de vida.',
    text: 'Inténtalo de nuevo en un momento. Mientras tanto, puedes ver mi perfil aquí:',
    linkedin: 'Perfil de LinkedIn',
    cv: 'Descargar CV (PDF)',
  },
};
