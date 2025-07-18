# Entity-Relationship (ER) Diagram for Nursing Training Institution

## Overview
This document describes the database schema for a nursing training institution system that manages hospitals, doctors, students, training programs, and certificate validation.

## Entities and Relationships

### 1. Hospitals
- **Attributes**: hospitalId, facilityName, cityName, zoneName, wardName, zoneNo, wardNo, type, class, pharmacyAvailable, emergencyBeds, totalBeds, doctorCount, nurseCount, midwivesCount, avgMonthlyPatients, ambulanceService, ambulanceCount
- **Relationships**: 
  - One-to-Many with DoctorHospitalAssignments
  - One-to-Many with Internships

### 2. Doctors
- **Attributes**: doctorId, firstName, lastName, email, phone, specialization, experience, isSeniorDoctor, isActive
- **Relationships**:
  - One-to-Many with DoctorHospitalAssignments
  - One-to-Many with Classes (as instructor)
  - One-to-Many with GuestLectures
  - One-to-Many with Internships (as supervisor)

### 3. DoctorHospitalAssignments
- **Attributes**: assignmentId, doctorId, hospitalId, startDate, endDate, isActive
- **Relationships**:
  - Many-to-One with Doctors
  - Many-to-One with Hospitals

### 4. Colleges
- **Attributes**: collegeId, collegeName, address, contactEmail, contactPhone, accreditationNumber
- **Relationships**:
  - One-to-Many with Students
  - One-to-Many with AcademicCredits

### 5. Students
- **Attributes**: studentId, firstName, lastName, email, phone, dateOfBirth, collegeId, enrollmentNumber, admissionDate, status
- **Relationships**:
  - Many-to-One with Colleges
  - One-to-Many with TrainingPrograms
  - One-to-Many with ExamResults
  - One-to-Many with Internships
  - One-to-Many with Certificates

### 6. TrainingPrograms
- **Attributes**: programId, programName, duration, description, startDate, endDate, maxStudents, isActive
- **Relationships**:
  - One-to-Many with StudentEnrollments
  - One-to-Many with Classes
  - One-to-Many with Exams

### 7. StudentEnrollments
- **Attributes**: enrollmentId, studentId, programId, enrollmentDate, status, completionDate
- **Relationships**:
  - Many-to-One with Students
  - Many-to-One with TrainingPrograms

### 8. Classes
- **Attributes**: classId, programId, instructorId, className, classDate, startTime, endTime, location, classType, description
- **Relationships**:
  - Many-to-One with TrainingPrograms
  - Many-to-One with Doctors (instructor)
  - One-to-Many with ClassAttendance

### 9. GuestLectures
- **Attributes**: lectureId, guestDoctorId, programId, lectureTitle, lectureDate, startTime, endTime, location, topic
- **Relationships**:
  - Many-to-One with Doctors (guest)
  - Many-to-One with TrainingPrograms

### 10. ClassAttendance
- **Attributes**: attendanceId, classId, studentId, isPresent, attendanceDate
- **Relationships**:
  - Many-to-One with Classes
  - Many-to-One with Students

### 11. Exams
- **Attributes**: examId, programId, examName, examDate, duration, totalMarks, passingMarks, examType
- **Relationships**:
  - Many-to-One with TrainingPrograms
  - One-to-Many with ExamResults

### 12. ExamResults
- **Attributes**: resultId, examId, studentId, marksObtained, grade, isPassed, examDate
- **Relationships**:
  - Many-to-One with Exams
  - Many-to-One with Students

### 13. Internships
- **Attributes**: internshipId, studentId, hospitalId, supervisorId, startDate, endDate, status, evaluation, feedback
- **Relationships**:
  - Many-to-One with Students
  - Many-to-One with Hospitals
  - Many-to-One with Doctors (supervisor)

### 14. Certificates
- **Attributes**: certificateId, studentId, programId, certificateNumber, issueDate, isValid, certificateType
- **Relationships**:
  - Many-to-One with Students
  - Many-to-One with TrainingPrograms
  - One-to-Many with CertificateValidations

### 15. CertificateValidations
- **Attributes**: validationId, certificateId, validatorName, validatorEmail, validatorOrganization, validationDate, validationPurpose
- **Relationships**:
  - Many-to-One with Certificates

### 16. AcademicCredits
- **Attributes**: creditId, studentId, collegeId, programId, creditsAwarded, creditDate, academicYear
- **Relationships**:
  - Many-to-One with Students
  - Many-to-One with Colleges
  - Many-to-One with TrainingPrograms

## Key Relationships Summary

1. **Doctors ↔ Hospitals**: Many-to-Many (through DoctorHospitalAssignments)
2. **Students ↔ Colleges**: Many-to-One
3. **Students ↔ TrainingPrograms**: Many-to-Many (through StudentEnrollments)
4. **Doctors ↔ Classes**: One-to-Many (instructor relationship)
5. **Students ↔ Classes**: Many-to-Many (through ClassAttendance)
6. **Students ↔ Exams**: Many-to-Many (through ExamResults)
7. **Students ↔ Internships**: One-to-Many
8. **Hospitals ↔ Internships**: One-to-Many
9. **Students ↔ Certificates**: One-to-Many
10. **Certificates ↔ Validations**: One-to-Many

## Business Rules

1. A doctor can work at multiple hospitals
2. A student belongs to one college but can enroll in multiple training programs
3. Only senior doctors can be instructors for regular classes
4. Any doctor (senior or not) can conduct guest lectures
5. Students must pass exams before proceeding to internships
6. Each certificate has a unique certificate number
7. Certificate validations must track who, when, and which certificate was checked
8. Academic credits are awarded by colleges based on program completion