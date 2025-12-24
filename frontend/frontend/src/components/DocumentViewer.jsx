import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_DOCUMENT, GET_AI_CONVERSATIONS } from '../graphql/queries';
import { ASK_AI_QUESTION } from '../graphql/mutations';

function DocumentViewer({ documentId, onBack }) {
  const [question, setQuestion] = useState('');
  
  const { data: docData, loading: docLoading } = useQuery(GET_DOCUMENT, {
    variables: { id: documentId },
  });
  
  const { data: convData, refetch: refetchConversations } = useQuery(GET_AI_CONVERSATIONS, {
    variables: { documentId },
  });
  
  const [askAI, { loading: aiLoading }] = useMutation(ASK_AI_QUESTION);

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    try {
      await askAI({ 
        variables: { 
          documentId, 
          question: question.trim() 
        } 
      });
      
      setQuestion('');
      refetchConversations();
    } catch (err) {
      console.error('Failed to ask question:', err);
      alert('Failed to ask question: ' + err.message);
    }
  };

  if (docLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-gray-600">Loading document...</div>
      </div>
    );
  }

  const doc = docData?.document;

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2"
      >
        <span>←</span> Back to Documents
      </button>

      {/* Document Content */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{doc?.title}</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {doc?.content}
          </p>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Created: {new Date(doc?.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* AI Assistant Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          🤖 Ask AI Assistant
        </h3>
        
        {/* Question Input */}
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !aiLoading && handleAskQuestion()}
              placeholder="Ask a question about this document..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              disabled={aiLoading}
            />
            <button
              onClick={handleAskQuestion}
              disabled={aiLoading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {aiLoading ? 'Asking...' : 'Ask AI'}
            </button>
          </div>
        </div>

        {/* Conversation History */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-700 flex items-center gap-2">
            <span>💬</span> Conversation History
          </h4>
          
          {convData?.aiConversations?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No questions asked yet. Ask your first question above!
            </div>
          ) : (
            <div className="space-y-4">
              {convData?.aiConversations?.map((conv) => (
                <div 
                  key={conv.id} 
                  className="border-l-4 border-indigo-500 pl-4 py-2 bg-gray-50 rounded-r"
                >
                  {/* Question */}
                  <div className="mb-3">
                    <span className="font-medium text-gray-800">Q: </span>
                    <span className="text-gray-700">{conv.question}</span>
                  </div>
                  
                  {/* Answer */}
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <span className="font-medium text-indigo-600">A: </span>
                    <span className="text-gray-700">{conv.answer}</span>
                  </div>
                  
                  {/* Timestamp */}
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(conv.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentViewer;