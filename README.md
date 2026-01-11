# Store Rating Application

A full-stack web application that allows users to view stores, submit ratings (1-5 stars), and manage their profiles. Includes role-based access control for System Administrators, Store Owners, and Normal Users.

## 🚀 Features

* **Role-Based Access Control (RBAC):**
    * **System Admin:** Manage users, create stores, view system-wide statistics (Total Users, Stores, Ratings).
    * **Store Owner:** View their specific store's average rating and a list of customers who rated it.
    * **Normal User:** Browse stores, search/filter, submit ratings, and modify/delete their own ratings.
* **Authentication:** Secure Login/Signup with JWT. Strict password validation (8-16 chars, 1 Upper, 1 Special).
* **Dashboard:** Dynamic dashboards tailored to the logged-in user's role.
* **Sorting & Filtering:** Sort stores by rating or name. Filter users by role, name, or email.

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite, Bootstrap 5, FontAwesome, Axios, Formik + Yup.
* **Backend:** Node.js, Express.js.
* **Database:** MySQL with Sequelize ORM.
* **Security:** Bcrypt (Password Hashing), JSON Web Tokens (JWT).

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone <your-repo-url>
    cd store-rating-app
    ```

2.  **Setup Backend**
    ```bash
    cd server
    npm install
    ```
    * Create a `.env` file in the `server` folder:
        ```env
        PORT=5000
        DB_HOST=localhost
        DB_PORT=3306
        DB_USER=root
        DB_PASS=YourPassword
        DB_NAME=store_rating_db
        JWT_SECRET=your_jwt_secret_key
        ```
    * Seed the Admin User (creates tables & admin account):
        ```bash
        node seedAdmin.js
        ```
    * Start Server:
        ```bash
        npm run dev
        ```

3.  **Setup Frontend**
    ```bash
    cd ../client
    npm install
    npm run dev
    ```

## 🔑 Default Credentials

* **Admin Email:** `admin@store.com`
* **Admin Password:** `AdminPassword1!`

## 📸 Usage

1.  **Admin:** Log in to create Stores and add Store Owners.
2.  **User:** Sign up via the public link to rate stores.
3.  **Store Owner:** Log in (account must be created by Admin) to view store stats.