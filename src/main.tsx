import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.scss';
import App from './App.tsx';
import './i18n';

const Loading = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<Loading />}>
      <App />
    </Suspense>
  </StrictMode>,
)
