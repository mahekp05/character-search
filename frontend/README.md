# Character Search

A full-stack search application for discovering fictional characters based on personality traits, descriptions, and keywords.

## Overview

Character Search allows users to explore characters from books, movies, television shows, and other media through a searchable database. Rather than searching only by name, users can discover characters using personality traits, behaviors, and descriptive keywords.

Examples:

* "ambitious"
* "bookish"
* "emotionally guarded"
* "optimistic leader"

The project is being built to explore full-stack application development, database design, search systems, and information retrieval.

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* Node.js
* Express
* TypeScript

### Database

* PostgreSQL
* Prisma ORM

## Current Features

* PostgreSQL database integration
* Prisma ORM configuration
* Character data model
* Database migrations
* Seeded character dataset
* REST API endpoint for retrieving characters
* Full-stack architecture connecting frontend, backend, and database

## Project Structure

```text
character-search/
├── frontend/
│   ├── app/
│   ├── components/
│   └── ...
│
├── backend/
│   ├── prisma/
│   ├── src/
│   └── ...
│
└── README.md
```

## API

### Get All Characters

```http
GET /api/characters
```

Response:

```json
[
  {
    "id": 1,
    "name": "Hermione Granger",
    "sourceTitle": "Harry Potter",
    "sourceType": "Book/Movie",
    "description": "An intelligent, ambitious, loyal overachiever who values knowledge and justice."
  }
]
```

## Planned Features

* Keyword-based character search
* Trait filtering
* Character detail pages
* Character relationships
* Advanced search ranking
* Search analytics
* Semantic search
* Character recommendations

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Database

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Seed the database:

```bash
npx ts-node prisma/seed.ts
```

## Motivation

Most search applications focus on finding known items. This project explores character discovery by allowing users to search for fictional characters through descriptive traits, personalities, and behaviors, creating a more exploratory search experience.
