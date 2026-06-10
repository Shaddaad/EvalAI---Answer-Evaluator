# EvalAI - Answer Evaluator

An intelligent answer evaluation system that uses AI and OCR technology to automatically grade student exam papers. EvalAI automates the tedious process of manual grading by extracting answers from scanned exam papers and evaluating them against a model answer key.

## 🎯 Features

- **OCR Extraction**: Convert scanned exam papers to digital text using Gemini OCR
- **Answer Key Generation**: Create answer keys from key images automatically
- **AI-Powered Evaluation**: Evaluate student answers using AI with intelligent reasoning
- **Role-Based Access**: Separate dashboards for students, teachers, and admins
- **Class & Exam Management**: Organize exams by class and subject
- **Detailed Evaluation Reports**: Get comprehensive grading reports with marks and reasoning
- **MongoDB Backend**: Secure and scalable data storage

## 🛠️ Tech Stack

- **Backend**: Flask (Python)
- **Frontend**: React + Vite (JavaScript)
- **Database**: MongoDB
- **AI/OCR**: Google Gemini API
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt

## 📋 Project Structure

```
EvalAI---Answer-Evaluator/
├── backend/
│   └── auth/
│       ├── login.py           # User authentication
│       └── auth_utils.py      # Password verification
├── database/
│   ├── db.py                  # MongoDB connection
│   ├── users.py               # User operations
│   ├── classes.py             # Class management
│   ├── exams.py               # Exam operations
│   └── utils.py               # Database utilities
├── evaluation/
│   ├── key_extractor.py       # Extract answer key from images
│   ├── student_parser.py      # Parse student answers
│   └── answer_evaluator.py    # AI evaluation logic
├── ocr/
│   └── gemini_ocr.py          # Gemini OCR integration
├── nlp/
│   └── text_cleaner.py        # Text preprocessing
├── frontend/                  # React + Vite frontend
│   ├── src/
│   ├── public/
│   └── vite.config.js
├── cli.py                     # Command-line interface
├── app.py                     # Flask web application
├── seed_users.py              # Database seeding with test users
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+ (for frontend)
- MongoDB (running locally on `mongodb://localhost:27017/`)
- Google Gemini API key

### Backend Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Shaddaad/EvalAI---Answer-Evaluator.git
   cd EvalAI---Answer-Evaluator
   ```

2. Install Python dependencies:
   ```bash
   pip install flask flask-jwt-extended pymongo bcrypt google-generativeai
   ```

3. Set up environment variables:
   ```bash
   export GEMINI_API_KEY="your_api_key_here"
   ```

4. Seed the database with test users:
   ```bash
   python seed_users.py
   ```

### Frontend Installation

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

#### Backend
```bash
python app.py
```
Backend runs on `http://localhost:5000`

#### Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173` (Vite default)

#### CLI Mode

**Create an answer key from an image:**
```bash
python cli.py key <path_to_key_image>
```

**Evaluate a student's exam paper:**
```bash
python cli.py eval <path_to_student_image>
```

## 👥 User Roles

### Admin
- System administration
- User management
- Global settings

### Teachers
- Create and manage exams
- Generate answer keys
- View class performance
- Subject management
- Monitor student submissions

### Students
- Submit exam papers
- View evaluation results
- Check marks and feedback
- Track performance

## 🔐 Default Test Users

The following test users are available after seeding:

| Email | Password | Role | Details |
|-------|----------|------|---------|
| admin | 123 | Admin | System administrator |
| sk@test.com | 123 | Teacher | Computer Science |
| arya@test.com | 123 | Teacher | Computer Networks |
| shadd@test.com | 123 | Student | Roll: 01, Class: CS6B |
| aflah@test.com | 123 | Student | Roll: 02, Class: CS6B |
| minza@test.com | 123 | Student | Roll: 03, Class: CS6B |

## 📊 Workflow

1. **Teacher creates answer key**: Upload a key image → System extracts answer key → Save to `answer_key.json`
2. **Student submits exam**: Upload scanned exam paper through web interface
3. **OCR Processing**: Extract text from student paper using Gemini OCR
4. **Answer Parsing**: Split extracted text by question numbers
5. **AI Evaluation**: Compare student answers with model answers using Google Gemini
6. **Generate Report**: Create detailed evaluation report with marks and reasoning

## 🔌 API Endpoints

### Authentication
- `POST /login` - User login, returns JWT token

### Teacher Endpoints
- `POST /teacher/create-exam` - Create new exam
- `GET /exams` - Get all exams
- `GET /exams/teacher/<teacher_id>` - Get teacher's exams
- `DELETE /exams/<exam_id>` - Delete exam

## 📝 Database Schema

### Users Collection
```json
{
  "_id": ObjectId,
  "name": "string",
  "email": "string",
  "password": "hashed_string",
  "role": "admin|teacher|student",
  "subject": "string (for teachers)",
  "roll_number": "string (for students)",
  "class": "string (for students)"
}
```

### Exams Collection
```json
{
  "_id": ObjectId,
  "exam_name": "string",
  "class": "string",
  "subject": "string",
  "teacher_id": "string",
  "max_marks": "number",
  "date": "string",
  "valuation_type": "moderate|strict|lenient",
  "answer_key": "object"
}
```

### Classes Collection
```json
{
  "_id": ObjectId,
  "name": "string",
  "teachers": ["teacher_id"],
  "students": ["student_id"]
}
```

### Submissions Collection
```json
{
  "_id": ObjectId,
  "exam_id": "ObjectId",
  "student_id": "ObjectId",
  "student_answers": "object",
  "evaluation_result": "object",
  "submitted_at": "timestamp"
}
```

## 🎓 How the Evaluation Works

1. Student answers are parsed from OCR output by question number
2. Each answer is compared against the model answer using Google Gemini AI
3. The AI considers:
   - Content relevance and accuracy
   - Completeness of the answer
   - Clarity and coherence
   - Alignment with model answer
4. Marks are awarded based on model's evaluation
5. A detailed reason is provided for the grading

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs via GitHub Issues
- Suggest new features
- Submit pull requests with improvements

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Authors

- **Shaddaad** - Project lead
- **Aflah Muhammad** - Developer
- **Team Members**: Minza, Arya, Sreekumar K

## 🆘 Support

For issues, questions, or suggestions:
- Open an issue on the [GitHub repository](https://github.com/Shaddaad/EvalAI---Answer-Evaluator)
- Contact the development team

## 🔮 Future Enhancements

- [ ] Support for multiple languages
- [ ] Machine learning-based answer evaluation refinement
- [ ] Real-time evaluation progress tracking
- [ ] Batch exam processing
- [ ] Advanced analytics and statistics dashboard
- [ ] Mobile app for students
- [ ] Integration with educational platforms (Canvas, Blackboard, Moodle)
- [ ] Plagiarism detection
- [ ] Support for different question types (MCQ, essay, fill-in-the-blank)
- [ ] Grading rubrics and templates

## 📚 Documentation

For more detailed documentation on specific components:
- [Frontend README](./frontend/README.md) - React + Vite setup
- [Database Schema](./database/) - MongoDB collections and operations
- [Evaluation Module](./evaluation/) - AI evaluation logic

## 🐛 Known Issues

- Ensure MongoDB is running before starting the application
- OCR accuracy depends on image quality
- Set valid GEMINI_API_KEY for evaluation features to work

## ⚙️ Configuration

Environment variables to set:
```bash
GEMINI_API_KEY=your_api_key
MONGODB_URI=mongodb://localhost:27017/eval_ai
FLASK_ENV=development
JWT_SECRET_KEY=your_secret_key
```
