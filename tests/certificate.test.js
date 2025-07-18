const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/server');
const Certificate = require('../src/models/Certificate');
const CertificateValidation = require('../src/models/CertificateValidation');
const Student = require('../src/models/Student');
const TrainingProgram = require('../src/models/TrainingProgram');
const College = require('../src/models/College');

let mongoServer;
let testStudent, testProgram, testCollege;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Certificate.deleteMany({});
  await CertificateValidation.deleteMany({});
  await Student.deleteMany({});
  await TrainingProgram.deleteMany({});
  await College.deleteMany({});

  // Create test data
  testCollege = new College({
    collegeName: 'Test College',
    address: {
      street: '123 Test St',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456'
    },
    contactEmail: 'test@college.com',
    contactPhone: '1234567890',
    accreditationNumber: 'ACC123',
    establishedYear: 2000
  });
  await testCollege.save();

  testStudent = new Student({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@test.com',
    phone: '1234567890',
    dateOfBirth: new Date('1995-01-01'),
    collegeId: testCollege._id,
    enrollmentNumber: 'ENR123',
    address: {
      street: '456 Student St',
      city: 'Student City',
      state: 'Student State',
      pincode: '654321'
    },
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Mother',
      phone: '0987654321'
    }
  });
  await testStudent.save();

  testProgram = new TrainingProgram({
    programName: 'Nursing Training Program',
    programCode: 'NTP001',
    duration: 12,
    description: 'Comprehensive nursing training program',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    maxStudents: 30,
    curriculum: [{
      subject: 'Basic Nursing',
      hours: 100,
      description: 'Introduction to nursing'
    }],
    fees: {
      amount: 50000,
      currency: 'INR'
    },
    classroomPhase: {
      duration: 6,
      location: 'Main Campus'
    },
    internshipPhase: {
      duration: 6,
      minPassingMarks: 60
    }
  });
  await testProgram.save();
});

