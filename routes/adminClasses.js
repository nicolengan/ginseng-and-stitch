const express = require('express');
const router = express.Router(); 
const moment = require('moment');
const Classes = require('../models/Class');
const Course = require('../models/Course');
const ensureAuthenticated = require('../helpers/auth');
const flashMessage = require('../helpers/messenger');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin'; // set your layout here
    next(); // pass control to the next handler
});

router.get('/', (req, res) => {
    Classes.findAll({
        // where: { userId: req.user.id },
        raw: true
    })
        .then((classes) => {
            // pass object to listVideos.handlebar
            res.render('admin/classes/listClasses', { classes });
        })
        .catch(err => console.log(err));
});

router.get('/listClasses', ensureAuthenticated, async (req, res) => {
    const classes = await Classes.findAll({ include: { model: Course}
    });
    res.render('classes/listClasses', { classes });
});

router.get('/addClasses', ensureAuthenticated, (req, res) => {
    res.render('admin/classes/addClasses');
});

router.post('/addClasses', ensureAuthenticated, (req, res) => {
    let date = req.body.date;
    let class_no = req.body.class_no;
    let pax = req.body.pax;
    let max_pax = req.body.max_pax;
    // Use Video.create({}) to insert a record into the classes table, using the current course's courseId which is retrieved from req.course.id.
    let courseId = req.course.id;

    Classes.create(
        { date, class_no, pax, max_pax, courseId}
    )
        .then((classes) => {
            console.log(classes.toJSON());
            res.redirect('admin/classes/listClasses');
        })
        .catch(err => console.log(err))
});

router.get('/editClasses/:id', ensureAuthenticated, (req, res) => {
    Classes.findByPk(req.params.id)
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
        { date, class_no, pax, max_pax },
        { where: { id: req.params.id } }
    )
        .then((result) => {
            console.log(result[0] + ' classes updated');
            res.redirect('/classes/listClasses');
        })
        .catch(err => console.log(err));
});

router.get('/deleteClasses/:id', ensureAuthenticated, async function (req, res) {
    try {
        let classes = await Class.findByPk(req.params.id);
        if (!classes) {
            flashMessage(res, 'error', 'Classes not found');
            res.redirect('/classes/listClasses');
            return;
        }
        let result = await Class.destroy({ where: { id: classes.id } });
        console.log(result + ' classes deleted');
        res.redirect('/classes/listClasses');
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;