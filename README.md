# Farm Project API

REST API for managing farms, crops, farm activities, goods, orders, and users.

## Features

- User registration and login with JWT authentication
- Farm CRUD operations
- Crop CRUD operations
- Farm activity CRUD operations
- Goods CRUD operations
- Order CRUD operations
- MongoDB integration with Mongoose
- Weather summary service using Open-Meteo
- Harvest date estimation service using Groq

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcrypt
- dotenv

## Project Structure

```bash
Farm-Project/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
├── server.js
├── package.json
└── .env
```

## Installation

```bash
git clone https://github.com/BaranBattal/farm-project-api.git
cd farm-project-api
npm install
```

## Environment Variables

Create a `.env` file in the root folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
SECRETKEY=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

## Run the Project

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

## API Routes

### User

- `POST /user/register`
- `POST /user/login`
- `PATCH /user/username`
- `GET /user/username`
- `DELETE /user/deleteMe`

### Farm

- `POST /farm/add`
- `PATCH /farm/id/:id`
- `GET /farm/id/:id`
- `GET /farm/all`
- `DELETE /farm/id/:id`

### Crop

- `POST /crop/add`
- `PATCH /crop/id/:id`
- `GET /crop/id/:id`
- `GET /crop/farm/:farm_id`
- `DELETE /crop/id/:id`

### Farm Activity

- `POST /farmActivity/add`
- `PATCH /farmActivity/id/:id`
- `GET /farmActivity/id/:id`
- `GET /farmActivity/farm/:farm_id`
- `DELETE /farmActivity/id/:id`

### Goods

- `POST /good/add`
- `PATCH /good/id/:id`
- `GET /good/id/:id`
- `GET /good/farmer/:farmer`
- `DELETE /good/id/:id`

### Orders

- `POST /order/add`
- `PATCH /order/id/:id`
- `GET /order/id/:id`
- `DELETE /order/id/:id`

## Authentication

Protected routes require a valid JWT token in the request headers.

Example:

```http
Authorization: Bearer your_token_here
```

## Notes

- Do not commit `.env` or `node_modules`
- Keep secrets in environment variables
- Make sure MongoDB is running or your cloud database is reachable

## Author

Baran Battal
