import { gql } from '@apollo/client';

// Get all organizations for current user
export const GET_ORGANIZATIONS = gql`
  query GetOrganizations {
    organizations {
      id
      name
      createdAt
    }
  }
`;

// Get all documents in active organization
export const GET_DOCUMENTS = gql`
  query GetDocuments {
    documents {
      id
      title
      content
      createdAt
    }
  }
`;

// Get single document by ID
export const GET_DOCUMENT = gql`
  query GetDocument($id: ID!) {
    document(id: $id) {
      id
      title
      content
      createdAt
    }
  }
`;

// Get AI conversation history for a document
export const GET_AI_CONVERSATIONS = gql`
  query GetAIConversations($documentId: ID!) {
    aiConversations(documentId: $documentId) {
      id
      question
      answer
      createdAt
    }
  }
`;