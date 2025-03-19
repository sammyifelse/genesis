# 📂 CSV Task Distribution System  

## 🚀 Overview  
This is a **task management system** built using **MongoDB, Express.js, and Node.js**. It allows **user authentication with JWT**, **adding agents**, **uploading CSV files**, and **distributing tasks among agents** equally.  

---

## 📌 Features  

### ✅ User Authentication  
- Login using **email and password**.  
- JWT-based authentication for secure access.  
- On successful login, users are redirected to the **dashboard**.  
- On failure, an appropriate error message is displayed.  

### ✅ Agent Management  
- Add new agents with the following details:  
  - **Name**  
  - **Email**  
  - **Mobile Number** (with country code)  
  - **Password** (stored securely in MongoDB)  

### ✅ CSV Upload & Task Distribution  
- Users can upload a **CSV file** containing:  
  - **First Name** (Text)  
  - **Phone Number** (Numeric)  
  - **Notes** (Text)  
- **Validation for file format**: Accepts only `.csv`, `.xlsx`, and `.xls` files.  
- The system **parses** the uploaded CSV file and **distributes the tasks** among **5 agents equally**.  
- If the number of tasks is **not exactly divisible by 5**, the remaining tasks are **assigned sequentially**.  
- The **distributed task lists** are stored in **MongoDB**.  
- Each agent's assigned tasks are displayed on the frontend.  

---

## ⚙️ Tech Stack  

| **Technology** | **Purpose** |  
|--------------|------------|  
| **MongoDB** | Database for storing users, agents, and tasks |  
| **Express.js** | Backend framework for API development |  
| **Node.js** | Server-side runtime |  
| **Multer** | Middleware for handling file uploads |  
| **CSV-Parser** | Parses CSV files dynamically |  
| **JWT** | Secure authentication mechanism |  

---

