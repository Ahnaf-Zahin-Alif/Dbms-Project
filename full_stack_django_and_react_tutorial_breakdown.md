### Introduction & Project Overview
* [00:00:00] Overview of the full-stack web application utilizing Python (Django) for the backend, JavaScript (React) for the frontend, and JWT tokens for authentication.
* [00:01:20] Demonstration of the completed application, showcasing login, user registration, and adding/deleting data (notes).
* [00:02:45] Information regarding the WSO2 Code Challenge on Choreo, allowing developers to win a Cybertruck or $100,000 by deploying an application.

### Backend Setup (Django)
* [00:04:13] Explanation of the overarching app architecture, separating the backend, frontend, and database deployment.
* [00:05:27] Creating a Python virtual environment and installing backend dependencies (like Django REST Framework and CORS headers) via a `requirements.txt` file.
* [00:08:18] Initializing the Django project and creating a dedicated API application utilizing `django-admin`.
* [00:09:29] Modifying the `settings.py` file to accept all hosts, set JWT authentication lifetimes, enable CORS headers, and integrate middleware.

### JWT Authentication & User Management
* [00:14:17] A conceptual breakdown of JSON Web Tokens (JWT), detailing the differences between short-lived access tokens and longer-lived refresh tokens.
* [00:17:46] Setting up a `UserSerializer` using Django REST Framework to securely accept user credentials and convert JSON data to Python models.
* [00:22:38] Creating a class-based `CreateAPIView` inside `views.py` to allow unregistered users to successfully create new accounts.
* [00:24:45] Configuring `urls.py` in the backend directory to link user registration views alongside predefined paths for generating and refreshing JWT tokens.

### Notes App Data Modeling
* [00:32:03] Beginning development on authenticated routing by associating app data (notes) with specific users.
* [00:36:42] Building out the `Note` model using Django's ORM, leveraging a foreign key relationship to link notes directly to their creator.
* [00:38:37] Writing a `ListCreateAPIView` to simultaneously list all notes and create new ones, ensuring users can only interact with notes they authored.
* [00:44:20] Adding a `DestroyAPIView` dedicated specifically to the deletion of existing notes from the database.
* [00:45:36] Creating a dedicated `urls.py` within the API folder to handle routing exclusively for the notes app endpoints.

### Frontend Setup (React)
* [00:50:19] Using Vite to generate a new React template and installing necessary NPM packages (`axios`, `react-router-dom`, and `jwt-decode`).
* [00:54:16] Setting up `api.js` to define Axios interceptors, seamlessly appending the JWT access token to the authorization headers of outgoing network requests.
* [00:59:02] Building a custom `ProtectedRoute` React component that acts as a wrapper to check user authorization and auto-refresh expired access tokens before rendering a view.
* [01:08:38] Stubbing out placeholder pages (Home, Login, Register, Not Found) and preparing the application for routing logic.

### Building Frontend Components
* [01:17:10] Designing a dynamic authentication form that can collect usernames and passwords to interchangeably serve both login and registration requests.
* [01:22:54] Programming the form submission handler to issue post requests, check HTTP responses, and store tokens safely in browser local storage.
* [01:31:01] Writing the logic for the `Home` page component, which runs a network request as soon as it loads to fetch all user-specific notes.
* [01:35:53] Creating custom JavaScript functions that hit the backend API to physically delete notes (`api.delete`) or create new ones (`api.post`).
* [01:43:41] Encapsulating individual note data into a reusable `Note` component, applying custom CSS styling, and linking up the delete button.

### Application Deployment (Choreo & GitHub)
* [01:51:47] Introducing deployment concepts and heading to the Choreo platform to provision a free remote PostgreSQL developer database.
* [01:56:20] Migrating the local Django database tables directly into the newly provisioned remote PostgreSQL server.
* [01:59:47] Formatting the Django backend for deployment by generating a `.gitignore` file, an `endpoints.yaml` configuration, and a `Procfile` command runner.
* [02:04:39] Initializing a Git repository, committing the full-stack codebase, and pushing it out to a public GitHub repository.
* [02:08:43] Hooking up GitHub to the Choreo dashboard and deploying the backend API service while securely managing environment variables.
* [02:14:26] Initializing the React frontend as a standalone web application component inside Choreo.
* [02:16:41] Creating a strict connection in Choreo to safely bridge the deployed frontend environment with the live backend REST API origin.