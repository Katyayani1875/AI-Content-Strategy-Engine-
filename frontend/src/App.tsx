// frontend/src/App.tsx

import { TrendDiscoveryPage } from './pages/TrendDiscoveryPage';
import './index.css'; // This makes sure our Tailwind styles are applied

function App() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <TrendDiscoveryPage />
    </main>
  );
}

export default App;