const express = require('express');
const {register_controller, login, update_user_controller, delete_use_controller, get_users_controller } = require('../Controller/user_controller')
const router = express.Router();

const { authenticate } = require('../middlewares/authenticate');

router.post('/register' , authenticate, async (req,res) => {
  const { status, body } = await register_controller( req, res);  
  res.status(status).json(body);
}); 

router.post('/login', async (req,res) => {
  const { status, body } = await login({
    body : req.body
  });  
  res.status(status).json(body);
});
router.put('/users/update', authenticate, async (req,res) => {
  const { status, body } = await update_user_controller(req);  
  res.status(status).json(body);
});
router.get('/users/',async (req,res) => {
  const { status, body } = await get_users_controller(req, res);  
  res.status(status).json(body);
});

router.put('/users/delete', authenticate ,async (req,res) => {
  const { status, body } = await delete_use_controller(req);  
  res.status(status).json(body); });
module.exports = router;