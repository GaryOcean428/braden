import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Routes } from './Routes';

function App() {
  return (
    <ThemeProvider>
      <Routes />
    </ThemeProvider>
  );
}

export default App;
