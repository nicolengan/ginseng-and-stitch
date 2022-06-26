const express = require('express');
const router = express.Router();
const Courses = require('../models/courses');
const ensureAuthenticated = require('../helpers/auth');
const User = require('../models/User');
const isAdmin = require('../helpers/admin');


router.get('/', (req, res) => {
    Courses.findAll({
        // where: { userId: req.user.id },
        raw: true
    })
        .then((courses) => {
            // pass object to listVideos.handlebar
            res.render('courses', { courses});
        })
        .catch(err => console.log(err));
});

router.get('/addCourses' ,  ensureAuthenticated, isAdmin, (req, res) => {
    res.render('courses/addCourses');
});

router.get('/listCourses',  ensureAuthenticated, isAdmin , (req, res) => {
    Courses.findAll({
        // where: { userId: req.user.id },
        raw: true
    })
        .then((courses) => {
            // pass object to listVideos.handlebar
            res.render('courses/listCourses', { courses});
        })
        .catch(err => console.log(err));
});

router.post('/addCourses', ensureAuthenticated, isAdmin, (req, res) => {
    let title = req.body.title;
    let Description = req.body.description.slice(0, 1999);
    let uuid = req.body.uuid;
    let price = req.body.price;

    Courses.create(
        { title, uuid , Description, price }
        )
        .then((courses) => {
            console.log(courses.toJSON());
            res.redirect('/courses/listCourses');
        })
        .catch(err => console.log(err))
});

router.get('/editCourses/:id', ensureAuthenticated, isAdmin, (req, res) => {
    Courses.findOne({
        where: { uuid: req.params.id },
        raw: true
    })
    .then((course) =>{
        res.render("course/editCourse",  {course});
    })
    .catch(err => console.log(err));
});



router.post('/editCourses/:id', ensureAuthenticated, isAdmin, (req, res) => {
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