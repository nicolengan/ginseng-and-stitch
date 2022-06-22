const express = require('express');
const router = express.Router(); 

router.get('/listClasses', (req, res) => {
    res.render('classes/listClasses')
});

router.get('/addClasses', (req, res) => {
    res.render('classes/addClasses');
});

router.post('/addClasses', async function (req,res) {
    let { class_id,course_id,user_id,instructor_id,name,difficulty,time,date,class_no,pax } = req.body;
    try{
        await Classes.create({
            class_id: req.body.class_id,
            course_id: req.body.course_id,
            user_id: req.body.user_id,
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
 
router.get('/editClasses', (req, res) => {
    res.render('classes/editClasses');
});

module.exports = router;