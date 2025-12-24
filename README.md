📘 Document AI Assistant

A multi-tenant Document AI Assistant built using Django, GraphQL, React, MCP (Model Context Protocol), and an LLM.
The project focuses on backend architecture, secure GraphQL design, resolver-level permissions, and correct AI context handling.

🚀 Objective

This project was implemented as part of a technical evaluation to demonstrate:

GraphQL schema design and resolver-level authorization

Secure JWT-based authentication

Multi-tenant organization access

Correct usage of MCP (Model Context Protocol)

Secure LLM integration

Clean code structure and Git discipline

UI polish was intentionally kept minimal; correctness and architecture were prioritized.

🛠 Tech Stack
Backend

Django

Graphene (GraphQL)

PostgreSQL (SQLite for local development)

JWT Authentication

MCP (Model Context Protocol)

Frontend

React

Apollo Client

AI

OpenAI (or any LLM provider via API key)

✨ Core Features
Authentication & Authorization

JWT-based authentication

Organization-based access control

Two roles:

ADMIN

MEMBER

All permission checks are enforced inside GraphQL resolvers

No REST APIs used

Organizations

Users can belong to multiple organizations

Active organization context maintained per user

Documents

ADMIN can create and manage documents

MEMBER can read documents

Access validated per organization at resolver level

AI Question Answering

Users can ask AI questions about a document

AI responses are stored and retrievable

Previous AI conversations are visible per document

🧠 MCP (Model Context Protocol)

MCP server layer implemented inside the Django project

Document content is exposed as MCP context

When a question is asked:

Context is provided via MCP

LLM consumes context through MCP, not manual prompt concatenation

MCP logic is clearly separated from:

GraphQL resolvers

LLM execution logic

🔐 Security & Secrets

No API keys or secrets committed to Git

Secrets loaded via environment variables

.env file is ignored via .gitignore

.env.example provided with placeholders only

⚙️ Project Setup
Backend Setup
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver


GraphQL Playground:

http://127.0.0.1:8000/graphql/

Frontend Setup
cd frontend/frontend
npm install
npm start


Frontend URL:

http://localhost:3000/

🌍 Environment Variables

Create a .env file at the project root:

DJANGO_SECRET_KEY=your-secret-key
DATABASE_URL=postgres://user:password@localhost:5432/dbname
OPENAI_API_KEY=your-openai-key
