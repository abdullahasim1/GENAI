# GenAI Integration Setup Guide

## 🚀 Complete GenAI-Powered Hiring System

This system supports **multiple AI providers** for all AI-powered features:

- **Hugging Face Inference API** (recommended for “free / low-cost” usage)
- **Gemini (Google Generative AI)** (good free tier)
- **OpenAI** (optional fallback)

1. **CV Upload & Parsing** - AI extracts structured data from resumes
2. **AI Candidate Scoring** - Intelligent matching against job requirements
3. **Interview Question Generation** - Personalized questions based on candidate profile
4. **Email Automation** - AI-generated professional emails
5. **Sentiment Analysis** - Analyze candidate email replies

## 📋 Prerequisites

1. **Hugging Face API Key** (optional) - Get one from [Hugging Face Access Tokens](https://huggingface.co/settings/tokens)
2. **Gemini API Key** (recommended free) - Get one from [Google AI Studio](https://aistudio.google.com/)
3. **OpenAI API Key** (optional) - Get one from [OpenAI Platform](https://platform.openai.com/api-keys)
4. **Email Configuration** (Optional) - For sending real emails via Nodemailer

## ⚙️ Environment Setup

Create a `.env.local` file in the root directory:

```env
# --- AI Provider selection ---

# Recommend: Gemini (Google Generative AI) - free tier
GEMINI_API_KEY=your_gemini_api_key_here
# GEMINI_MODEL=gemini-1.5-flash

# Optional: Hugging Face
# HF_API_KEY=hf_your_huggingface_token_here
# HF_TEXT_MODEL=google/flan-t5-large

# Optional: OpenAI fallback
# OPENAI_API_KEY=sk-your-openai-api-key-here

# Force provider (else: HF > Gemini > OpenAI)
AI_PROVIDER=gemini

# Optional: Email Configuration (for sending real emails)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@hiregen.ai

# Node Environment
NODE_ENV=development
```

## 🔧 Configuration

### Gemini (Google Generative AI) – Recommended

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create an API key
3. Add it to `.env.local` as `GEMINI_API_KEY`
4. (Optional) set `GEMINI_MODEL` (default is `gemini-1.5-flash`)
5. Set `AI_PROVIDER=gemini` to always use Gemini

### Hugging Face Inference API

1. Create an access token in Hugging Face settings
2. Add it to `.env.local` as `HF_API_KEY`
3. (Optional) set `AI_PROVIDER=hf` to always use Hugging Face
4. (Optional) set `HF_TEXT_MODEL` (default is `google/flan-t5-large`)

### OpenAI API (Optional)

1. Sign up at [OpenAI Platform](https://platform.openai.com)
2. Create an API key
3. Add it to `.env.local` as `OPENAI_API_KEY`
4. The system uses `gpt-4o-mini` model when OpenAI is selected

### Email Setup (Optional)

For development, emails are generated but not sent. To send real emails:

1. **Gmail Setup:**
   - Enable 2-factor authentication
   - Generate an App Password
   - Use it as `EMAIL_PASS`

2. **Other SMTP Providers:**
   - Update `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` accordingly

## 🎯 Features

### 1. AI Resume Parsing

- Extracts: Name, Email, Phone, Skills, Experience, Education
- Uses GPT-4o-mini for intelligent extraction
- Supports PDF and text files

### 2. AI Candidate Scoring

- Compares candidate skills vs job requirements
- Provides match score (0-100)
- Identifies strengths and missing skills
- AI reasoning for the score

### 3. Interview Question Generation

- 5 Technical questions
- 3 Behavioral questions
- 2 Scenario-based questions
- Personalized based on candidate profile

### 4. Email Automation

- AI-generated professional emails
- Three types: Invite, Rejection, Follow-up
- Sent via Nodemailer (if configured)

### 5. Sentiment Analysis

- Analyzes candidate email replies
- Detects: Sentiment, Urgency, Tone
- Provides action recommendations

## 📝 Usage

### Start the Development Server

```bash
npm run dev
```

### API Endpoints

All AI features are integrated into existing endpoints:

- `POST /api/candidates/upload` - Upload CV, AI parses it
- `POST /api/candidates/score` - AI scores candidate
- `POST /api/questions/generate` - AI generates questions
- `POST /api/email/send` - AI generates and sends email
- `POST /api/email/analyze` - AI analyzes email sentiment

## 🔒 Fallback Behavior

If OpenAI API is not configured or fails:

- System falls back to basic algorithms
- All features still work (with reduced intelligence)
- Error messages guide users to configure API key

## 💰 Cost Considerations

- Uses `gpt-4o-mini` (cost-effective model)
- Typical costs: ~$0.01-0.05 per resume processed
- Interview questions: ~$0.02 per generation
- Email generation: ~$0.01 per email

## 🐛 Troubleshooting

### "Failed to parse resume with AI"

- Check OpenAI API key is set correctly
- Verify API key has credits
- Check network connectivity

### "Email not sent"

- In development, emails are generated but not sent
- Configure SMTP settings for production
- Check email logs in console

### PDF Parsing Issues

- PDF parsing requires Node.js Buffer support
- For text files, upload as `.txt`
- System handles both formats

## 📚 Next Steps

1. Set up OpenAI API key
2. Test CV upload with a sample resume
3. Create a job posting
4. Upload candidate CVs
5. View AI-generated scores
6. Generate interview questions
7. Send AI-generated emails

## 🎉 You're All Set

The system is now fully powered by GenAI. All features use intelligent AI processing while maintaining the beautiful design you created.
