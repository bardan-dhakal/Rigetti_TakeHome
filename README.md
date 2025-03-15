# Rigetti Take Home Project

A full-stack application with a React frontend and Flask backend for monitoring and analyzing instrument data.

## Prerequisites

- Python 3.11 or higher
- Node.js 19.x or higher
- npm 9.x or higher

## Project Structure

```
.
├── backend/          # Flask server
│   └── requirements.txt  # Python dependencies
├── frontend/        # React application
│   ├── package.json     # npm dependencies
│   └── .npmrc          # npm configuration
```

## Backend Setup

1. Navigate to the backend directory:
```sh
cd backend
```

2. Create a virtual environment:
```sh
python -m venv venv
```

3. Activate the virtual environment:
- Windows:
```sh
.\venv\Scripts\activate
```
- Unix/MacOS:
```sh
source venv/bin/activate
```

4. Install dependencies:
```sh
pip install -r requirements.txt
```

5. Start the server:
```sh
python app.py
```

The backend will run on http://localhost:8000

## Frontend Setup

1. Navigate to the frontend directory:
```sh
cd frontend
```

2. Install dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npm run dev
```

The frontend will run on http://localhost:5173

