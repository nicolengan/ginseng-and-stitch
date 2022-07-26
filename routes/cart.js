const express = require('express');
const router = express.Router();
const ensureAuthenticated = require("../helpers/auth");
const Booking = require('../models/Booking');
const Classes = require('../models/Class');
const Bookings = require('../models/Booking');
const path = require('path');
const shopController = require('../controllers/shop');

router.get('/', shopController.getAllProducts);

router.get('/classes/:id', shopController.getProductDetail);

