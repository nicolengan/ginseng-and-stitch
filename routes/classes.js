const express = require('express');
const router = express.Router(); 
const moment = require('moment');
const Classes = require('../models/Classes');
const Course = require('../models/Course');
const ensureAuthenticated = require('../helpers/auth');
const flashMessage = require('../helpers/messenger');

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin'; // set your layout here
    next(); // pass control to the next handler
});

// router.get('/', (req, res) => {
//     Class.findAll({
//         where: { courseId: req.course.id },
//         raw: true
//     })
//         .then((classes) => {
//             res.render('classes', { classes});
//         })
//         .catch(err => console.log(err));
// });

// router.get('/listClasses', ensureAuthenticated, async (req, res) => {
//     Classes.findAll({
//         raw: true
//     })
//         .then((classes) => {
//             res.render('classes/listClasses', { classes });
//         })
//         .catch(err => console.log(err));
//     // const Courses  = await Course.findAll({
//     //     include: { model: Classes, as: 'Classes' }
//     //   });
// }
// );

router.get('/listClasses', ensureAuthenticated, async (req, res) => {
    const classes = await Classes.findAll({ include: { model: Course}
    });
    res.render('classes/listClasses', { classes });
});

// let id = req.params.id;
// const classes  = await Classes.findAll({include: Course});
// const Courses  = await Course.findAll({ include: { model: Classes, as: 'Classes' });
// const courses = await Course.findByPk(id, { attributes: ['title', 'description', 'price', 'level'] });
// res.render('classes/listClasses');

router.get('/addClasses', ensureAuthenticated, (req, res) => {
    res.render('classes/addClasses');
});

router.post('/addClasses', ensureAuthenticated, (req, res) => {
    // let time = req.body.time;
    let date = req.body.date;
    let class_no = req.body.class_no;
    let pax = req.body.pax;
    let max_pax = req.body.max_pax;

    Classes.create(
        { date, class_no, pax, max_pax }
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
            // if (req.user.id != classes.userId) {
            //     flashMessage(res, 'error', 'Unauthorized access');
            //     res.redirect('/classes/listClasses');
            //     return;
            // }

            res.render('classes/editClasses', { classes });
        })
        .catch(err => console.log(err));
});

router.post('/editClasses/:id', ensureAuthenticated, (req, res) => {
    // let time = req.body.time;
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
        // if (req.user.id != classes.userId) {
        //     flashMessage(res, 'error', 'Unauthorized access');
        //     res.redirect('/classes/listClasses');
        //     return;
        // }
        let result = await Class.destroy({ where: { id: classes.id } });
        console.log(result + ' classes deleted');
        res.redirect('/classes/listClasses');
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;