const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');

// @route   POST api/hospitals
// @desc    Add a new hospital
// @access  Public
router.post('/', async (req, res) => {
  try {
    const newHospital = new Hospital(req.body);
    const hospital = await newHospital.save();
    res.json(hospital);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/hospitals
// @desc    Get all hospitals
// @access  Public
router.get('/', async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/hospitals/:id
// @desc    Get hospital by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
      const hospital = await Hospital.findById(req.params.id);
      if (!hospital) {
        return res.status(404).json({ msg: 'Hospital not found' });
      }
      res.json(hospital);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Hospital not found' });
      }
      res.status(500).send('Server Error');
    }
  });

module.exports = router;