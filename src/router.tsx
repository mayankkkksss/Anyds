import { createBrowserRouter } from 'react-router-dom';
import { DiscoverPage } from './pages/DiscoverPage';
import { BrowsePage } from './pages/BrowsePage';
import { CollectionsPage } from './pages/CollectionsPage';
import { SavedPage } from './pages/SavedPage';
import { AboutPage } from './pages/AboutPage';
import { ReferenceDetailPage } from './pages/ReferenceDetailPage';
import { AppLayout } from './components/layout/AppLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DiscoverPage /> },
      { path: 'browse', element: <BrowsePage /> },
      { path: 'collections', element: <CollectionsPage /> },
      { path: 'saved', element: <SavedPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'reference/:id', element: <ReferenceDetailPage /> },
    ],
  },
]);