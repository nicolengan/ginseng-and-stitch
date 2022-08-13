const express = require('express');
const router = express.Router();
const Courses = require('../models/Course');
const ensureAuthenticated = require('../helpers/auth');
const User = require('../models/User');
const Review = require('../models/Review');
const isAdmin = require('../helpers/admin');
const {clampnumber} = require('../helpers/validate');
const Booking = require('../models/Booking');


router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin'; // set your layout here
    next(); // pass control to the next handler
});

router.get('/', (req, res) => {
    Courses.findAll({
        // where: { userId: req.user.id },
        raw: true
    })
        .then((courses) => {
            // pass object to listVideos.handlebar
            res.render('courses', { courses, Review });
        })
        .catch(err => console.log(err));
});

router.get('/api/list', async (req, res) => {
    return res.json({
        total: await Review.count(),
        rows: await Review.findOne({
            include: [
                { model: Review },
                { model: User },
            ]
        })
    })
});


router.get('/addCourses' ,  ensureAuthenticated, isAdmin, (req, res) => {
    res.render('courses/addCourses');
});

router.get('/listCourses', ensureAuthenticated, isAdmin, async (req, res) => {
    const courses = await Courses.findAll({
        include: [
            { model: Review },
            { model: Booking }
        ]
    });
    res.render('courses/listCourses', { courses});
});

router.post('/addCourses', ensureAuthenticated, isAdmin, (req, res) => {
    let title = req.body.title;
    let description = req.body.description.slice(0, 1999);
    let price = clampnumber (req.body.price, -2147483647, 2147483647);
    let level = req.body.level;
    let coursePic = req.body.coursePic;

    Courses.create(
        { title, description, price, level, coursePic }
        )
        .then((courses) => {
            console.log(courses.toJSON());
            res.redirect('/courses/listCourses');
        })
        .catch(err => console.log(err))
});

router.get('/editCourses/:id', ensureAuthenticated, isAdmin, (req, res) => {
    Courses.findOne({
        where: { id: req.params.id },
        raw: true
    })
    .then((course) =>{
        console.log(course)
        if (course == null){
            res.redirect("/courses/listCourses");
        }
        else{
            res.render("courses/editCourses",  {course});
        }
    })

    .catch(err => console.log(err));
});



router.post('/editCourses/:id', ensureAuthenticated, isAdmin, (req, res) => {
    let title = req.body.title;
    let description = req.body.description.slice(0, 1999);
    let price = clampnumber (req.body.price, -2147483647, 2147483647);
    let level = req.body.level;
    let coursePic = req.body.coursePic;
    console.log('im gnna end it all period');
    
    Courses.update(
        { title, description, price, level, coursePic},
        { where: { id: req.params.id } }
    )
        .then((result) => {
            console.log(result[0] + ' course updated');
            res.redirect('/courses/listCourses');
        })
        .catch(err => console.log(err));
});

router.get('/deleteCourses/:id', ensureAuthenticated, async function (req, res) {
    try {
        let courses = await Courses.findByPk(req.params.id);
        if (!courses) {
            flashMessage(res, 'error', 'Courses not found');
            res.redirect('/courses/listCourses');
            return;
        }
        // if (req.user.id != courses.id) {
        //     flashMessage(res, 'error', 'Unauthorised access');
        //     res.redirect('/courses/listCourses');
        //     return;
        // }

        let result = await Courses.destroy({ where: { id: courses.id } });
        console.log(result + ' courses deleted');
        res.redirect('/courses/listCourses');
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;
