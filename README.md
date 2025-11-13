# LifeLink - Blood Donor Management System

A modern web application connecting blood donors with recipients in need.

## 🚀 Features

- User authentication (Register/Login)
- Blood donor search by blood group and city
- Real-time notifications for blood requests
- User profile management
- Donor eligibility tracking
- Mobile responsive design

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (Atlas or local)
- npm or yarn

## 🛠️ Local Development Setup

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

4. Start the server:
```bash
npm start
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm start
```

## 🌐 Deployment on Render

### Option 1: Using render.yaml (Recommended)

1. Push your code to GitHub
2. Connect your repository to Render
3. Render will automatically detect `render.yaml` and create both services
4. Set environment variables in Render dashboard:
   - `MONGO_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret key
   - `FRONTEND_URL` - Your frontend URL (after deployment)

### Option 2: Manual Setup

#### Backend Deployment

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `MONGO_URI`
     - `JWT_SECRET`
     - `NODE_ENV=production`

#### Frontend Deployment

1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Environment Variables**:
     - `REACT_APP_API_URL` - Your backend URL from step 1

## 🔒 Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/lifelink
JWT_SECRET=your_secure_random_string
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.onrender.com
```

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

## 📦 Project Structure

```
BloodDonor/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── config/
│   │   └── App.js
│   └── package.json
└── render.yaml
```

## 🔧 Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

### Frontend
- React
- React Router
- Axios
- CSS3

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License

## 🤝 Support

For support, email your-email@example.com or create an issue in the repository.
