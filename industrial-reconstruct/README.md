# Industrial Reconstruct

Industrial workflow reconstruction engine. Reconstructs SOPs and Loom scripts from legacy industrial software screenshots using Google Gemini.

## Features
- **Workflow Reconstruction**: Transforms screenshots into structured SOPs, checklists, and risk assessments.
- **Loom Script Generation**: Generates walkthrough scripts for video documentation.
- **Swiss Design**: Minimal, editorial UI focused on readability and utility.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Google Gemini API Key

### Installation

1. Navigate to the project directory:
   ```bash
   cd industrial-reconstruct
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root of the project and add your Gemini API key:
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```

### Running Locally

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Technologies
- Next.js (App Router)
- TypeScript
- Tailwind CSS (v4)
- Google Generative AI (Gemini 1.5 Flash)
- Framer Motion
