const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const DoctorHospitalAssignment = require('../models/DoctorHospitalAssignment');

// @route   POST api/doctors
// @desc    Add a new doctor
// @access  Public
router.post('/', async (req, res) => {
  try {
    const newDoctor = new Doctor(req.body);
    const doctor = await newDoctor.save();
    res.json(doctor);
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Doctor with this email or license number already exists' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/doctors
// @desc    Get all doctors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { isSeniorDoctor, specialization } = req.query;
    let filter = { isActive: true };
    
    if (isSeniorDoctor !== undefined) {
      filter.isSeniorDoctor = isSeniorDoctor === 'true';
    }
    
    if (specialization) {
      filter.specialization = new RegExp(specialization, 'i');
    }
    
    const doctors = await Doctor.find(filter);
    res.json(doctors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/doctors/:id
// @desc    Get doctor by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Doctor not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/doctors/:id
// @desc    Update doctor
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/doctors/:id/assign-hospital
// @desc    Assign doctor to hospital
// @access  Public
router.post('/:id/assign-hospital', async (req, res) => {
  try {
    const { hospitalId, department, position, workingHours, workingDays } = req.body;
    
    const assignment = new DoctorHospitalAssignment({
      doctorId: req.params.id,
      hospitalId,
      department,
      position,
      workingHours,
      workingDays
    });
    
    await assignment.save();
    await assignment.populate(['doctorId', 'hospitalId']);
    
    res.json(assignment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/doctors/:id/hospitals
// @desc    Get all hospitals assigned to a doctor
// @access  Public
router.get('/:id/hospitals', async (req, res) => {
  try {
    const assignments = await DoctorHospitalAssignment.find({
      doctorId: req.params.id,
      isActive: true
    }).populate('hospitalId');
    
    res.json(assignments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;