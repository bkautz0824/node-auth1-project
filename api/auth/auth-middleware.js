const Users = require('../users/users-model')

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
  let { username, password} = req.body
  
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  await Users.findById({ username: req.user.username }).first()
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req, res, next) {
  const result = await Users.findById({ username: req.user.username }).first()
  if(result != null){
    next({ status: 400, message: 'username unavailable'})
  }

  next()
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
  let { username, password} = req.body
  if( typeof username != 'string' || username.length() < 3){
    next({ status: 422, message: "Password must be longer than 3 chars"})
    return
  }

  next()
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {restricted, checkUsernameExists, checkPasswordLength, checkUsernameFree}