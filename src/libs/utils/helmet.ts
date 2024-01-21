export const getHelmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [`'self'`, 'unpkg.com'],
      styleSrc: [
        `'self'`,
        `'unsafe-inline'`,
        'cdn.jsdelivr.net',
        'fonts.googleapis.com',
        'unpkg.com',
      ],
      fontSrc: [`'self'`, 'fonts.gstatic.com', 'data:'],
      imgSrc: [`'self'`, 'data:', 'cdn.jsdelivr.net', 'validator.swagger.io'],
      scriptSrc: [
        `'self'`,
        `https: 'unsafe-inline'`,
        `cdn.jsdelivr.net`,
        `'unsafe-eval'`,
      ],
    },
  },
};
