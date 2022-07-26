const express = require('express');
const router = express.Router();
const moment = require('moment');
const Product = require('../models/Product');
const flashMessage = require('../helpers/messenger');