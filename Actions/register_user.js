const user = require('../model/user_model');
async function register(userData){
    const newUser = new user({
        userName: userData.userName,
        name: userData.name,
        lastName: userData.lastName,
        password: userData.password,
        role: userData.role,
        
    });
    
    return await newUser.save();

}
module.exports = {register};