const express = require('express');
const router = express.Router();
const moment = require('moment');
const Review = require('../models/Review');
const ensureAuthenticated = require('../helpers/auth');
const flashMessage = require('../helpers/messenger');
const fs = require('fs');

const Class  = require('../models/Class');
const User  = require('../models/User');
const Course  = require('../models/Course');


router.get('/', ensureAuthenticated, (req, res) => {
    Review.findAll({
        order: [['updatedAt', 'DESC']],
        raw: true
    })
        .then((review) => {
            res.render('admin/reviews/userreview', { });
        })
        .catch(err => console.log(err));
});

router.get('/api/list', async (req, res) => {
    return res.json({
        total: await Review.count(),
        rows: await Review.findAll({
            include: [
                { model: Course },
                { model: User },
            ]
        })
    })
});


router.get('/userreview', ensureAuthenticated, (req, res) => {
    res.render('admin/reviews/userreview');
});

router.post('/userreview', ensureAuthenticated, (req, res) => {
    let user_name = req.body.user_name;
    let user_email = req.body.user_email;
    let course_title =  req.body.course_title;
    let star_count = req.body.star_count;
    let review = req.body.review;

    Review.create(
        { user_name, user_email, course_title, star_count, review }
    )
        .then((review) => {
            console.log(review.toJSON());
            res.redirect('/admin/userreview');
        })
        .catch(err => console.log(err))
});

router.get('/deletedreview/:id', async function (req, res) {
    try {
        await Review.destroy({ where: { id: req.params.id } })
        .then((result) => {
            console.log(result[0] + ' deleted');
            res.redirect('/admin/reviews');
        })
        .catch(err => console.log(err));
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;
