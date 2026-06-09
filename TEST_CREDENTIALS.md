# AI Chatbot Builder - Test Credentials

This document contains the default credentials for testing and development purposes.

> [!WARNING]
> These credentials are for local development and staging environments only. Do not use these in a production deployment.

---

## 👤 Standard Test User
This account is used to test the standard user flows, including chatbot creation, training, customization, and chat integration.

* **Email:** `test@example.com`
* **Password:** `Test1234`
* **Role:** `user`

---

## 🔑 Administrator Account
This account has elevated privileges to access the Admin Panel, manage users, and view platform-wide analytics.

* **Email:** `admin@conversio.ai`
* **Password:** `Admin@123`
* **Role:** `admin`

---

## 🛠️ Management & CLI Commands

### Elevating an Existing User to Admin
If you need to grant admin access to any other user registered in the system, run the following command from the `backend` directory:
```bash
node make-admin.js <email>
```

### Listing All System Administrators
To view all accounts that currently have admin privileges:
```bash
node list-admins.js
```

### Creating the Default Test User
If the default test user (`test@example.com`) is deleted or needs to be re-initialized in the database, run:
```bash
node tests/create-test-user.js
```
