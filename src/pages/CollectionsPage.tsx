import { useNavigate } from 'react-router-dom';
import { mockCollections } from '../data';
import { ThematicCollections } from '../components/editorial/ThematicCollections';

export function CollectionsPage() {
  const navigate = useNavigate();

  // Real navigation: entering a collection opens the archive filtered to it.
  const handleSelectCollection = (slug: string) => {
    navigate(`/browse?collection=${encodeURIComponent(slug)}`);
  };

  return (
    <ThematicCollections
      collections={mockCollections}
      onSelectCollection={handleSelectCollection}
    />
  );
}
