# Student Management System

A Node.js-based **Student Management System** using **Prisma, Express, and MySQL**.

## Features
- Add, edit, and delete student details
- Fetch student records from the database
- Uses **Prisma ORM** for database interaction
- API-based architecture using **Express.js**
- Secure authentication & authorization (if implemented)

## Prerequisites
Make sure you have the following installed:
- **Node.js** (LTS version recommended)
- **MySQL** (or any other database you are using)
- **Git** (for version control)
- **Prisma CLI** (`@prisma/cli`)

## Installation

1. **Clone the repository**  
   ```sh
   git clone https://github.com/Pallaviaa1/student-management.git
   cd student-management

2. **Install dependencies**
   npm install

3. **Set up environment variables**
   - Create a .env file in the root folder and add the following variables:
   DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/school_db"

4. **Set up the database**
   - Install MySQL and create a database: 
     CREATE DATABASE school_db;
  - Run Prisma migration:
     npx prisma migrate dev

## Start the Server
   npm start

## Project Structure
   student-management/
│── prisma/                 # Prisma ORM files
│   ├── schema.prisma       # Prisma schema definition
│   ├── migrations/         # Database migrations
│── controllers/            # API logic (studentController.js)
│── routes/                 # API routes (studentRoutes.js)
│── node_modules/           # Installed dependencies (DO NOT UPLOAD)
│── .env.example            # Sample environment variables (no credentials)
│── .gitignore              # Ignoring node_modules & sensitive files
│── package.json            # Dependencies & scripts
│── server.js               # Main entry file
│── README.md               # Project setup guide


## API Endpoints
 **Student Management APIs**

| Method | Endpoint                          | Description                           |
| ------ | --------------------------------- | ------------------------------------- |
| GET    | `/api/students?page=1&limit=10`   | Get all students (paginated)          |
| POST   | `/api/students`                   | Create a new student                  |
| GET    | `/api/students/:regNo`            | Get a student by registration number  |
| PUT    | `/api/students/:regNo`            | Update an existing student            |
| DELETE | `/api/students/:regNo`            | Soft delete a student                 |