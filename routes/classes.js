const express = require('express');
const router = express.Router(); 
const moment = require('moment');
const Classes = require('../models/Classes');
const ensureAuthenticated = require('../helpers/auth');
const flashMessage = require('../helpers/messenger');

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

// router.post('/addClasses', ensureAuthenticated, async function (req,res) {
//     let { class_id,course_id,user_id,instructor_id,name,difficulty,time,date,class_no,pax } = req.body;
//     try{
//         await Classes.create({
//             class_id: req.body.class_id,
//             course_id: req.body.course_id,
//             instructor_id: req.body.instructor_id,
//             name: req.body.name,
//             difficulty: req.body.difficulty,
//             time: req.body.time,
//             date: req.body.date,
//             class_no: req.body.class_no,
//             pax: req.body.pax
//           });
//           flashMessage(res,'success', 'Classes Added Successfully');
//           res.redirect("/listClasses")
          
//     }catch(e){
//          console.log(e)
//          res.redirect("/listClasses")
//     }
// })

router.post('/addClasses', ensureAuthenticated, (req, res) => {
    let course_id = req.body.course_id;
    let instructor_id = req.body.instructor_id;
    let name = req.body.name.toString();
    let difficulty = req.body.difficulty.toString();
    let time = req.body.time;
    let dateClasses = moment(req.body.dateClasses, 'dd/mm/yyyy');
    let class_no = req.body.class_no;
    let pax = req.body.pax;
    let userId = req.user.id;

    Classes.create(
        { course_id, instructor_id, name, difficulty, time, dateClasses, class_no, pax, userId }
    )
        .then((classes) => {
            console.log(classes.toJSON());
            res.redirect('/classes/listClasses');
        })
        .catch(err => console.log(err))
});

 
// router.get('/editClasses', ensureAuthenticated, (req, res) => {
//     res.render('classes/editClasses');
// });

router.get('/editClasses/:id', ensureAuthenticated, (req, res) => {
    Classes.findByPk(req.params.id)
        .then((classes) => {
            if (!classes) {
                flashMessage(res, 'error', 'Classes not found');
                res.redirect('/classes/listClasses');
                return;
            }
            if (req.user.id != classes.userId) {
                flashMessage(res, 'error', 'Unauthorised access');
                res.redirect('/classes/listClasses');
                return;
            }

            res.render('classes/editClasses', { classes });
        })
        .catch(err => console.log(err));
});

router.post('/editClasses/:id', ensureAuthenticated, (req, res) => {
       let course_id = req.body.course_id;
       let instructor_id = req.body.instructor_id;
       let name = req.body.name.toString();
       let difficulty = req.body.difficulty.toString();
       let time = req.body.name.time();
       let dateClasses = moment(req.body.dateClasses, 'dd/mm/yyyy');
       let class_no = req.body.class_no;
       let pax = req.body.pax;

    Classes.update(
        { course_id, instructor_id, name, difficulty, time, dateClasses, class_no, pax },
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
            flashMessage(res, 'error', 'Unauthorised access');
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