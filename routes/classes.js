const express = require('express');
const router = express.Router(); 
const moment = require('moment');
const Classes = require('../models/Class');
const ensureAuthenticated = require('../helpers/auth');
const flashMessage = require('../helpers/messenger');

router.get('/', (req, res) => {
    Classes.findAll({
        where: { userId: req.user.id },
        raw: true
    })
        .then((classes) => {
            // pass object to listVideos.handlebar
            res.render('classes', { classes});
        })
        .catch(err => console.log(err));
});

router.get('/listClasses', ensureAuthenticated, (req, res) => {
    Classes.findAll({
        where: { userId: req.user.id },
        // order: [['dateClasses', 'ASC']],
        raw: true
    })
        .then((classes) => {
            res.render('classes/listClasses', { classes });
        })
        .catch(err => console.log(err));
});

router.get('/addClasses', ensureAuthenticated, (req, res) => {
    res.render('classes/addClasses');
});

router.post('/addClasses', ensureAuthenticated, (req, res) => {
    let course_id = req.body.course_id;
    let course_name = req.body.course_name.toString();
    let course_difficulty = req.body.course_difficulty.toString();
    let course_price = req.body.course_price;
    let time = req.body.time;
    let date = req.body.date;
    let class_no = req.body.class_no;
    let pax = req.body.pax;

    Classes.create(
        { course_id, course_name, course_difficulty, course_price, time, date, class_no, pax}
    )
        .then((classes) => {
            console.log(classes.toJSON());
            res.redirect('/classes/listClasses');
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
            if (req.user.id != classes.userId) {
                flashMessage(res, 'error', 'Unauthorized access');
                res.redirect('/classes/listClasses');
                return;
            }

            res.render('classes/editClasses', { classes });
        })
        .catch(err => console.log(err));
});

router.post('/editClasses/:id', ensureAuthenticated, (req, res) => {
    let course_id = req.body.course_id;
    let course_name = req.body.course_name;
    let course_difficulty = req.body.course_difficulty;
    let course_price = req.body.course_price;
    let time = req.body.time;
    let date = req.body.date;
    let class_no = req.body.class_no;
    let pax = req.body.pax;

    Classes.update(
        { course_id, course_name, course_difficulty, course_price, time, date, class_no, pax},
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
        let classes = await Classes.findByPk(req.params.id);
        if (!classes) {
            flashMessage(res, 'error', 'Classes not found');
            res.redirect('/classes/listClasses');
            return;
        }
        if (req.user.id != classes.userId) {
            flashMessage(res, 'error', 'Unauthorized access');
            res.redirect('/classes/listClasses');
            return;
        }

        let result = await Classes.destroy({ where: { id: classes.id } });
        console.log(result + ' classes deleted');
        res.redirect('/classes/listClasses');
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;