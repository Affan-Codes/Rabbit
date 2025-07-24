# 🐇 Rabbit – Full Stack E-commerce App

Rabbit is a full-stack e-commerce application built with:

- 🚀 **Frontend**: React.js + Tailwind CSS + Vite  
- 🔧 **Backend**: Node.js + Express.js + MongoDB  
- ☁️ **Deployment**: Vercel-ready setup

## Folder Structure

```
Rabbit/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   └── index.html
├── .env
├── README.md
└── package.json
```


## ⚙️ Setup Instructions

### 1. Clone the Repository

```
git clone https://github.com/Affan-Codes/rabbit.git
cd Rabbit-main
```

### 2. Install Dependencies

```
# Backend
cd backend
npm install
# Frontend
cd ../frontend
npm install
```

### 3. Environment Variables

```
# Create a .env file inside the backend/ folder:
PORT=5000
MONGODB_URI=your_mongoDB_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
💡 Use MongoDB Atlas and Cloudinary for production setups.
```

### 4. Run the App Locally

```
# Start Backend
cd backend
npm run dev
# Start Frontend
cd ../frontend
npm run dev
Visit: http://localhost:5173
```

### 🚀 Features

```
✅ User authentication (Register/Login)

🛒 Guest cart & persistent session

📦 Product management (Admin only)

👤 User management (Admin only)

🧾 Order placement & checkout flow

☁️ Image uploads via Cloudinary

⚙️ Fully responsive Tailwind UI

📦 Deployment
This app is ready to deploy on Vercel.

Vercel config files (vercel.json) are included.

Environment variables must be configured in Vercel dashboard.
```

### 🛠 Tech Stack

```
# Frontend:
React.js
Vite
Tailwind CSS
Redux Toolkit

# Backend:
Express.js
MongoDB & Mongoose
JWT Auth
Multer + Cloudinary
```
## 👨‍💻 Author
Made with ❤️ by ***Affan Khan***
