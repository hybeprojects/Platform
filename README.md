# HYBE Celebrity Connect

This is a premium real-time messaging application for BTS fans to communicate with BTS members.

## Project Structure

This is a monorepo containing a Node.js backend and a Flutter frontend.

-   `server/`: The Node.js backend, built with Express.js and Socket.IO.
-   `mobile/`: The Flutter frontend for mobile and web.

## Tech Stack

-   **Backend**: Node.js, Express.js, Socket.IO, PostgreSQL, Redis
-   **Frontend**: Flutter

## Prerequisites

-   [Docker](https://docs.docker.com/get-docker/)
-   [Flutter SDK](https://flutter.dev/docs/get-started/install)
-   [Node.js](https://nodejs.org/en/download/)

## Getting Started

### 1. Set Up Environment Variables

In the `server/` directory, copy the `.env.example` file to a new file named `.env`.

```bash
cp server/.env.example server/.env
```

Update the `.env` file with your specific configurations, such as your email credentials for sending OTPs and your desired database credentials. **The database credentials in `.env` must match the `POSTGRES_USER` and `POSTGRES_PASSWORD` in the `docker-compose.yml` file.**

### 2. Start Services with Docker Compose

The PostgreSQL and Redis services are managed with Docker Compose. To start them, run the following command from the root directory:

```bash
sudo docker compose up -d
```

### 3. Initialize the Database

The first time you start the services, you need to create the database schema. The `init.sql` script defines the tables.

Run the following command to execute the script:

```bash
psql -h localhost -p 5432 -U your-db-user -d hybe_celebrity_connect -f server/init.sql
```

**Note:** Replace `your-db-user` with the `POSTGRES_USER` you set in your `.env` and `docker-compose.yml` files. You will be prompted for the password.

### 4. Install Dependencies

-   **Backend:**
    ```bash
    cd server
    npm install
    ```
-   **Frontend:**
    ```bash
    cd mobile
    flutter pub get
    ```

### 5. Seed the Database

The database can be seeded with initial data for the BTS members and referral codes.

From the `server/` directory, run:

```bash
npm run seed:referral-codes
npm run seed
```

## Development

-   **Run Backend Server:** From the `server/` directory:
    ```bash
    node start.js
    ```

-   **Run Frontend App (Web):** From the `mobile/` directory:
    ```bash
    flutter run -d web-server
    ```

The backend server will be running on `http://localhost:3000`, and the Flutter web app will be available on the port specified in the `flutter run` output.
