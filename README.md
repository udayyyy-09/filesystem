# AI-Powered Meeting Notes Summarizer & Sharer

#### Overview

This project is a full-stack application that allows users to:

- Upload meeting transcripts (text file).

- Provide a custom instruction (e.g., "Summarize in bullet points for executives").

- Generate AI-powered summaries using OpenAI’s free models.

- Edit the summary before finalizing.

- Share the summary via email.

##  Approach & Process

- Backend (Express.js + Node.js)

- Handles API requests.

- Routes:

  - /api/summarize → sends text & instruction to AI model and returns summary.

  - /api/share → sends edited summary via email using Nodemailer.


- Frontend (Next.js + Tailwind CSS)

  - Upload text transcript.
  
  - Input custom instruction.

  - Display AI-generated summary (editable).

  - Share via email.

  - Deployed on Vercel.

- AI Layer

  - Used Hugging Face Inference API.
    
  - Takes transcript + instruction as input.
  
  - Returns structured summary.
  
- Deployment

  - Backend → Render

  - Frontend → Vercel

### 🛠 Tech Stack

- Frontend: Next.js, React, Tailwind CSS

- Backend: Node.js, Express.js, Nodemailer

- AI: OpenAI API (free model)

- Version Control: GitHub

####  Working Deployed Links

- Frontend (User-facing UI):  https://filesystem-delta.vercel.app
