const express = require('express');
const router = express.Router();
const Courses = require('../models/Course');
const ensureAuthenticated = require('../helpers/auth');
const User = require('../models/User');
const isAdmin = require('../helpers/admin');
const {clampnumber} = require('../helpers/validate');


router.get('/', (req, res) => {
    Courses.findAll({
        // where: { userId: req.user.id },
        raw: true
    })
        .then((courses) => {
            // pass object to listVideos.handlebar
            res.render('admin/courses/listCourses', { courses});
        })
        .catch(err => console.log(err));
});

router.get('/addCourses' , (req, res) => {
    res.render('admin/courses/addCourses');
});

router.post('/addCourses', (req, res) => {
    let title = req.body.title;
    let Description = req.body.description.slice(0, 1999);
    let uuid = req.body.uuid;
    let price = clampnumber (req.body.price, -2147483647, 2147483647);
    let level = req.body.level;

    Courses.create(
        { title, uuid , Description, price, level  }
        )
        .then((courses) => {
            console.log(courses.toJSON());
            res.redirect('/admin/courses');
        })
        .catch(err => console.log(err))
});

router.get('/editCourses/:id', (req, res) => {
    Courses.findOne({
        where: { id: req.params.id },
        raw: true
    })
    .then((course) =>{
        console.log(course)
        if (course == null){
            res.redirect("/admin/courses");
        }
        else{
            res.render("admin/courses/editCourses",  {course});
        }
    })

    .catch(err => console.log(err));
});



router.post('/editCourses/:id', (req, res) => {
    let title = req.body.title;
    let Description = req.body.description.slice(0, 1999);
    let price = clampnumber (req.body.price, -2147483647, 2147483647);
    let difficulty = req.body.difficulty;
    
    Courses.update(
        { title, Description, price, difficulty },
        { where: { id: req.params.id } }
    )
    .then((result) => {
        console.log(result[0] + ' course updated');
        res.redirect('/admin/courses');
    })
    .catch(err => console.log(err));
});

router.get('/deleteCourses/:id',  async (req, res) => {
    try {
        let courses = await Courses.findByPk(req.params.id);
        if (!courses) {
            flashMessage(res, 'error', 'Courses not found');
            res.redirect('/admin/courses');
            return;
        }
        // if (req.user.id != courses.id) {
        //     flashMessage(res, 'error', 'Unauthorised access');
        //     res.redirect('/courses/listCourses');
        //     return;
        // }

        let result = await Courses.destroy({ where: { id: courses.id } });
        console.log(result + ' courses deleted');
        res.redirect('/admin/courses');
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;