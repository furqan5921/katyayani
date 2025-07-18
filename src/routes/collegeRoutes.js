const express = require('express');
const router = express.Router();
const College = require('../models/College');
const Student = require('../models/Student');

// @route   POST api/colleges
// @desc    Add a new college
// @access  Public
router.post('/', async (req, res) => {
  try {
    const newCollege = new College(req.body);
    const college = await newCollege.save();
    res.json(college);
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'College with this name or accreditation number already exists' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/colleges
// @desc    Get all colleges
// @access  Public
router.get('/', async (req, res) => {
  try {
    const colleges = await College.find({ isActive: true });
    res.json(colleges);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/colleges/:id
// @desc    Get college by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ msg: 'College not found' });
    }
    res.json(college);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'College not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/colleges/:id
// @desc    Update college
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const college = await College.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!college) {
      return res.status(404).json({ msg: 'College not found' });
    }
    
    res.json(college);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/colleges/:id/students
// @desc    Get all students from a college
// @access  Public
router.get('/:id/students', async (req, res) => {
  try {
    const students = await Student.find({ collegeId: req.params.id });
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;