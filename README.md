# Role-Based Access Control (RBAC) UI

A robust admin dashboard designed for efficient management of users, roles, and dynamic permissions. The dashboard ensures role-based access control (RBAC) with a secure and user-friendly interface.

---

## Table of Contents

- [Features](#features)
- [Core Requirements](#core-requirements)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Components](#components)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User Management**  
  Add, edit, delete, and manage users with role assignment and status updates.

- **Role Management**  
  Define roles, assign specific permissions, and edit them dynamically.

- **Permission Management**  
  Assign granular permissions (Read, Write, Delete) to roles, ensuring access control.

- **Mock API Simulation**  
  JSON-based database with customizable API responses to validate functionality.

---

## Core Requirements

1. **User Management**  
   - View user list with details.
   - Add, edit, or delete users.
   - Assign roles and manage user status (e.g., Active/Inactive).

2. **Role Management**  
   - Define new roles.
   - Edit roles and their permissions.

3. **Dynamic Permissions**  
   - Assign specific permissions to roles (Read, Write, Delete).
   - Display and manage permissions dynamically.

4. **Custom API Simulation** (Optional)  
   - Mock API calls for CRUD operations on users and roles.
   - Simulate server responses to validate the frontend functionality.

---

## Technologies Used

- **Frontend:** React.js with Ant Design components for the UI.
- **Backend:** JSON Server for mock APIs and data persistence.
- **Deployment:** Vercel for serverless deployment of the backend.

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/arpitboss/RBAC-UI.git
   cd rbac-ui

2. Install dependencies:

   ```bash
   npm install

3. Run the server:

   ```bash
   npm start

4. Visit ```http://localhost:3000``` to view the application.

## Project Structure

```plaintext
admin-dashboard/
├── db.json               # Mock database for users, roles, and permissions
├── server.js             # Custom JSON Server configuration with RBAC middleware
├── package.json          # Project dependencies and scripts
├── src/                  # Source code for the frontend
│   ├── components/       # React components
│   │   ├── Navbar.js          # Navigation bar for the dashboard
│   │   ├── UserManagement.js  # User management module
│   │   ├── RoleManagement.js  # Role management module
│   │   ├── PermissionManagement.js # Permission management module
│   ├── App.js            # Main app component
│   ├── index.js          # React DOM rendering
├── README.md             # Project documentation (this file)
```

## API Endpoints

### **Users**

- **GET** `/users`  
  Fetch all users.

- **POST** `/users`  
  Add a new user.

- **PUT** `/users/:id`  
  Update a user's details.

- **DELETE** `/users/:id`  
  Remove a user.

---

### **Roles**

- **GET** `/roles`  
  Fetch all roles.

- **POST** `/roles`  
  Add a new role.

- **PUT** `/roles/:id`  
  Update a role.

- **DELETE** `/roles/:id`  
  Remove a role.

---

## Components

### **Navbar.js**

A reusable navigation bar that provides links to the different sections of the dashboard (e.g., Users, Roles, Permissions).

### **UserManagement.js**

Handles all user-related CRUD operations. Provides a table view of users with functionality to:

- Add new users.
- Edit user details.
- Delete users.
- Assign roles.

### **RoleManagement.js**

Manages role-related operations. Displays roles in a tabular format with the ability to:

- Create new roles.
- Update existing roles.
- Delete roles.

### **PermissionManagement.js**

Enables administrators to:

- Define new permissions.
- View existing permissions.
- Assign permissions for specific roles.
- Ensure clear and secure permission assignment.

---

## Screenshots

<img width="959" alt="admin_login" src="https://github.com/user-attachments/assets/c91a0186-b548-4672-af72-d6e9f460d80e">

<img width="959" alt="user_dashboard" src="https://github.com/user-attachments/assets/f25aae43-3fb8-488d-8e5e-285c8b1911ca">

<img width="959" alt="role_management" src="https://github.com/user-attachments/assets/2a8a1028-d500-426e-a354-e8880c365442">

<img width="959" alt="permission_management" src="https://github.com/user-attachments/assets/389536fb-5bd5-4896-a430-b4a76afbcc55">

---

## Contributing

We welcome contributions to this project! To contribute:

1. **Fork the repository**:
    Click the "Fork" button at the top-right corner of this page to create your copy of the repository.

2. **Clone the forked repository**:
    ```bash
    git clone https://github.com/arpitboss/RBAC-UI.git
    ```

3. **Create a new branch**:
    ```bash
    git checkout -b feature/your-feature-name
    ```

4. **Make changes**:
    Add your improvements or new features.

5. **Commit your changes**:
    ```bash
    git commit -m "Add a brief description of your changes"
    ```

6. **Push to your branch**:
    ```bash
    git push origin feature/your-feature-name
    ```

7. **Submit a pull request (PR)**:
    Go to the original repository and click on "Compare & pull request" to submit your changes for review.

---

## License

MIT License

Copyright (c) 2024 Arpit Verma

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---
