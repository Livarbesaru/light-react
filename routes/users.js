const express = require('express')
const router = express.Router();

router.get('/',(req,res)=>{
    res.send("we")
})
router.post('/',(req,res)=>{
    console.log(req.body.name)
    res.send("created")
})
router.get("/new",(req,res)=>{
    res.render("newUser")
})

router
    .route("/:id")
    .get((req,res)=>{
        res.send(`Get user with id:${req.params.id}`)
    }).put((req,res)=>{
        res.send(`Get user with id:${req.params.id}`)
    }).delete((req,res)=>{
        res.send(`Get user with id:${req.params.id}`)
    })

const users = [{name:"John"},{name:"God"}]
router.param("id",(req,res,next,id)=>{
    console.log(id);
    next()
})

module.exports = router;