# MediPredict

MediPredict is an AI-powered multi-disease prediction system built with the MERN stack. It accurately detects breast cancer, lung cancer, diabetes, and heart disease using machine learning, offering users a seamless, intuitive interface for early diagnosis and smarter health decisions.

## Features

- **Disease Prediction Models**: Predicts the likelihood of breast cancer, lung cancer, diabetes, and heart disease using trained machine learning models.
- **Chatbot**: An AI-powered chatbot to assist users with queries and provide guidance.
- **User-Friendly Interface**: Built with React for a seamless and intuitive user experience.
- **MongoDB Integration**: Stores user data and prediction results securely.

## Pages

- **Home Page**: Overview of the application and its features.
- **About Page**: Information about the MediPredict system.
- **Dashboard**: Displays user-specific data and prediction history.
- **Prediction Pages**: Separate pages for each disease prediction (Breast Cancer, Lung Cancer, Diabetes, Heart Disease).

## Machine Learning Models

- **Breast Cancer Prediction**:
  - Model: `bcd_model.h5`
  - Script: `breast_cancer_prediction.py`
- **Lung Cancer Prediction**:
  - Model: `LCD.h5`
  - Script: `predict.py`
- **Diabetes Prediction**:
  - Model: `diabetes_model.pkl`
  - Script: `diabetespredict.py`
  - Scaler: `scaler.pkl`
- **Heart Disease Prediction**:
  - Model: `heart_disease.pkl`
  - Script: `heartpredict.py`
  - Persistent Model: `persistentmodel_heartdisease.py`

## Chatbot

The chatbot is implemented in `chatbot.controller.js` and provides real-time assistance to users. It is integrated with the frontend for a seamless experience.

## MongoDB Integration

The application uses MongoDB to store user data, prediction results, and other necessary information. The database connection is managed in `db/index.js`.

## How to Run the Repository

### Prerequisites

- Node.js and npm installed
- Python installed (for running ML scripts)
- MongoDB installed and running

### Backend Setup

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file (refer to `envTest.js` for required variables).
4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend server:
   ```bash
   npm run dev
   ```

### Running Machine Learning Models

1. Navigate to the respective ML model directory (e.g., `ML/Diabetes Prediction`).
2. Run the prediction script using Python:
   ```bash
   python diabetespredict.py
   ```

### Accessing the Application

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## Folder Structure

- **Backend**: Contains the server-side code, routes, controllers, and middleware.
- **Frontend**: Contains the client-side code built with React.
- **ML**: Contains machine learning models and scripts for predictions.
- **Medical Reports**: Sample reports for each disease.
- **Screenshots**: Screenshots of the application.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
