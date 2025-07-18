const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/server');
const Hospital = require('../src/models/Hospital');

let mongoServer;

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
  await Hospital.deleteMany({});
});

describe('Hospital API', () => {
  describe('POST /api/hospitals', () => {
    it('should create a new hospital', async () => {
      const hospitalData = {
        facilityName: 'Test Hospital',
        zoneName: 'Test Zone',
        wardName: 'Test Ward',
        zoneNo: 1,
        wardNo: 1,
        type: 'Hospital',
        class: 'Private',
        emergencyBeds: 10,
        totalBeds: 50,
        doctorCount: 5,
        nurseCount: 15
      };

      const response = await request(app)
        .post('/api/hospitals')
        .send(hospitalData)
        .expect(200);

      expect(response.body.facilityName).toBe(hospitalData.facilityName);
      expect(response.body.zoneName).toBe(hospitalData.zoneName);
      expect(response.body.type).toBe(hospitalData.type);
      expect(response.body.class).toBe(hospitalData.class);
    });

    it('should return error for invalid hospital type', async () => {
      const hospitalData = {
        facilityName: 'Test Hospital',
        zoneName: 'Test Zone',
        wardName: 'Test Ward',
        zoneNo: 1,
        wardNo: 1,
        type: 'InvalidType',
        class: 'Private'
      };

      await request(app)
        .post('/api/hospitals')
        .send(hospitalData)
        .expect(500);
    });
  });

  describe('GET /api/hospitals', () => {
    it('should get all hospitals', async () => {
      const hospital1 = new Hospital({
        facilityName: 'Hospital 1',
        zoneName: 'Zone 1',
        wardName: 'Ward 1',
        zoneNo: 1,
        wardNo: 1,
        type: 'Hospital',
        class: 'Public'
      });

      const hospital2 = new Hospital({
        facilityName: 'Hospital 2',
        zoneName: 'Zone 2',
        wardName: 'Ward 2',
        zoneNo: 2,
        wardNo: 2,
        type: 'Nursing Home',
        class: 'Private'
      });

      await hospital1.save();
      await hospital2.save();

      const response = await request(app)
        .get('/api/hospitals')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].facilityName).toBe('Hospital 1');
      expect(response.body[1].facilityName).toBe('Hospital 2');
    });
  });

  describe('GET /api/hospitals/:id', () => {
    it('should get hospital by ID', async () => {
      const hospital = new Hospital({
        facilityName: 'Test Hospital',
        zoneName: 'Test Zone',
        wardName: 'Test Ward',
        zoneNo: 1,
        wardNo: 1,
        type: 'Hospital',
        class: 'Private'
      });

      await hospital.save();

      const response = await request(app)
        .get(`/api/hospitals/${hospital._id}`)
        .expect(200);

      expect(response.body.facilityName).toBe('Test Hospital');
      expect(response.body._id).toBe(hospital._id.toString());
    });

    it('should return 404 for non-existent hospital', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      await request(app)
        .get(`/api/hospitals/${nonExistentId}`)
        .expect(404);
    });
  });
});