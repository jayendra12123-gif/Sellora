const express = require('express');
const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const collectionRoutes = require('./collectionRoutes');
const contentRoutes = require('./contentRoutes');
const searchRoutes = require('./searchRoutes');
const categoryRoutes = require('./categoryRoutes');
const cartRoutes = require('./cartRoutes');
const orderRoutes = require('./orderRoutes');
const addressRoutes = require('./addressRoutes');
const preferenceRoutes = require('./preferenceRoutes');
const favoriteRoutes = require('./favoriteRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

router.use('/', healthRoutes);
router.use('/', authRoutes);
router.use('/', productRoutes);
router.use('/', collectionRoutes);
router.use('/', contentRoutes);
router.use('/', searchRoutes);
router.use('/', categoryRoutes);
router.use('/', cartRoutes);
router.use('/', orderRoutes);
router.use('/', addressRoutes);
router.use('/', preferenceRoutes);
router.use('/', favoriteRoutes);
router.use('/', adminRoutes);

module.exports = router;
