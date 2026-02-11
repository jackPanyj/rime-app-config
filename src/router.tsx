import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import DashboardPage from './pages/DashboardPage';
import GlobalPage from './pages/GlobalPage';
import SchemaPage from './pages/SchemaPage';
import SchemaEditorPage from './pages/SchemaEditorPage';
import AppearancePage from './pages/AppearancePage';
import PhrasesPage from './pages/PhrasesPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'global', element: <GlobalPage /> },
      { path: 'schema', element: <SchemaPage /> },
      { path: 'schema/:schemaId', element: <SchemaEditorPage /> },
      { path: 'appearance', element: <AppearancePage /> },
      { path: 'phrases', element: <PhrasesPage /> },
    ],
  },
]);
