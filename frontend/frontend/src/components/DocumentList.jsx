import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_DOCUMENTS } from '../graphql/queries';

function DocumentList({ onSelectDocument, onCreateNew }) {
  const { data, loading, error } = useQuery(GET_DOCUMENTS);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-gray-600">Loading documents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-600">Error: {error.message}</div>
        <p className="text-sm text-gray-500 mt-2">
          Make sure you have selected an organization above.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Documents</h3>
        <button
          onClick={onCreateNew}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          New Document
        </button>
      </div>

      {data?.documents?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No documents found</p>
          <button
            onClick={onCreateNew}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Create your first document
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {data?.documents?.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelectDocument(doc.id)}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
            >
              <h4 className="font-medium text-gray-800 mb-1">{doc.title}</h4>
              <p className="text-sm text-gray-500">
                Created: {new Date(doc.createdAt).toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {doc.content.substring(0, 100)}
                {doc.content.length > 100 ? '...' : ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DocumentList;