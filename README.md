# AeroTranslate AI

AeroTranslate AI is a premium, high-performance language translation application designed for hackathons. It features a stunning, dynamic user interface built with React, Vite, and custom CSS, and is powered by Google's advanced Gemini AI models for highly accurate translations.

## Features
- **Premium Aesthetics**: Glassmorphism UI, animated backgrounds, and smooth interactions.
- **AI-Powered Translations**: Uses Gemini 2.5 Flash for rapid, accurate translations across 12+ languages.
- **Responsive Design**: Flawless experience on both desktop and mobile devices.
- **Quick Copy**: Easily copy translated text with a single click.

## Quick Start

### 1. Setup the Backend
Navigate to the `backend` folder and start the server:
```bash
cd backend
npm install
npm run dev
```

### 2. Setup the Frontend
Open a **new** terminal window, navigate to the `frontend` folder, and start the app:
```bash
cd frontend
npm install
npm run dev
```
```bash
cp .env.example .env
```
Open `.env` and replace `your_gemini_api_key_here` with your actual Google Gemini API Key.
*If you don't provide an API key, the app will run in "Simulation Mode" to demonstrate the UI.*

### 3. Run the Development Server
```bash
npm run dev
```

Visit the local URL provided (usually `http://localhost:5173`) to see the application!
