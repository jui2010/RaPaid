const router = require('express').Router()
const jwt = require('jsonwebtoken')
let User = require('../models/userModel')

//get details of a single user, using their username 
router.route('/:username').get((req, res) => {
    User.find({username : req.params.username})
        .then(userArray => {
            userArray.forEach(user => {
                res.json(user)
            });
        })
        .catch(err => res.status(400).json({ error : err}))
})

//signup a user
router.route('/signup').post((req, res) => {
    const username = req.body.username
    const password = req.body.password
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email

    const newUser = new User({username, password, firstName, lastName, email})

    newUser.save()
        .then(() => res.json(newUser))
        .catch(err => res.status(400).json({ error : err}))
})


//login a user
router.route('/login').post((req, res) => {

    User.find({username : req.body.username})
        .then(userArray => {
            userArray.forEach(user => {
                if(user.password === req.body.password ){
                    // create and assign jwt token
                    const token = jwt.sign({_id : user._id }, process.env.TOKEN_SECRET)
                    res.header('authorization', token).json(token)
                }
            });
        })
        .catch(err => res.status(400).json({ error : err}))
})

module.exports = router