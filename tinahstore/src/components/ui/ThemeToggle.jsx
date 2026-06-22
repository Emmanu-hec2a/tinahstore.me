import Icon from '../icons/Icon.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-label="Toggle dark mode"
    >
      <Icon name={theme === 'light' ? 'moon' : 'sun'} className="icon icon-sm" />
    </button>
  );
}
