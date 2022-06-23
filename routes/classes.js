const express = require('express');
const router = express.Router(); 
const Classes = require('../models/Classes');
const ensureAuthenticated = require('../helpers/auth');
const flashMessage = require('../helpers/messenger');

router.get('/listClasses', ensureAuthenticated, (req, res) => {
    Classes.findAll({
        where: { userId: req.user.id },
        raw: true
    })
        .then((classes) => {
            res.render('classes/listClasses', { classes });
        })
        .catch(err => console.log(err));
});

// router.get('/listClasses', (req, res) => {
//     res.render('classes/listClasses')
// });

router.get('/addClasses', ensureAuthenticated, (req, res) => {
    res.render('classes/addClasses');
});

router.post('/addClasses', ensureAuthenticated, async function (req,res) {
    let { class_id,course_id,user_id,instructor_id,name,difficulty,time,date,class_no,pax } = req.body;
    try{
        await Classes.create({
            class_id: req.body.class_id,
            course_id: req.body.course_id,
            instructor_id: req.body.instructor_id,
            name: req.body.name,
            difficulty: req.body.difficulty,
            time: req.body.time,
            date: req.body.date,
            class_no: req.body.class_no,
            pax: req.body.pax
          });
          flashMessage(res,"success",'Classes Added Successfully');
          res.redirect("/addClasses")
          
    }catch(e){
         console.log(e)
         res.redirect("/addClasses")
    }
})
 
router.get('/editClasses', ensureAuthenticated, (req, res) => {
    res.render('classes/editClasses');
});

module.exports = router;