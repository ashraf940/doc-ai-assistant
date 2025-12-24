import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_DOCUMENT } from '../graphql/mutations';
import { GET_DOCUMENTS } from '../graphql/queries';

function CreateDocumentForm({ onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [createDoc, { loading, error }] = useMutation(CREATE_DOCUMENT, {
    refetchQueries: [{ query: GET_DOCUMENTS }],
  });

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    if (!content.trim()) {
      alert('Please enter content');
      return;
    }

    try {
      await createDoc({ 
        variables: { title: title.trim(), content: content.trim() } 
      });
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to create document:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">
          Create New Document
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter document title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Content *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter document content..."
            />
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error.message}
            </div>
          )}
          
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Document'}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateDocumentForm;