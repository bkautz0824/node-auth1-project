// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const bcrypt = require('bcryptjs')

const express = require('express')

const Users = require('../users/users-model')

const router = express.Router()

const {checkPasswordLength, checkUsernameExists, checkUsernameFree, restricted} = require('../auth/auth-middleware')
/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */

  router.post('/register', checkPasswordLength, checkUsernameFree , async (req, res, next) => {
    const { username, password } = req.body

    const hash = bcrypt.hash(password, 8)
    const result = await Users.add({ username: username, password: hash})

    res.status(201).json({ message: `You are registered, ${username}`})
  });


/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */

  router.post('/login',checkPasswordLength, async (req, res, next) => {
    try{ 
    const { username, password } = req.body;

    const result = await Users.findBy({ username: username }).first();

    if(result == null || !bcrypt.compareSync(password, result.passowrd)){
      res.status(401).json({ message: 'Invalid credentials'});
      return;
    } 

    res.json({ message: `Welcome ${username}!`})
  } catch(err){
    next(err)
  }
  })


/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

 
// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router