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
│   
```

## Backend Setup

1. Navigate to the backend directory:
```sh
cd backend
```

2. Activate the virtual environment, already in the repo:
- Windows:
```sh
.\venv\Scripts\activate
```
- Unix/MacOS:
```sh
source venv/bin/activate
```

4. Install dependencies (the venv has all the dependencies in it so this may not be required):
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

4. Follow the setup instructions above exactly as written

5. Verify the installation:
- Backend should show: "Running on http://localhost:8000"
- Frontend should show: "Local: http://localhost:5173"
- Open browser to http://localhost:5173
- Data table should load and display correctly
- Live mode should connect successfully

If any step fails, update the requirements.txt or package.json accordingly.

