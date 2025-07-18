const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const CertificateValidation = require('../models/CertificateValidation');
const crypto = require('crypto');

// @route   POST api/certificates
// @desc    Issue a new certificate
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { studentId, programId, grade, finalScore } = req.body;
    
    // Generate digital signature and QR code
    const digitalSignature = crypto.randomBytes(32).toString('hex');
    const qrCode = `CERT-${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
    
    const newCertificate = new Certificate({
      studentId,
      programId,
      grade,
      finalScore,
      digitalSignature,
      qrCode
    });
    
    const certificate = await newCertificate.save();
    await certificate.populate(['studentId', 'programId']);
    
    res.json(certificate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/certificates
// @desc    Get all certificates
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { studentId, programId, isValid } = req.query;
    let filter = {};
    
    if (studentId) filter.studentId = studentId;
    if (programId) filter.programId = programId;
    if (isValid !== undefined) filter.isValid = isValid === 'true';
    
    const certificates = await Certificate.find(filter)
      .populate(['studentId', 'programId'])
      .sort({ issueDate: -1 });
    
    res.json(certificates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/certificates/:id
// @desc    Get certificate by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate(['studentId', 'programId']);
    
    if (!certificate) {
      return res.status(404).json({ msg: 'Certificate not found' });
    }
    
    res.json(certificate);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Certificate not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/certificates/validate/:certificateNumber
// @desc    Validate certificate by certificate number
// @access  Public
router.get('/validate/:certificateNumber', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ 
      certificateNumber: req.params.certificateNumber 
    }).populate(['studentId', 'programId']);
    
    if (!certificate) {
      return res.status(404).json({ 
        valid: false, 
        message: 'Certificate not found' 
      });
    }
    
    // Determine validation result
    let validationResult = 'Valid';
    let message = 'Certificate is valid';
    
    if (certificate.revokedAt) {
      validationResult = 'Revoked';
      message = `Certificate was revoked on ${certificate.revokedAt}. Reason: ${certificate.revokeReason}`;
    } else if (certificate.expiryDate && certificate.expiryDate < new Date()) {
      validationResult = 'Expired';
      message = `Certificate expired on ${certificate.expiryDate}`;
    } else if (!certificate.isValid) {
      validationResult = 'Invalid';
      message = 'Certificate is marked as invalid';
    }
    
    // Increment validation count
    await Certificate.findByIdAndUpdate(certificate._id, {
      $inc: { validationCount: 1 }
    });
    
    res.json({
      valid: validationResult === 'Valid',
      validationResult,
      message,
      certificate: {
        certificateNumber: certificate.certificateNumber,
        studentName: certificate.studentId.fullName,
        programName: certificate.programId.programName,
        issueDate: certificate.issueDate,
        grade: certificate.grade,
        finalScore: certificate.finalScore,
        validationCount: certificate.validationCount + 1
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/certificates/validate/:certificateNumber/log
// @desc    Log certificate validation attempt
// @access  Public
router.post('/validate/:certificateNumber/log', async (req, res) => {
  try {
    const { validatorName, validatorEmail, validatorOrganization, validationPurpose, additionalNotes } = req.body;
    
    const certificate = await Certificate.findOne({ 
      certificateNumber: req.params.certificateNumber 
    });
    
    if (!certificate) {
      return res.status(404).json({ msg: 'Certificate not found' });
    }
    
    // Determine validation result
    let validationResult = 'Valid';
    if (certificate.revokedAt) {
      validationResult = 'Revoked';
    } else if (certificate.expiryDate && certificate.expiryDate < new Date()) {
      validationResult = 'Expired';
    } else if (!certificate.isValid) {
      validationResult = 'Invalid';
    }
    
    const validation = new CertificateValidation({
      certificateId: certificate._id,
      validatorName,
      validatorEmail,
      validatorOrganization,
      validationPurpose,
      validationResult,
      additionalNotes,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent') || 'Unknown'
    });
    
    await validation.save();
    
    // Increment validation count
    await Certificate.findByIdAndUpdate(certificate._id, {
      $inc: { validationCount: 1 }
    });
    
    res.json({
      message: 'Validation logged successfully',
      validationResult,
      validationId: validation._id
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/certificates/:id/validations
// @desc    Get all validation logs for a certificate
// @access  Public
router.get('/:id/validations', async (req, res) => {
  try {
    const validations = await CertificateValidation.find({
      certificateId: req.params.id
    }).sort({ validationDate: -1 });
    
    res.json(validations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/certificates/:id/revoke
// @desc    Revoke a certificate
// @access  Public
router.put('/:id/revoke', async (req, res) => {
  try {
    const { revokedBy, revokeReason } = req.body;
    
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      {
        revokedAt: new Date(),
        revokedBy,
        revokeReason,
        isValid: false
      },
      { new: true }
    ).populate(['studentId', 'programId']);
    
    if (!certificate) {
      return res.status(404).json({ msg: 'Certificate not found' });
    }
    
    res.json({
      message: 'Certificate revoked successfully',
      certificate
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;