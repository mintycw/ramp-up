# Forked Meer of Minder - Social Media Platform
This project is part of an 8-week introductory block at the University of Applied Sciences Utrecht, designed to bring all students up to speed. Our team developed Meer of Minder, a social media platform inspired by popular sites like X (formerly Twitter) and Reddit. The app’s name, meaning “Less or More” in Dutch, reflects our goal of a minimalist yet functional design.

This repository is a fork created by - [Michael](https://github.com/mintycw) for adding finishing touches and further development. The original repository can be found [here](https://github.com/TamiELB/Rampup-Public).

## Table of Contents
[Overview](#overview)

[Duration](#duration)

[Team](#team)

[Development Workflow](#development-workflow)

[Tech Stack](#tech-stack)

[Features](#features)

[Technical Highlights](#technical-highlights)

[Demo](#demo)

[Local Installation Guide](#local-installation-guide)

## Overview

Meer of Minder is a social media platform built for users to create posts, engage in discussions through comments and replies, and interact with posts by liking and categorizing them. The app supports user authentication, with roles and permissions to manage access, and has a responsive design.

## Duration
The project had a duration of **8 weeks**, during which we followed an iterative development process to ensure continuous progress and improvement.

## Team
The development team for this project consisted of four members:
- [Daan de Haan](https://github.com/DaandeHaan)
- [Tami El Bouazzati](https://github.com/TamiELB)
- [Michael Zhang](https://github.com/mintycw)
- [Thijs Herman](https://github.com/Turbootzz)

## Development Workflow
We followed agile principles using **Scrum** methodology, breaking down tasks into small, manageable features. Development was tracked and managed using the following tools:
- **GitHub**: For version control using branches, pull requests (PRs), and commits.
- **GitHub Project Board**: To track tasks and progress.
- **Scrum Sprints**: Organized development into sprints, focusing on delivering features in iterative cycles.

## Tech Stack
This project utilized the following technologies:
- **Frontend**:
  - ReactJS
  - Tailwind CSS for responsive UI
  - Redux
- **Backend**:
  - NodeJS with ExpressJS.
  - Sequelize ORM for database management and querying.
- **Database**:
  - MySQL was used during the development
- **Authentication**:
  - JWT-based for secure login and session handling.

## Features
The platform includes the following core features:
- **Creating posts**: Users can write and publish posts.
- **Commenting**: Users can comment on posts to engage in discussions.
- **Replying**: Comments can have replies, enabling nested discussions.
- **Liking posts**: Users can like posts to show appreciation.
- **Post categorization**: Posts can be tagged into different categories for better discoverability.
- **Following users**: Users can follow each other to stay updated on their posts.
- **Verified users**: Special user verification to highlight trusted accounts.
- **Role-based permissions**: Admin, write, and read permissions ensure proper access control.
- **Profile management**: Users can edit and customize their profiles.

## Technical Highlights
Some of the key technical features and best practices followed in this project:
- **Sequelize ORM**: Simplified database interaction and ensured efficient querying with models.
- **JWT Authentication**: Secured authentication using JSON Web Tokens for user login sessions.
- **Permission-based Access Control**: Managed user roles to restrict access to certain actions based on permissions.
- **Password Hashing**: Enhanced security by storing hashed passwords.
- **Responsive Design**: Used Tailwind CSS to ensure the platform is fully responsive across devices.
- **Git Workflow**: Proper use of branches and pull requests for feature development, with code reviews ensuring quality.

## Demo
You can view a demo of the platform at (https://momd.turboot.com). The site allows you to browse and explore the content, but for security reasons, write permissions such as creating posts and commenting are restricted to prevent misuse.

## Local Installation Guide

Before you begin, ensure you have the following installed on your machine:

- Node.js (v14.x or later)
- npm (Node package manager, included with Node.js)
- MySQL

### Setup

1. **Download the codebase from the repository.**
2. **Extract the files** to your desired location.
3. **Run the following commands** in both the `/Server` and `/Client` directories:
```bash
npm install
```

4. **Copy the** `.env.example` **file** located in the `/Server` directory and rename it to `.env`.
5. **Fill in the following fields** in the `.env` file:
```env
NODE_ENV=development
LOCAL_USER=<database_user_name>
LOCAL_PASS=<database_password>
LOCAL_NAME=<database_name> # This will be created in the next step
LOCAL_HOST=127.0.0.1
HOST= # NOT NEEDED
USER= # NOT NEEDED
PASS= # NOT NEEDED
JWT_KEY=<random_generated_string>
```

### Database Setup
1. **Log in to your MySQL database:**
```bash
mysql -u root -p
```

2. **Create a new database:**
```bash
CREATE DATABASE <database_name>
```

3. **Update the** `.env` **file** with your database credentials and the `<database_name>` you just created.

4. **Run Sequelize Migrations** (this will generate the tables):
```bash
npx sequelize-cli db:migrate
```

5. **Run Sequelize Seeders** (this will generate default required data):
```bash
npx sequelize-cli db:seed:all
```

### Running the project
1. **In the** `/Server` **directory, execute:**
```bash
npm run dev
```

2. **In the** `/Client` **directory, execute:**
```bash
npm run start
```
