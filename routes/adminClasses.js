const express = require('express');
const router = express.Router(); 
const moment = require('moment');
const Classes = require('../models/Class');
const Course = require('../models/Course');
const ensureAuthenticated = require('../helpers/auth');
const flashMessage = require('../helpers/messenger');

router.get('/', async (req, res) => {
    const classes = await Classes.findAll({ include: { model: Course}
    });
    res.render('admin/classes/listClasses', { classes });
});

router.get('/listClasses', ensureAuthenticated, async (req, res) => {
    const classes = await Classes.findAll({ include: { model: Course}
    });
    res.render('classes/listClasses', { classes });
});

router.get('/api/list', async (req, res) => {
    return res.json({
        total: await Classes.count(),
        rows: await Classes.findAll({include: {model: Course}})
    })
});

router.get('/addClasses', ensureAuthenticated, async (req, res) => {
    const classes = await Classes.findAll({include: {model: Course}});
    const courses = await Course.findAll();
    console.log(res.json({
        total: await Classes.count(),
        rows: await Classes.findAll({include: {model: Course}})
    }))
    console.log(classes)
    res.render('admin/classes/addClasses', { classes, courses });
});

router.post('/addClasses', ensureAuthenticated, (req, res) => {
    // let course_name = req.body.course_name.toString();
    // let course_difficulty = req.body.course_difficulty.toString();
    // let course_price = req.body.course_price;
    // let time = req.body.time;
    let date = req.body.date;
    let class_no = req.body.class_no;
    let pax = req.body.pax;
    let max_pax = req.body.max_pax;
    let CourseId = req.body.CourseId;

    Classes.create(
        { date, pax, max_pax, CourseId}
    )
        .then((classes) => {
            console.log(classes.toJSON());
            res.redirect('/admin/classes');
        })
        .catch(err => console.log(err))
});

router.get('/editClasses/:id', ensureAuthenticated, (req, res) => {
    Classes.findByPk(req.params.id, {include: {model: Course}})
        .then((classes) => {
            if (!classes) {
                flashMessage(res, 'error', 'Classes not found');
                res.redirect('/classes/listClasses');
                return;
            }
            res.render('classes/editClasses', { classes });
        })
        .catch(err => console.log(err));
});

router.post('/editClasses/:id', ensureAuthenticated, (req, res) => {
    let date = req.body.date;
    let class_no = req.body.class_no;
    let pax = req.body.pax;
    let max_pax = req.body.max_pax;

    Classes.update(
        { date, pax, max_pax, course_id}, { where: { id: req.params.id} }
    )
        .then((classes) => {
            console.log(classes.toJSON());
            res.redirect('admin/classes');
        })
        .catch(err => console.log(err));
});

router.get('/deleteClasses/:id', ensureAuthenticated, async function (req, res) {
    try {
        let classes = await Class.findByPk(req.params.id);
        if (!classes) {
            flashMessage(res, 'error', 'Classes not found');
            res.redirect('/admin/classes');
            return;
        }
        // if (req.user.id != classes.userId) {
        //     flashMessage(res, 'error', 'Unauthorized access');
        //     res.redirect('admin/classes');
        //     return;
        // }

        let result = await Classes.destroy({ where: { id: classes.id } });
        console.log(result + ' classes deleted');
        res.redirect('/admin/classes');
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;