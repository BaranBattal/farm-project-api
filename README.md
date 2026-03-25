# Farm Project API

A Node.js + Express + MongoDB REST API for managing farms, crops, farm activities, marketplace goods, orders, and users.

## Features

- User registration and login with JWT authentication
- Farm CRUD operations
- Crop CRUD operations
- Farm activity tracking
- Goods listing and management
- Order creation and updates
- MongoDB with Mongoose models

## Tech Stack

- Node.js
- Express
- MongoDB / Mongoose
- JWT
- bcrypt

## Project Structure

```text
config/
controllers/
middlewares/
models/
routes/
services/
server.js
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/BaranBattal/farm-project-api.git
cd farm-project-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables

Copy `.env.example` to `.env` and set your values:

```env
PORT=3000
MongoDB_URL=your_mongodb_connection_string
SECRETKEY=your_jwt_secret
```

### 4. Run the server

```bash
npm start
```

For local development:

```bash
npm run dev
```

## API Routes

### User
- `POST /user/register`
- `POST /user/login`
- `PATCH /user/username`
- `GET /user/all`
- `GET /user/username/:username`
- `DELETE /user/deleteMe`
- `DELETE /user/all`

### Farm
- `POST /farm/add`
- `PATCH /farm/:id`
- `GET /farm/id/:id`
- `GET /farm/username/:farmer`
- `DELETE /farm/:id`

### Crop
- `POST /crop/add`
- `PATCH /crop/:id`
- `GET /crop/id/:id`
- `GET /crop/farm/id/:farm`
- `DELETE /crop/:id`

### Farm Activity
- `POST /farmActivity/add`
- `PATCH /farmActivity/:id`
- `GET /farmActivity/id/:id`
- `GET /farmActivity/username/:farmer`
- `DELETE /farmActivity/:id`

### Goods
- `POST /goods/add`
- `PATCH /goods/:id`
- `GET /goods/id/:id`
- `GET /goods/username/:farmer`
- `GET /goods/`
- `DELETE /goods/:id`

### Orders
- `POST /order/order`
- `PATCH /order/:id`
- `GET /order/id/:id`
- `DELETE /order/id/:id`

## Notes Before Publishing

- Do **not** commit your real `.env` file.
- Do **not** commit `node_modules/`.
- If you plan to use the files in `services/`, make sure all required dependencies are added to `package.json` first.

## License

ISC
