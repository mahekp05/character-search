# Product Search

A full-stack product search application for browsing and discovering products by name, brand, category, color, price, description, and tags.

## Overview

Product Search allows users to explore a searchable product database through simple keywords and filters. Instead of searching only by exact product name, users can discover products using descriptive terms, styles, colors, brands, or categories.

Examples:

* "black dress"
* "Zara"
* "summer tops"
* "under 50"
* "minimal neutral basics"

This project is being built to explore full-stack application development, database design, search systems, product discovery, and recommendation-style features.

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

## Database Model

```prisma
model Product {
  id          String @id @default(uuid())
  name        String
  brand       String?
  category    String?
  color       String?
  price       Float?
  imageUrl    String?
  description String?
  tags        String[]
}
```

## Current Features

* PostgreSQL database integration
* Prisma ORM configuration
* Product data model
* Database migrations
* Seeded product dataset
* REST API endpoint for retrieving products
* Full-stack architecture connecting frontend, backend, and database

## Project Structure

```text
product-search/
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

### Get All Products

```http
GET /api/products
```

Response:

```json
[
  {
    "id": "16ff2619-fb06-413f-aeed-5b700d076323",
    "name": "Black Mini Dress",
    "brand": "Zara",
    "category": "Dress",
    "color": "Black",
    "price": 59.99,
    "imageUrl": "https://example.com/dress.jpg",
    "description": "Simple black mini dress for casual and going-out looks.",
    "tags": ["black", "dress", "mini", "zara", "going-out"]
  }
]
```

### Search Products

```http
GET /api/products/search?q=dress
```

Response:

```json
[
  {
    "id": "16ff2619-fb06-413f-aeed-5b700d076323",
    "name": "Black Mini Dress",
    "brand": "Zara",
    "category": "Dress",
    "color": "Black",
    "price": 59.99,
    "imageUrl": "https://example.com/dress.jpg",
    "description": "Simple black mini dress for casual and going-out looks.",
    "tags": ["black", "dress", "mini", "zara", "going-out"]
  }
]
```

## Planned Features

* Keyword-based product search
* Category filtering
* Brand filtering
* Color filtering
* Price range filtering
* Product detail pages
* Saved or favorited products
* Similar product recommendations
* Search ranking improvements
* Semantic search
* Personalized product discovery

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

Most shopping websites are built around known-item search, where users already know what they want. This project explores product discovery by allowing users to search through descriptions, tags, brands, colors, and categories, making the experience more flexible and exploratory.

The long-term goal is to turn this into a more intelligent product search and recommendation system that helps users discover fashion items based on style, preferences, budget, and context.
