const express = require('express');
const {register, login, update_user, delete_user, get_users, get_user, } = require('../Controller/user_controller')
const router = express.Router();
const { validateRole } = require('../middlewares/roleAuth');

router.post('/register' , async (req,res) => {
  const { status, body } = await register({
    body : req.body
  });  
  res.status(status).json(body);
}); 

router.post('/login', async (req,res) => {
  const { status, body } = await login({
    body : req.body
  });  
  res.status(status).json(body);
});
router.get('/user/:id', async (req,res) => {
  const { status, body } = await get_user({
    id : req.params.id,
    
  });  
  res.status(status).json(body);
});
router.get('/users/',async (req,res) => {
  const { status, body } = await get_users({
    querry : req.query
  });  
  res.status(status).json(body);
});
router.put('/updateUser/:id', async (req,res) => {
  const { status, body } = await update_user({
    id : req.params.id,
    body: req.body
  });  
  res.status(status).json(body); });
router.delete('/DeleteUser/:id', async (req,res) => {
  const { status, body } = await update_user({
    id : req.params.id,
    
  });  
  res.status(status).json(body); });