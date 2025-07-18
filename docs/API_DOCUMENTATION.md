# API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
Currently, the API does not require authentication. JWT-based authentication is ready for implementation.

## Response Format
All API responses follow a consistent format:

### Success Response
```json
{
  "data": {
    // Response data
  },
  "message": "Success message"
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

## HTTP Status Codes
- `200` - OK: Request successful
- `201` - Created: Resource created successfully
- `400` - Bad Request: Invalid request data
- `404` - Not Found: Resource not found
- `500` - Internal Server Error: Server error

---

## Hospital Management

### Get All Hospitals
**GET** `/api/hospitals`

**Description**: Retrieve all hospitals in the system.

**Response**:
```json
{
  "data": [
    {
      "_id": "hospital_id",
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
      "accreditationNumber": "ACC-2024-001",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Get Hospital by ID
**GET** `/api/hospitals/:id`

**Parameters**:
- `id` (string, required): Hospital ID

**Response**:
```json
{
  "data": {
    "_id": "hospital_id",
    "name": "City General Hospital",
    // ... other hospital fields
  }
}
```

### Create New Hospital
**POST** `/api/hospitals`

**Request Body**:
```json
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

**Response**:
```json
{
  "data": {
    "_id": "new_hospital_id",
    "name": "City General Hospital",
    // ... other fields
  },
  "message": "Hospital created successfully"
}
```

### Update Hospital
**PUT** `/api/hospitals/:id`

**Parameters**:
- `id` (string, required): Hospital ID

**Request Body** (partial update allowed):
```json
{
  "name": "Updated Hospital Name",
  "bedCapacity": 600,
  "departments": ["Cardiology", "Neurology", "Orthopedics", "Emergency"]
}
```

### Delete Hospital
**DELETE** `/api/hospitals/:id`

**Parameters**:
- `id` (string, required): Hospital ID

**Response**:
```json
{
  "message": "Hospital deleted successfully"
}
```

---

## Doctor Management

### Get All Doctors
**GET** `/api/doctors`

**Query Parameters**:
- `specialization` (string, optional): Filter by specialization
- `hospital` (string, optional): Filter by hospital ID

**Response**:
```json
{
  "data": [
    {
      "_id": "doctor_id",
      "personalInfo": {
        "firstName": "Dr. John",
        "lastName": "Smith",
        "email": "john.smith@hospital.com",
        "phone": "+91-98765-43210",
        "dateOfBirth": "1980-05-15T00:00:00.000Z"
      },
      "professionalInfo": {
        "licenseNumber": "MED-2024-001",
        "specialization": "Cardiology",
        "yearsOfExperience": 15,
        "qualifications": ["MBBS", "MD Cardiology"]
      },
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Get Doctor by ID
**GET** `/api/doctors/:id`

### Create New Doctor
**POST** `/api/doctors`

**Request Body**:
```json
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

### Update Doctor
**PUT** `/api/doctors/:id`

### Delete Doctor
**DELETE** `/api/doctors/:id`

---

## Student Management

### Get All Students
**GET** `/api/students`

**Query Parameters**:
- `college` (string, optional): Filter by college ID
- `enrollmentYear` (number, optional): Filter by enrollment year

**Response**:
```json
{
  "data": [
    {
      "_id": "student_id",
      "personalInfo": {
        "firstName": "Jane",
        "lastName": "Doe",
        "email": "jane.doe@student.com",
        "phone": "+91-87654-32109",
        "dateOfBirth": "2000-03-20T00:00:00.000Z"
      },
      "academicInfo": {
        "enrollmentNumber": "STU-2024-001",
        "enrollmentDate": "2024-01-15T00:00:00.000Z",
        "expectedGraduation": "2026-12-15T00:00:00.000Z",
        "currentGPA": 3.8
      },
      "collegeId": "college_id",
      "isActive": true
    }
  ]
}
```

### Create New Student
**POST** `/api/students`

**Request Body**:
```json
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
  "collegeId": "college_object_id"
}
```

---

## College Management

### Get All Colleges
**GET** `/api/colleges`

**Response**:
```json
{
  "data": [
    {
      "_id": "college_id",
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
      "establishedYear": 1995,
      "isActive": true
    }
  ]
}
```

### Create New College
**POST** `/api/colleges`

**Request Body**:
```json
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

---

## Certificate Management

### Get All Certificates
**GET** `/api/certificates`

**Query Parameters**:
- `student` (string, optional): Filter by student ID
- `status` (string, optional): Filter by status (Active, Revoked, Expired)
- `type` (string, optional): Filter by certificate type

**Response**:
```json
{
  "data": [
    {
      "_id": "certificate_id",
      "certificateNumber": "CERT-2024-001",
      "studentId": "student_id",
      "programId": "program_id",
      "certificateType": "Completion",
      "issueDate": "2024-06-15T00:00:00.000Z",
      "validUntil": "2029-06-15T00:00:00.000Z",
      "status": "Active",
      "digitalSignature": "signature_hash",
      "createdAt": "2024-06-15T10:30:00.000Z"
    }
  ]
}
```

### Get Certificate by ID
**GET** `/api/certificates/:id`

### Create New Certificate
**POST** `/api/certificates`

**Request Body**:
```json
{
  "studentId": "student_object_id",
  "programId": "program_object_id",
  "certificateType": "Completion",
  "issueDate": "2024-06-15",
  "validUntil": "2029-06-15"
}
```

**Response**:
```json
{
  "data": {
    "_id": "certificate_id",
    "certificateNumber": "CERT-2024-001",
    "studentId": "student_id",
    "programId": "program_id",
    "certificateType": "Completion",
    "issueDate": "2024-06-15T00:00:00.000Z",
    "validUntil": "2029-06-15T00:00:00.000Z",
    "status": "Active",
    "digitalSignature": "generated_signature_hash"
  },
  "message": "Certificate created successfully"
}
```

### Validate Certificate
**POST** `/api/certificates/validate`

**Request Body**:
```json
{
  "certificateNumber": "CERT-2024-001"
}
```

**Response**:
```json
{
  "data": {
    "isValid": true,
    "certificate": {
      "_id": "certificate_id",
      "certificateNumber": "CERT-2024-001",
      "studentId": "student_id",
      "status": "Active",
      "issueDate": "2024-06-15T00:00:00.000Z",
      "validUntil": "2029-06-15T00:00:00.000Z"
    },
    "validationRecord": {
      "_id": "validation_id",
      "validatedAt": "2024-07-18T19:26:00.000Z",
      "validatedBy": "system",
      "validationResult": "Valid"
    }
  },
  "message": "Certificate validation completed"
}
```

### Revoke Certificate
**POST** `/api/certificates/:id/revoke`

**Parameters**:
- `id` (string, required): Certificate ID

**Request Body**:
```json
{
  "reason": "Academic misconduct",
  "revokedBy": "admin_user_id"
}
```

**Response**:
```json
{
  "data": {
    "_id": "certificate_id",
    "status": "Revoked",
    "revocationInfo": {
      "reason": "Academic misconduct",
      "revokedBy": "admin_user_id",
      "revokedAt": "2024-07-18T19:26:00.000Z"
    }
  },
  "message": "Certificate revoked successfully"
}
```

---

## Training Program Management

### Get All Training Programs
**GET** `/api/programs`

**Response**:
```json
{
  "data": [
    {
      "_id": "program_id",
      "name": "Basic Nursing Training",
      "description": "Comprehensive nursing training program",
      "duration": {
        "months": 24,
        "classroomPhase": 12,
        "internshipPhase": 12
      },
      "requirements": {
        "minimumEducation": "12th Grade",
        "minimumAge": 18,
        "prerequisites": ["Biology", "Chemistry"]
      },
      "curriculum": [
        {
          "subject": "Anatomy and Physiology",
          "credits": 4,
          "hours": 60
        }
      ],
      "isActive": true
    }
  ]
}
```

---

## Error Handling

### Common Error Responses

#### Validation Error (400)
```json
{
  "error": "Validation failed",
  "details": {
    "field": "email",
    "message": "Email is required"
  }
}
```

#### Not Found Error (404)
```json
{
  "error": "Resource not found",
  "details": "Hospital with ID 'invalid_id' not found"
}
```

#### Server Error (500)
```json
{
  "error": "Internal server error",
  "details": "Database connection failed"
}
```

---

## Rate Limiting
Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## Pagination
Pagination is not currently implemented but can be added using query parameters:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)

## Filtering and Sorting
Most endpoints support basic filtering through query parameters. Sorting can be implemented using:
- `sort` (string): Field to sort by
- `order` (string): 'asc' or 'desc'

## Data Validation
All endpoints validate input data using Mongoose schemas. Invalid data will return a 400 Bad Request error with details about the validation failure.

## CORS
Cross-Origin Resource Sharing (CORS) is enabled for all origins in development. Configure appropriately for production.