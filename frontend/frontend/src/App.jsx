import { useState, useEffect } from 'react';
import Login from './components/Login';
import OrgSelector from './components/OrgSelector';
import DocumentList from './components/DocumentList';
import CreateDocumentForm from './components/CreateDocumentForm';
import DocumentViewer from './components/DocumentViewer';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setSelectedDoc(null);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleDocumentCreated = () => {
    handleRefresh();
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">
            📄 Document AI Assistant
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <OrgSelector onOrgChange={handleRefresh} />

        {selectedDoc ? (
          <DocumentViewer 
            documentId={selectedDoc} 
            onBack={() => setSelectedDoc(null)} 
          />
        ) : (
          <DocumentList
            key={refreshKey}
            onSelectDocument={setSelectedDoc}
            onCreateNew={() => setShowCreateForm(true)}
          />
        )}

        {showCreateForm && (
          <CreateDocumentForm
            onClose={() => setShowCreateForm(false)}
            onSuccess={handleDocumentCreated}
          />
        )}
      </div>
    </div>
  );
}

export default App;