const express = require('express');
const router = express.Router();
const Courses = require('../models/courses');
const ensureAuthenticated = require('../helpers/auth');

router.get('/addCourses' ,  ensureAuthenticated, (req, res) => {
    res.render('courses/addCourses');
    });

router.get('/listCourses',  ensureAuthenticated, (req, res) => {
    Courses.findAll({
        where: { userId: req.user.id },
        raw: true
    })
        .then((courses) => {
            // pass object to listVideos.handlebar
            res.render('courses/listCourses', { courses});
        })
        .catch(err => console.log(err));
});

router.post('/addCourses', (req, res) => {
    let title = req.body.title;
    let description = req.body.description.slice(0, 1999);
    let userId = req.user.id;

    Courses.create(
        { title, description, price, userId }
        )
        .then((courses) => {
            console.log(courses.toJSON());
            res.redirect('/courses/listCourses');
        })
        .catch(err => console.log(err))
});

router.post('/editCourses/:id', ensureAuthenticated, (req, res) => {
    let title = req.body.title;
    let description = req.body.description.slice(0, 1999);
    let price = req.body.price;
    
    Courses.update(
        { title, description, price },
        { where: { id: req.params.id } }
    )
    .then((result) => {
        console.log(result[0] + ' course updated');
        res.redirect('/courses/listCourses');
    })
    .catch(err => console.log(err));
});

module.exports = router;