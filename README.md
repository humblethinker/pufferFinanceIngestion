# README for Ingestion Service

## Overview
The ingestion service listens for blockchain events and saves the data into the database. This service ensures that real-time data is available for the backend and frontend to consume.

## Prerequisites
- Node.js installed
- PostgreSQL database set up and accessible

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ingestion-service
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   INFURA_API_KEY=your_infura_project_id
   DATABASE_URL=your_postgresql_connection_string
   ```

## Running Locally
1. Ensure PostgreSQL is running and accessible.
2. Run the service:
   ```bash
   node blockchainListener.js
   ```
3. The service will start listening for blockchain events and store data in the database.
