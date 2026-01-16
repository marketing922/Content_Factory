'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './theme-provider';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 opacity-0"
        disabled
      />
    );
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 transition-all duration-300 hover:bg-calebasse-green-500/10"
      aria-label={theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-calebasse-green-300 transition-transform duration-300 hover:rotate-90" />
      ) : (
        <Moon className="h-5 w-5 text-calebasse-green-700 transition-transform duration-300 hover:-rotate-12" />
      )}
    </Button>
  );
}
