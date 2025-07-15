import { useState, useEffect } from 'react';

interface LogoConfig {
  src: string;
  alt: string;
  fallbackText: string;
}

export const useLogo = (defaultLogo?: LogoConfig) => {
  const [logoError, setLogoError] = useState(false);
  const [currentLogo, setCurrentLogo] = useState<LogoConfig>(
    defaultLogo || {
      src: '/docs/noBgWhite.png',
      alt: 'Braden Group Logo',
      fallbackText: 'braden',
    }
  );

  const handleLogoError = () => {
    setLogoError(true);
    console.warn('Logo failed to load:', currentLogo.src);
  };

  const updateLogo = (newLogo: LogoConfig) => {
    setCurrentLogo(newLogo);
    setLogoError(false);
  };

  return {
    logoError,
    currentLogo,
    handleLogoError,
    updateLogo,
  };
};
