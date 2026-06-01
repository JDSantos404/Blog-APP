# MEVN Blog Application

A full-stack Blog Application built using the **MEVN Stack** (MongoDB, Express.js, Vue.js, and Node.js). This application provides secure user authentication, role-based authorization, and complete blog post management functionality.

---

# Project Overview

This project allows users to create and manage blog posts through a modern web application.

The application includes:

* User registration and authentication
* Password hashing using bcrypt
* JWT-based authorization
* Blog post CRUD operations
* Public viewing of blog posts
* Admin role with elevated permissions
* MongoDB database integration

---

# Tech Stack

## Backend (`server/`)

* Node.js
* Express.js
* MongoDB
* Mongoose
* bcrypt
* JSON Web Token (JWT)
* dotenv
* cors

## Frontend (`client/`)

* Vue.js
* Vue Router
* Axios
* Vite

---


# Features

## User Authentication

### Register

Users can create an account using:

* Email
* Username
* Password

### Login

Registered users can securely log in using their credentials.

### Password Security

Passwords are securely hashed before being stored in the database using bcrypt.

---

## Blog Post Management

Authenticated users can perform CRUD operations on their blog posts.

### Create Post

Users can create blog posts containing:

* Title
* Content
* Author Information
* Creation Date

### Read Posts

Users can:

* View all blog posts
* View a single blog post

### Update Post

Users can edit their own posts.

### Delete Post

Users can delete their own posts.

---

# Public Access

All users, including guests who are not logged in, can:

### View All Posts

Retrieve and browse all available blog posts.

### View Single Post

View the complete details of a selected blog post.

---

# Admin Features

Administrators have elevated permissions.

### Admin Privileges

* View all posts
* View any single post
* Delete any blog post regardless of the author

---

# User Roles and Permissions

| Feature          | Guest | User | Admin |
| ---------------- | ----- | ---- | ----- |
| View All Posts   | ✅     | ✅    | ✅     |
| View Single Post | ✅     | ✅    | ✅     |
| Create Post      | ❌     | ✅    | ✅     |
| Update Own Post  | ❌     | ✅    | ✅     |
| Delete Own Post  | ❌     | ✅    | ✅     |
| Delete Any Post  | ❌     | ❌    | ✅     |

---

# Test Accounts

The following accounts are available for testing purposes.

## Admin Account

| Field    | Value                                   |
| -------- | --------------------------------------- |
| Email    | [admin@mail.com] |
| Password | admin123                                |
| Role     | Admin                                   |

### Permissions

* View all posts
* View single posts
* Delete any post

---

## User Account

| Field    | Value                                   |
| -------- | --------------------------------------- |
| Email    | [user1@mail.com] |
| Password | password123                             |
| Role     | User                                    |

### Permissions

* Create posts
* View all posts
* View single posts
* Update own posts
* Delete own posts

---

# Blog Post Model

Each blog post contains the following fields:

| Field     | Type   | Description       |
| --------- | ------ | ----------------- |
| title     | String | Blog post title   |
| content   | String | Blog post content |
| author    | String | Author username   |
| createdAt | Date   | Date created      |

### Sample Blog Post

```json
{
  "title": "Introduction to Vue.js",
  "content": "Vue.js is a progressive JavaScript framework for building user interfaces.",
  "author": "user1",
  "createdAt": "2026-06-01T12:00:00.000Z"
}
```

---

# API Endpoints

## Authentication Routes

### Register User

```http
POST /users/register
```

Request Body

```json
{
  "email": "user@mail.com",
  "username": "user1",
  "password": "password123"
}
```

---

### Login User

```http
POST /users/login
```

Request Body

```json
{
  "email": "user@mail.com",
  "password": "password123"
}
```

---

## Blog Post Routes

### Get All Posts

```http
GET /posts
```

---

### Get Single Post

```http
GET /posts/:id
```

---

### Create Post

```http
POST /posts
```

Protected Route

Request Body

```json
{
  "title": "My First Blog",
  "content": "This is my first blog post."
}
```

---

### Update Post

```http
PUT /posts/:id
```

Protected Route

---

### Delete Post

```http
DELETE /posts/:id
```

Protected Route

* Users can delete their own posts.
* Admins can delete any post.

---

# Installation Guide

## Clone Repository

```bash
git clone <repository-url>
cd mevn-blog-app
```

---

## Backend Setup

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend server:

```bash
npm run dev
```

---

## Frontend Setup

Navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Run the Vue application:

```bash
npm run dev
```

---

# Future Enhancements

* User profile management
* Comments and replies
* Categories and tags
* Search functionality
* Pagination
* Rich text editor
* Image uploads
* Like and reaction system

---

# Learning Objectives

This project demonstrates:

* RESTful API development
* Authentication and authorization
* Password hashing with bcrypt
* JWT implementation
* MongoDB database operations
* CRUD functionality
* Vue.js frontend development
* Full-stack application architecture

---

# Author

Developed as a MEVN Stack Blog Application project.