describe('Certificate API', () => {
  describe('POST /api/certificates', () => {
    it('should create a new certificate', async () => {
      const certificateData = {
        studentId: testStudent._id,
        programId: testProgram._id,
        grade: 'A',
        finalScore: 85
      };

      const response = await request(app)
        .post('/api/certificates')
        .send(certificateData)
        .expect(200);

      expect(response.body.studentId._id).toBe(testStudent._id.toString());
      expect(response.body.programId._id).toBe(testProgram._id.toString());
      expect(response.body.grade).toBe('A');
      expect(response.body.finalScore).toBe(85);
      expect(response.body.certificateNumber).toMatch(/^CERT-/);
      expect(response.body.digitalSignature).toBeDefined();
      expect(response.body.qrCode).toBeDefined();
    });
  });

  describe('GET /api/certificates/validate/:certificateNumber', () => {
    it('should validate a valid certificate', async () => {
      const certificate = new Certificate({
        studentId: testStudent._id,
        programId: testProgram._id,
        grade: 'A',
        finalScore: 85,
        digitalSignature: 'test-signature',
        qrCode: 'test-qr-code'
      });
      await certificate.save();

      const response = await request(app)
        .get(`/api/certificates/validate/${certificate.certificateNumber}`)
        .expect(200);

      expect(response.body.valid).toBe(true);
      expect(response.body.validationResult).toBe('Valid');
      expect(response.body.certificate.certificateNumber).toBe(certificate.certificateNumber);
      expect(response.body.certificate.studentName).toBe('John Doe');
      expect(response.body.certificate.programName).toBe('Nursing Training Program');
    });

    it('should return invalid for non-existent certificate', async () => {
      const response = await request(app)
        .get('/api/certificates/validate/CERT-NONEXISTENT')
        .expect(404);

      expect(response.body.valid).toBe(false);
      expect(response.body.message).toBe('Certificate not found');
    });

    it('should return revoked for revoked certificate', async () => {
      const certificate = new Certificate({
        studentId: testStudent._id,
        programId: testProgram._id,
        grade: 'A',
        finalScore: 85,
        digitalSignature: 'test-signature',
        qrCode: 'test-qr-code',
        revokedAt: new Date(),
        revokeReason: 'Test revocation'
      });
      await certificate.save();

      const response = await request(app)
        .get(`/api/certificates/validate/${certificate.certificateNumber}`)
        .expect(200);

      expect(response.body.valid).toBe(false);
      expect(response.body.validationResult).toBe('Revoked');
      expect(response.body.message).toContain('Certificate was revoked');
    });

    it('should return expired for expired certificate', async () => {
      const certificate = new Certificate({
        studentId: testStudent._id,
        programId: testProgram._id,
        grade: 'A',
        finalScore: 85,
        digitalSignature: 'test-signature',
        qrCode: 'test-qr-code',
        expiryDate: new Date('2020-01-01') // Past date
      });
      await certificate.save();

      const response = await request(app)
        .get(`/api/certificates/validate/${certificate.certificateNumber}`)
        .expect(200);

      expect(response.body.valid).toBe(false);
      expect(response.body.validationResult).toBe('Expired');
      expect(response.body.message).toContain('Certificate expired');
    });
  });

  describe('POST /api/certificates/validate/:certificateNumber/log', () => {
    it('should log certificate validation', async () => {
      const certificate = new Certificate({
        studentId: testStudent._id,
        programId: testProgram._id,
        grade: 'A',
        finalScore: 85,
        digitalSignature: 'test-signature',
        qrCode: 'test-qr-code'
      });
      await certificate.save();

      const validationData = {
        validatorName: 'HR Manager',
        validatorEmail: 'hr@company.com',
        validatorOrganization: 'Test Company',
        validationPurpose: 'Employment Verification',
        additionalNotes: 'Verification for job application'
      };

      const response = await request(app)
        .post(`/api/certificates/validate/${certificate.certificateNumber}/log`)
        .send(validationData)
        .expect(200);

      expect(response.body.message).toBe('Validation logged successfully');
      expect(response.body.validationResult).toBe('Valid');
      expect(response.body.validationId).toBeDefined();

      // Verify validation was logged in database
      const validations = await CertificateValidation.find({ certificateId: certificate._id });
      expect(validations).toHaveLength(1);
      expect(validations[0].validatorName).toBe('HR Manager');
      expect(validations[0].validationPurpose).toBe('Employment Verification');
    });
  });

  describe('PUT /api/certificates/:id/revoke', () => {
    it('should revoke a certificate', async () => {
      const certificate = new Certificate({
        studentId: testStudent._id,
        programId: testProgram._id,
        grade: 'A',
        finalScore: 85,
        digitalSignature: 'test-signature',
        qrCode: 'test-qr-code'
      });
      await certificate.save();

      const revokeData = {
        revokedBy: testStudent._id,
        revokeReason: 'Academic misconduct discovered'
      };

      const response = await request(app)
        .put(`/api/certificates/${certificate._id}/revoke`)
        .send(revokeData)
        .expect(200);

      expect(response.body.message).toBe('Certificate revoked successfully');
      expect(response.body.certificate.revokedAt).toBeDefined();
      expect(response.body.certificate.revokeReason).toBe('Academic misconduct discovered');
      expect(response.body.certificate.isValid).toBe(false);
    });
  });

  describe('GET /api/certificates/:id/validations', () => {
    it('should get validation history for a certificate', async () => {
      const certificate = new Certificate({
        studentId: testStudent._id,
        programId: testProgram._id,
        grade: 'A',
        finalScore: 85,
        digitalSignature: 'test-signature',
        qrCode: 'test-qr-code'
      });
      await certificate.save();

      // Create some validation records
      const validation1 = new CertificateValidation({
        certificateId: certificate._id,
        validatorName: 'HR Manager 1',
        validatorEmail: 'hr1@company.com',
        validatorOrganization: 'Company 1',
        validationPurpose: 'Employment Verification',
        validationResult: 'Valid',
        ipAddress: '192.168.1.1',
        userAgent: 'Test Agent'
      });

      const validation2 = new CertificateValidation({
        certificateId: certificate._id,
        validatorName: 'HR Manager 2',
        validatorEmail: 'hr2@company.com',
        validatorOrganization: 'Company 2',
        validationPurpose: 'Background Check',
        validationResult: 'Valid',
        ipAddress: '192.168.1.2',
        userAgent: 'Test Agent'
      });

      await validation1.save();
      await validation2.save();

      const response = await request(app)
        .get(`/api/certificates/${certificate._id}/validations`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].validatorName).toBe('HR Manager 2'); // Most recent first
      expect(response.body[1].validatorName).toBe('HR Manager 1');
    });
  });
});