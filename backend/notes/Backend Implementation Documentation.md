# Backend Implementation Documentation

This document provides an overview and setup instructions for the Node.js/Express backend implemented for your React frontend components.

## 1. Project Structure

The backend code is organized into the following directories and files within the `backend_code` folder:

*   `/config`: Contains configuration files.
    *   `db.js`: Handles the connection to the MongoDB database. Currently configured to use `mongodb-memory-server` for testing purposes. You might need to modify this to connect to your team's actual MongoDB instance (e.g., using an environment variable for the connection string).
*   `/models`: Defines the Mongoose schemas and models for database collections.
    *   `User.js`: Schema for user data.
    *   `Challenge.js`: Schema for challenge definitions.
    *   `ChallengeEnrollment.js`: Schema linking users to challenges and tracking their progress.
    *   `Progress.js`: Schema for individual progress entries (cardio, resistance).
*   `/routes`: Defines the API endpoints.
    *   `userRoutes.js`: Routes related to user operations (e.g., fetching profile).
    *   `challengeRoutes.js`: Routes for fetching challenge information.
    *   `challengeEnrollmentRoutes.js`: Routes for managing user enrollment in challenges.
    *   `progressRoutes.js`: Routes for adding and retrieving user progress data.
*   `/controllers`: Contains the logic for handling requests for each route.
    *   `userController.js`: Logic for user routes.
    *   `challengeController.js`: Logic for challenge routes.
    *   `challengeEnrollmentController.js`: Logic for enrollment routes.
    *   `progressController.js`: Logic for progress routes.
*   `server.js`: The main entry point for the Express application. It sets up the server, connects to the database, integrates middleware, mounts the routes, and includes basic error handling.
*   `package.json`: Lists project dependencies and scripts.
*   `seed.js`: A script to populate the database with initial test data (a user and some challenges). This is currently run automatically when `server.js` starts.

## 2. Mongoose Models

Four Mongoose models have been defined based on your frontend requirements:

*   **User:** Stores user information like name, email (unique), hashed password (placeholder - hashing needs implementation), rank, and profile image.
*   **Challenge:** Stores details about each challenge, including title, description, image, category, goal, units, and duration.
*   **ChallengeEnrollment:** A linking model connecting a `User` to a `Challenge`. It tracks the user's `status` (enrolled, completed, failed), current `progress`, `rank` (placeholder), `startDate`, and calculated `endDate`.
*   **Progress:** Stores individual progress entries logged by the user, including `userId`, `type` (cardio/resistance), `value`, `unit`, and `date`.

## 3. API Routes

The following API endpoints have been created:

*   **User Routes (`/api/users`)**
    *   `GET /profile`: Fetches the profile of the currently logged-in user (requires authentication).
*   **Challenge Routes (`/api/challenges`)**
    *   `GET /`: Fetches a list of all available challenges.
    *   `GET /:id`: Fetches details of a specific challenge by its ID.
*   **Challenge Enrollment Routes (`/api/enrollments`)**
    *   `POST /`: Enrolls the logged-in user in a specified challenge (requires authentication).
    *   `GET /my/active`: Fetches all active challenge enrollments for the logged-in user (requires authentication).
    *   `GET /:id`: Fetches details of a specific enrollment by its ID (requires authentication).
    *   `PUT /:id/progress`: Updates the progress for a specific enrollment (requires authentication).
    *   `DELETE /:id`: Unenrolls the user from a specific challenge (requires authentication).
*   **Progress Routes (`/api/progress`)**
    *   `POST /`: Adds a new progress entry (e.g., daily cardio/resistance) for the logged-in user (requires authentication).
    *   `GET /weekly`: Fetches aggregated weekly progress (cardio/resistance) for the logged-in user (requires authentication).
    *   `GET /history`: Fetches the list of all progress entries for the logged-in user (requires authentication).

**Authentication Note:** The routes currently use a placeholder `protect` middleware. You will need to replace this with your team's actual authentication mechanism (e.g., JWT verification) to properly secure the routes and identify the logged-in user (`req.user.id`). The placeholder currently uses a hardcoded user ID (`6633aabbccddeeff00112233`) for testing.

## 4. Controller Logic

Controllers implement the logic for each route, interacting with the Mongoose models to perform database operations (Create, Read, Update, Delete) and format responses. They use `express-async-handler` to simplify asynchronous error handling.

*   `userController`: Fetches user profile data.
*   `challengeController`: Fetches all or single challenges.
*   `challengeEnrollmentController`: Handles enrolling, fetching active/specific enrollments, updating progress within an enrollment, and unenrolling.
*   `progressController`: Handles adding new progress entries and aggregating weekly progress.

## 5. Setup and Running

1.  **Place Code:** Copy the contents of the `backend_code` directory into your project's backend folder.
2.  **Install Dependencies:** Navigate to the `backend_code` directory in your terminal and run `npm install`.
3.  **Database Connection:**
    *   The current `config/db.js` uses `mongodb-memory-server`. This is useful for isolated testing but might not work in all environments (see Testing Issue below).
    *   **To connect to your team's MongoDB:** Modify `config/db.js` to use `mongoose.connect()` with your actual MongoDB connection string. It's best practice to store the connection string in an environment variable (e.g., `MONGO_URI`) and access it using `process.env.MONGO_URI`.
4.  **Authentication:** Replace the placeholder `protect` middleware in each route file (`routes/*.js`) with your actual authentication logic.
5.  **Seeding (Optional):** The `seed.js` script populates the database with test data. It runs automatically on server start in the current `server.js`. You might want to remove this or make it conditional for production.
6.  **Run Server:** Start the backend server by running `node server.js` in the `backend_code` directory.

## 6. Testing Issue Encountered

During the testing phase within the sandbox environment, an error occurred when trying to start the server:

```
Error connecting to MongoDB: Instance failed to start because a library is missing or cannot be opened: "libcrypto.so.1.1"
```

This indicates that the `mongodb-memory-server` package, which was used to create a temporary in-memory database for testing, failed because a required system library (`libcrypto.so.1.1`) was not available in the execution environment.

**Recommendation:**
*   This issue might be specific to the sandbox environment. Try running the code in your local Windows environment (using WSL or Docker if necessary) or your team's deployment environment.
*   **Use a Real MongoDB Instance:** The most reliable approach for development and testing is to connect to an actual MongoDB instance. You can:
    *   Install MongoDB locally on your machine.
    *   Use Docker to run a MongoDB container.
    *   Use a cloud-based service like MongoDB Atlas (which offers a generous free tier).
    Remember to update `config/db.js` with the correct connection string for your chosen MongoDB instance.

Despite this testing hiccup, the core backend code (models, routes, controllers) has been implemented according to the requirements derived from your frontend components.
