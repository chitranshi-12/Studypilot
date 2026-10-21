# StudyPilot – AI-Powered Exam Preparation Platform

StudyPilot is an AI-powered exam preparation web application that transforms PDF study materials into short notes, easy-to-understand explanations, visual diagrams, real-life examples, and interactive practice tests. Powered by the Gemini API, it helps students prepare for exams more efficiently through personalized learning and performance tracking.

## Features

### 1. Authentication
- Sign up and log in using email and password.
- Continue with Google using Firebase Authentication.
- Protected routes for authenticated users.
- Personalized user profile with name and avatar.
- Secure sign-out functionality.

### 2. PDF Upload and AI Analysis
- Upload PDF files using drag-and-drop or file selection.
- Analyze study materials using the Gemini API.
- Support for scanned PDFs through native PDF processing.
- Extract important concepts and generate study resources.
- Display loading indicators and user-friendly error messages.

### 3. AI-Generated Short Notes
- Generate concise summaries of uploaded documents.
- Organize important topics into easy-to-read cards.
- Highlight key terms and definitions.
- Provide exam-focused tips and revision points.
- Copy notes to the clipboard.
- Download notes as PDF.

### 4. Explain with Diagrams and Examples
- Generate simple explanations for difficult concepts.
- Create topic-specific visual diagrams.
- Display flow diagrams, mind maps, comparison tables, and data-based charts.
- Provide worked examples and real-life applications.
- Generate memory tricks and analogies for better understanding.
- Save generated explanations for future revision.

### 5. Interactive Test Sessions
- Create AI-generated multiple-choice questions from uploaded PDFs.
- Choose the number of questions: 5, 10, 15, or 20.
- Select Easy, Medium, or Hard difficulty.
- Answer questions one at a time with a progress bar.
- Receive instant feedback and explanations.
- View scores, motivational messages, and incorrect answers.
- Generate additional explanations for wrongly answered questions.
- Track previous attempts and test performance.

### 6. Dashboard
- Personalized dashboard with a welcome message.
- Statistics for total documents, tests taken, average score, and best score.
- Quick PDF upload access.
- Recently uploaded documents.
- Easy navigation to notes, explanations, and practice tests.

### 7. My Library
- View all uploaded study documents in one place.
- Access previously generated notes and explanations.
- Open documents and review test results.
- Delete documents when no longer needed.
- Maintain individual test score histories.

### 8. Modern and Responsive UI
- Clean, student-friendly interface.
- Indigo-to-violet gradient accents.
- Responsive layouts for desktop, tablet, and mobile.
- Sidebar navigation on desktop and mobile-friendly navigation.
- Automatic light and dark mode.
- Rounded cards, smooth transitions, and accessible controls.

## Tech Stack

| Technology | Purpose |
|---|---|
| React | Building reusable UI components |
| Tailwind CSS | Styling and responsive design |
| JavaScript | Application logic |
| Firebase Authentication | User authentication |
| Cloud Firestore | Storing user documents, notes, explanations, and test history |
| Gemini API | AI-powered PDF analysis, notes, explanations, and question generation |
| PDF Processing | Uploading and analyzing study materials |
| Vite | Development server and build tooling |

## Application Workflow

1. **Sign In:** The user creates an account or logs in securely.
2. **Upload PDF:** The user uploads notes, textbooks, or other study materials.
3. **AI Analysis:** Gemini analyzes the document and identifies important concepts.
4. **Generate Notes:** StudyPilot creates summaries, key terms, and exam tips.
5. **Understand Concepts:** The user generates diagrams, explanations, and examples.
6. **Practice Tests:** The user takes personalized MCQ tests based on the uploaded material.
7. **Track Progress:** Scores and previous attempts are saved for future revision.

## Application Modules

- **Authentication Module:** Manages login, registration, and protected routes.
- **PDF Module:** Handles PDF uploads and document processing.
- **AI Service Module:** Communicates with Gemini for all AI-powered features.
- **Notes Module:** Generates and displays structured study notes.
- **Explanation Module:** Creates diagrams, examples, and memory tricks.
- **Test Module:** Manages question generation, evaluation, and score calculation.
- **Dashboard Module:** Displays study statistics and recent activity.
- **Library Module:** Organizes documents and their associated study resources.
- **Firestore Service:** Stores and retrieves user-specific application data.

## Project Structure

```text
StudyPilot/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── MyLibrary.jsx
│   │   ├── DocumentDetails.jsx
│   │   └── TestSession.jsx
│   ├── services/
│   │   ├── firebase.js
│   │   ├── auth.js
│   │   ├── firestore.js
│   │   ├── gemini.js
│   │   └── pdf.js
│   ├── context/
│   ├── hooks/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

*Note: The structure above is a suggested organization and should be adjusted to match the actual repository.*

## Requirements

Before running the project, ensure you have:

- Node.js and npm installed.
- A Firebase project.
- Firebase Authentication enabled.
- Cloud Firestore configured.
- A Gemini API key.
- Git installed.

## Installation & Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd StudyPilot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Create a Firebase project.
3. Register a web application.
4. Enable Google sign-in and email/password authentication.
5. Create a Cloud Firestore database.
6. Configure Firestore security rules to ensure users can access only their own data.
7. Add the Firebase configuration to your environment variables.

### 4. Gemini API Configuration

1. Open [Google AI Studio](https://aistudio.google.com/).
2. Generate a Gemini API key.
3. Configure the key in the application's backend environment.
4. Use a server-side API endpoint to communicate with Gemini securely.

**Important:** Never expose a production Gemini API key in frontend code or commit secrets to GitHub. Firebase web configuration is not a substitute for authentication or Firestore security rules.

### 5. Run the Application

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal to access StudyPilot.

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Environment Variables

Create a `.env` file for local development and configure the required values.

Example frontend Firebase configuration for a Vite application:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Configure the Gemini API key separately in the server environment:

```env
GEMINI_API_KEY=your_gemini_api_key
```

The Gemini key must remain server-side. Do not prefix it with `VITE_`, as Vite exposes variables with that prefix to frontend code.

## Firestore Security Rules

Use Firebase Authentication to restrict access to user-owned documents. For example, if documents are stored under `users/{userId}/documents/{documentId}`, the rules can enforce ownership:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/documents/{documentId} {
      allow read, write:
        if request.auth != null
        && request.auth.uid == userId;
    }
  }
}
```

Adapt these rules to the actual Firestore schema, including any user profile and test-history collections. Test the rules using the Firebase Emulator Suite before deploying.

## Future Enhancements

- AI-generated flashcards.
- Spaced-repetition revision plans.
- Personalized study schedules.
- Subject-wise learning analytics.
- Timed mock examinations.
- Exportable revision packs.
- Multi-language explanations.

## Project Goal

StudyPilot aims to make exam preparation smarter, simpler, and more accessible by turning lengthy study materials into structured notes, visual explanations, and personalized practice tests—all within one platform.
