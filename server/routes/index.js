const express = require('express');

const authRoutes = require('../routes/auth.routes');
const userRoutes = require('./user.route');
const userCateRoutes = require('./user-category.route');
const verificationRoutes = require('./verification.route');
const savePropRoutes = require('./saved-property.route');
const propertyRoutes = require('./property.route');
const categoryRoutes = require('./category.route');
const agencyProfileRoutes = require('./agency-profile.route');

const router = express.Router();

/** GET /health-check - Check service health */
router.get("/health-check", (req, res) => res.send("We Good"));

//mount auth routes
router.use('/auth', authRoutes);

//mount users routes
router.use('/users', userRoutes);

//mount user-category routes
router.use('/user-category', userCateRoutes);

//mount verify-email route
router.use('/verify-email', verificationRoutes);

//mount save-property routes
router.use('/save-property', savePropRoutes);

//mount property routes
router.use('/property', propertyRoutes);

//mount category routes
router.use('/category', categoryRoutes);

//mount agency-profilr routes
router.use('/agency-profile', agencyProfileRoutes);

module.exports = router;