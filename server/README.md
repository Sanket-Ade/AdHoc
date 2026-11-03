# AdHoc Creative Production Platform - Express.js & MySQL Backend

Dedicated backend REST API server built with **Express.js**, **MySQL 8.0**, **JWT authentication**, and **bcrypt**.

---

## 🚀 Quick Setup Instructions

### Step 1: Set your MySQL root password
Open [server/.env](file:///D:/BTECH%20SEM3/SEM%205/Capstone/ADHOC%20updated/AdHoc-main/server/.env) and set `DB_PASSWORD` to your local MySQL password:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_actual_mysql_password
DB_NAME=adhoc_db
```

### Step 2: Initialize Database Tables
From the project root:
```bash
npm run server:init
```
*(Or inside `server/`: `npm run db:init`)*

This connects to MySQL, creates the `adhoc_db` database if not present, and creates all relational tables (`users`, `production_houses`, `services`, `portfolio_items`, `verification_documents`, `enquiries`, `enquiry_messages`, `saved_houses`).

### Step 3: Seed Initial Data
From the project root:
```bash
npm run server:seed
```
*(Or inside `server/`: `npm run db:seed`)*

This populates the database with:
- **4 demo accounts** (passwords for all: `password123`)
- **9 production houses & studios**
- All services, portfolio reels, and GST verification records
- Initial enquiries and chat message history

### Step 4: Run the Backend Server
From the project root:
```bash
npm run server
```
Server runs on: **`http://localhost:5000`**
Health check: **`http://localhost:5000/api/health`**

---

## 🔑 Demo Test Accounts

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Customer** | `sarah@aurorabev.in` | `password123` | Brand Lead at Aurora Beverages |
| **Customer 2** | `vikram@finscale.io` | `password123` | VP Marketing at FinScale |
| **Studio Owner** | `production@studiobombayfilms.in` | `password123` | Executive Producer at Studio Bombay Films |
| **Freelancer** | `aman.freelance@adhoc.in` | `password123` | Aman Deshmukh Cinematography |

---

## 📡 API Endpoints Reference

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register customer or production house account | No |
| `POST` | `/api/auth/login` | Sign in with email & password, returns JWT | No |
| `GET` | `/api/auth/me` | Fetch currently authenticated user | Yes (`Bearer <token>`) |
| `PATCH` | `/api/auth/profile` | Update profile fields (name, bio, location) | Yes (`Bearer <token>`) |

### 2. Production Houses (`/api/production-houses`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/production-houses` | Browse/filter studios (search, city, category, budget) | No |
| `GET` | `/api/production-houses/:id_or_slug` | Full studio detail (services, portfolio, verification) | No |
| `POST` | `/api/production-houses` | Register new studio profile | Yes (`Bearer <token>`) |
| `PATCH` | `/api/production-houses/:id` | Update studio profile, equipment, badges | Yes (`Bearer <token>`) |

### 3. Enquiries & Messaging (`/api/enquiries`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/enquiries` | Get enquiries for current user (customer or studio) | Yes (`Bearer <token>`) |
| `GET` | `/api/enquiries/:id` | Get specific enquiry detail with message thread | Yes (`Bearer <token>`) |
| `POST` | `/api/enquiries` | Customer submits project brief | Yes (`Bearer <token>`) |
| `PATCH` | `/api/enquiries/:id/status` | Accept/decline enquiry or update quoted amount | Yes (`Bearer <token>`) |
| `POST` | `/api/enquiries/:id/messages` | Send message in enquiry chat thread | Yes (`Bearer <token>`) |

### 4. Bookmarks (`/api/saved-houses`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/saved-houses` | List saved favorite production houses | Yes (`Bearer <token>`) |
| `POST` | `/api/saved-houses/toggle` | Bookmark or unbookmark a studio | Yes (`Bearer <token>`) |

### 5. Verification (`/api/verification`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/verification/:phId` | Get GST verification status for studio | No |
| `POST` | `/api/verification/submit` | Submit GST document & legal business info | Yes (`Bearer <token>`) |
