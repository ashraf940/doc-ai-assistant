import { gql } from '@apollo/client';

// Login mutation - get JWT token
export const LOGIN_MUTATION = gql`
  mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;

// Switch active organization
export const SWITCH_ORG_MUTATION = gql`
  mutation SwitchOrg($orgId: ID!) {
    switchActiveOrganization(orgId: $orgId) {
      ok
      activeOrg {
        id
        name
      }
    }
  }
`;

// Create new document (ADMIN only)
export const CREATE_DOCUMENT = gql`
  mutation CreateDocument($title: String!, $content: String!) {
    createDocument(title: $title, content: $content) {
      document {
        id
        title
        content
        createdAt
      }
    }
  }
`;

// Ask AI a question about document
export const ASK_AI_QUESTION = gql`
  mutation AskAI($documentId: ID!, $question: String!) {
    askDocumentAiQuestion(documentId: $documentId, question: $question) {
      conversation {
        id
        question
        answer
        createdAt
      }
    }
  }
`;

// Invite user to organization (ADMIN only)
export const INVITE_USER = gql`
  mutation InviteUser($orgId: ID!, $email: String!, $role: String!) {
    inviteUserToOrganization(orgId: $orgId, email: $email, role: $role) {
      ok
    }
  }
`;