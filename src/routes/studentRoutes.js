const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const StudentEnrollment = require('../models/StudentEnrollment');

// @route   POST api/students
// @desc    Add a new student
// @access  Public
router.post('/', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    const student = await newStudent.save();
    await student.populate('collegeId');
    res.json(student);
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Student with this email or enrollment number already exists' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/students
// @desc    Get all students
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status, collegeId } = req.query;
    let filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (collegeId) {
      filter.collegeId = collegeId;
    }
    
    const students = await Student.find(filter).populate('collegeId');
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/students/:id
// @desc    Get student by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('collegeId');
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }
    res.json(student);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Student not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/students/:id
// @desc    Update student
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('collegeId');
    
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }
    
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/students/:id/enroll
// @desc    Enroll student in training program
// @access  Public
router.post('/:id/enroll', async (req, res) => {
  try {
    const { programId, classroomStartDate, classroomEndDate } = req.body;
    
    const enrollment = new StudentEnrollment({
      studentId: req.params.id,
      programId,
      classroomStartDate,
      classroomEndDate
    });
    
    await enrollment.save();
    await enrollment.populate(['studentId', 'programId']);
    
    res.json(enrollment);
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Student already enrolled in this program' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/students/:id/enrollments
// @desc    Get all enrollments for a student
// @access  Public
router.get('/:id/enrollments', async (req, res) => {
  try {
    const enrollments = await StudentEnrollment.find({
      studentId: req.params.id
    }).populate('programId');
    
    res.json(enrollments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;