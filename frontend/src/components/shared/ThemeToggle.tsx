import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl border border-paper-muted/70
        bg-paper-elevated/80 px-3.5 py-2 text-ui-sm font-medium text-ink-soft
        hover:text-ink hover:border-coral/40 transition-colors
        ${className}
      `}
    >
      <span className="text-base leading-none" aria-hidden>
        {isDark ? '☀' : '☾'}
      </span>
      <span className="hidden sm:inline">{isDark ? 'Claro' : 'Oscuro'}</span>
    </button>
  );
}
