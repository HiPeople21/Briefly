# Grokathon - Video Script Generator

A full-stack application that generates video scripts using Grok AI, integrated with a React frontend and FastAPI backend.

## Features

- **Video Script Generation**: Generate engaging video scripts on any topic using Grok AI
- **Grok Integration**: Uses xAI's Grok API via OpenAI-compatible endpoint
- **Real-time UI**: Interactive React frontend with Tailwind CSS styling
- **FastAPI Backend**: Modern async Python backend with CORS support

## Setup

### Backend Setup

1. **Install dependencies**:
```bash
cd backend
pip install -r requirements.txt
```

2. **Create `.env` file**:
```bash
cp .env.example .env
# Edit .env and add your XAI_API_KEY from https://console.x.ai/
```

3. **Run the backend**:
```bash
# Development with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or run directly
python main.py
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Install dependencies**:
```bash
cd frontend
npm install
```

2. **Run the development server**:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Usage

1. Start both backend and frontend servers
2. Open `http://localhost:5173` in your browser
3. Click "Or generate a video script with Grok" link
4. Enter a topic you want to create a video script for
5. Click "Generate" and wait for Grok to create the script
6. The generated script will appear below

## API Endpoints

### POST `/generate-script`
Generates a video script for the given topic.

**Request**:
```json
{
  "topic": "How to make sourdough bread"
}
```

**Response**:
```json
{
  "script": "Introduction...\n\nKey Point 1...\n\nConclusion..."
}
```

### GET `/health`
Health check endpoint.

**Response**:
```json
{
  "status": "ok"
}
```

## Environment Variables

- `XAI_API_KEY`: Your xAI API key (required for script generation)

## Tech Stack

**Backend**:
- FastAPI
- Uvicorn
- OpenAI Python Client (for Grok API)
- Pydantic

**Frontend**:
- React + TypeScript
- Vite
- Tailwind CSS
- Lucide Icons

## Project Structure

```
backend/
  main.py              # FastAPI application
  requirements.txt     # Python dependencies
  .env.example         # Environment variables template

frontend/
  src/
    components/        # React components
    services/          # API services
    types/             # TypeScript types
    App.tsx            # Main app component
    main.tsx           # Entry point
```

## Notes

- The backend requires a valid XAI_API_KEY to generate scripts
- CORS is configured to accept requests from `localhost:5173`
- Video scripts are generated using the `grok-beta` model
- Estimated generation time: 5-10 seconds per script
