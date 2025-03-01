
# Emergency Management System

A real-time emergency management web application with MongoDB integration and geospatial vector search capabilities.

## Features

- Interactive map showing emergency incidents
- Real-time incident reporting and tracking
- Resource allocation and management
- Analytics dashboard with data visualization
- MongoDB integration with vector search
- Geospatial queries for nearby resources and incidents

## Setup

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas account (for the database)

### Environment Variables

Create a `.env` file in the root directory with the following:

```
VITE_MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
```

Replace `<username>`, `<password>`, `<cluster>`, and `<dbname>` with your MongoDB Atlas credentials.

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Open http://localhost:5173 in your browser

## MongoDB Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. In the "Security" tab, create a new database user
4. In the "Network Access" tab, add your IP address or allow access from anywhere
5. Get your connection string from the "Connect" button on your cluster
6. Add the connection string to your `.env` file as `VITE_MONGODB_URI`

## MongoDB Vector Search

This application uses MongoDB's geospatial indexing and query capabilities to:

1. Find incidents near a specific location
2. Identify available resources closest to an emergency
3. Optimize resource allocation based on proximity

The application automatically creates 2dsphere indexes on the relevant fields when it first connects to the database.

## Data Model

The application uses two main collections:

1. `incidents` - Stores emergency incidents with location data
2. `resources` - Stores emergency resources with location and availability status

## Usage

The application will automatically sync data between the frontend and MongoDB. If MongoDB is not available, it will fall back to using in-memory data.

When you first run the application with a new MongoDB database, it will seed the database with sample data.
