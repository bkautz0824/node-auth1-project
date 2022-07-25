const db = require('../../data/db-config')


/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */
function find() {
  return db('users').select('user_id', 'username')
}

/**
  resolves to an ARRAY with all users that match the filter condition
 */
function findBy(filter) {
  return db('users').where(filter)
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
async function findById(user_id) {
  const [id] = await db('users').insert(user_id)

  return findById(id)
}

/**
  resolves to the newly inserted user { user_id, username }
 */
function add(user) {
  return db('users')
  .where({ id })
  .first()
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  find, findBy, findById, add
}