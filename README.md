# Nursing Training Institution Database System

A comprehensive database management system for nursing training institutions built with Node.js, Express.js, and MongoDB. This system manages hospitals, doctors, students, training programs, and certificate validation.

## Table of Contents

- [Features](#features)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## Features

### Core Functionality
- **Hospital Management**: Complete CRUD operations for hospital data
- **Doctor Management**: Multi-hospital doctor assignments and specializations
- **Student Management**: Student enrollment and college affiliations
- **Training Program Management**: Classroom and internship phase tracking
- **Certificate System**: Generation, validation, and revocation of certificates
- **Academic Credit System**: Credit tracking and GPA calculations

### Advanced Features
- **Certificate Validation**: Unique certificate numbers with validation tracking
- **Multi-Hospital Doctor Assignments**: Doctors can work at multiple locations
- **Comprehensive Exam System**: Exam scheduling, results, and grade tracking
- **Attendance Management**: Class and lecture attendance tracking
- **Guest Lecture System**: External expert lecture management

## System Architecture

The system follows a RESTful API architecture with the following components:

- **Backend**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication (ready for implementation)
- **Testing**: Jest with Supertest for API testing
- **Environment Management**: dotenv for configuration

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **MongoDB** (v4.0.0 or higher) or MongoDB Atlas account

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd katyayani_assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install development dependencies**
   ```bash
   npm install --save-dev jest supertest mongodb-memory-server
   ```

## Configuration

1. **Create environment file**
   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables**
   Edit the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/nursing_training_db
   PORT=8080
   JWT_SECRET=your-jwt-secret-key
   NODE_ENV=development
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```
This starts the server with nodemon for automatic restarts on file changes.

### Production Mode
```bash
npm start
```

### Running Tests
```bash
npm test
```

### Running Tests in Watch Mode
```bash
npm run test:watch
```

The server will start on `http://localhost:8080` by default.

## API Documentation

### Base URL
```
http://localhost:8080/api
```

### Hospital Endpoints

#### Get All Hospitals
```http
GET /api/hospitals
```

#### Get Hospital by ID
```http
GET /api/hospitals/:id
```

#### Create New Hospital
```http
POST /api/hospitals
Content-Type: application/json

{
  "name": "City General Hospital",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  },
  "contactInfo": {
    "phone": "+91-22-12345678",
    "email": "info@citygeneral.com",
    "website": "https://citygeneral.com"
  },
  "hospitalType": "General",
  "bedCapacity": 500,
  "departments": ["Cardiology", "Neurology", "Orthopedics"],
  "accreditationNumber": "ACC-2024-001"
}
```

#### Update Hospital
```http
PUT /api/hospitals/:id
Content-Type: application/json

{
  "name": "Updated Hospital Name",
  "bedCapacity": 600
}
```

#### Delete Hospital
```http
DELETE /api/hospitals/:id
```

### Doctor Endpoints

#### Get All Doctors
```http
GET /api/doctors
```

#### Get Doctor by ID
```http
GET /api/doctors/:id
```

#### Create New Doctor
```http
POST /api/doctors
Content-Type: application/json

{
  "personalInfo": {
    "firstName": "Dr. John",
    "lastName": "Smith",
    "email": "john.smith@hospital.com",
    "phone": "+91-98765-43210",
    "dateOfBirth": "1980-05-15"
  },
  "professionalInfo": {
    "licenseNumber": "MED-2024-001",
    "specialization": "Cardiology",
    "yearsOfExperience": 15,
    "qualifications": ["MBBS", "MD Cardiology"]
  }
}
```

### Student Endpoints

#### Get All Students
```http
GET /api/students
```

#### Create New Student
```http
POST /api/students
Content-Type: application/json

{
  "personalInfo": {
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@student.com",
    "phone": "+91-87654-32109",
    "dateOfBirth": "2000-03-20"
  },
  "academicInfo": {
    "enrollmentNumber": "STU-2024-001",
    "enrollmentDate": "2024-01-15",
    "expectedGraduation": "2026-12-15"
  },
  "collegeId": "college-object-id"
}
```

### College Endpoints

#### Get All Colleges
```http
GET /api/colleges
```

#### Create New College
```http
POST /api/colleges
Content-Type: application/json

{
  "name": "Mumbai Nursing College",
  "address": {
    "street": "456 College Road",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400002",
    "country": "India"
  },
  "contactInfo": {
    "phone": "+91-22-87654321",
    "email": "info@mumbainursing.edu",
    "website": "https://mumbainursing.edu"
  },
  "accreditationNumber": "NURS-ACC-2024-001",
  "establishedYear": 1995
}
```

### Certificate Endpoints

#### Get All Certificates
```http
GET /api/certificates
```

#### Create New Certificate
```http
POST /api/certificates
Content-Type: application/json

{
  "studentId": "student-object-id",
  "programId": "program-object-id",
  "certificateType": "Completion",
  "issueDate": "2024-06-15",
  "validUntil": "2029-06-15"
}
```

#### Validate Certificate
```http
POST /api/certificates/validate
Content-Type: application/json

{
  "certificateNumber": "CERT-2024-001"
}
```

#### Revoke Certificate
```http
POST /api/certificates/:id/revoke
Content-Type: application/json

{
  "reason": "Academic misconduct"
}
```

## Testing

The project includes comprehensive test suites for critical functionality:

### Test Structure
- **Unit Tests**: Individual model and utility function testing
- **Integration Tests**: API endpoint testing with real database operations
- **Test Database**: Uses MongoDB Memory Server for isolated testing

### Running Specific Tests
```bash
# Run hospital tests
npm test -- --testNamePattern="Hospital"

# Run certificate tests
npm test -- --testNamePattern="Certificate"

# Run tests with coverage
npm test -- --coverage
```

### Test Files
- `tests/hospital.test.js`: Hospital CRUD operations
- `tests/certificate.test.js`: Certificate generation and validation
- `tests/setup.js`: Test environment configuration

## Database Schema

### Entity Relationship Overview

The system includes 16 main entities with complex relationships:

#### Core Entities
1. **Hospitals**: Medical facilities
2. **Doctors**: Medical professionals
3. **Students**: Nursing students
4. **Colleges**: Educational institutions
5. **TrainingPrograms**: Nursing training curricula

#### Academic Entities
6. **Classes**: Training sessions
7. **GuestLectures**: External expert sessions
8. **Exams**: Assessment events
9. **ExamResults**: Student performance records
10. **ClassAttendance**: Attendance tracking

#### Certification Entities
11. **Certificates**: Issued credentials
12. **CertificateValidations**: Validation tracking
13. **AcademicCredits**: Credit management

#### Junction Entities
14. **DoctorHospitalAssignments**: Doctor-hospital relationships
15. **StudentEnrollments**: Student-program relationships
16. **Internships**: Practical training assignments

### Key Relationships
- **Many-to-Many**: Doctors ↔ Hospitals, Students ↔ Programs
- **One-to-Many**: Colleges → Students, Programs → Classes
- **One-to-One**: Students → Certificates (per program)

For detailed schema information, see [`docs/ER_DIAGRAM.md`](docs/ER_DIAGRAM.md).

## Project Structure

```
katyayani_assignment/
├── docs/
│   └── ER_DIAGRAM.md          # Database schema documentation
├── src/
│   ├── config/
│   │   └── db.js              # Database connection configuration
│   ├── models/                # Mongoose schemas
│   │   ├── Hospital.js
│   │   ├── Doctor.js
│   │   ├── Student.js
│   │   ├── College.js
│   │   ├── TrainingProgram.js
│   │   ├── Certificate.js
│   │   ├── CertificateValidation.js
│   │   ├── DoctorHospitalAssignment.js
│   │   ├── StudentEnrollment.js
│   │   ├── Class.js
│   │   ├── GuestLecture.js
│   │   ├── ClassAttendance.js
│   │   ├── Exam.js
│   │   ├── ExamResult.js
│   │   ├── Internship.js
│   │   └── AcademicCredit.js
│   ├── routes/                # API route handlers
│   │   ├── hospitalRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── collegeRoutes.js
│   │   └── certificateRoutes.js
│   └── server.js              # Main application entry point
├── tests/                     # Test suites
│   ├── setup.js              # Test configuration
│   ├── hospital.test.js      # Hospital API tests
│   └── certificate.test.js   # Certificate system tests
├── .env                      # Environment configuration
├── .gitignore               # Git ignore rules
├── jest.config.js           # Jest testing configuration
├── package.json             # Project dependencies
└── README.md               # This file
```

## Error Handling

The API uses standard HTTP status codes:

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **404**: Not Found
- **500**: Internal Server Error

Error responses follow this format:
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

## Security Considerations

- **Input Validation**: All inputs are validated using Mongoose schemas
- **Environment Variables**: Sensitive data stored in environment variables
- **Database Security**: MongoDB connection uses authentication
- **CORS**: Cross-origin requests handled appropriately

## Performance Features

- **Database Indexing**: Optimized queries with proper indexing
- **Connection Pooling**: Efficient database connection management
- **Caching Ready**: Structure supports Redis integration
- **Pagination**: Large dataset handling (ready for implementation)

## Future Enhancements

- **Authentication & Authorization**: JWT-based user management
- **File Upload**: Document and image handling
- **Email Notifications**: Automated certificate delivery
- **Reporting**: Advanced analytics and reporting
- **Mobile API**: React Native app support

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in the `docs/` directory

---

**Note**: This system is designed for educational and training institution management. Ensure compliance with local healthcare and education regulations when deploying in production environments.