const user = require('../model/user_model');

async function get_users(query) {
  try {
    
    const filter = {};
    console.log(query);
    
    if (query.role) {
      filter.role = query.role;
    }

    
    if (query.enable) {
      filter.enable = query.enable === 'true';  
    }

    const users = await user.find(filter).select('-password'); 
    console.log(users);
    return { status: 200, body: {users}};
  } catch (error) {
    console.error(error);
    return {
      status: 500, body: {error: 'Error interno del servidor',}};
  }
}

module.exports = { get_users };