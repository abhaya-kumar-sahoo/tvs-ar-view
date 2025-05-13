import { useState, useEffect } from 'react';

export default function useOrientation() {
  const [isPortrait, setIsPortrait] = useState(
    window.matchMedia('(orientation: portrait)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(orientation: portrait)');
    const handleOrientationChange = (e: MediaQueryListEvent) => {
      setIsPortrait(e.matches);
    };

    // Add listener
    mediaQuery.addEventListener('change', handleOrientationChange);

    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', handleOrientationChange);
    };
  }, []);

  return isPortrait; // true = portrait, false = landscape
}
