const express = require('express');
const { createUser, loginUser, logout, deleteUser, updateUser, AllUser, UserById } = require('../controller/UserController');
const router = express.Router();
const { isAuth } = require('../middleware/Auth');

router.post('/create', createUser);  //for create User
router.post('/login', loginUser);    //for Login User
router.get('/verify', isAuth); //for verify token in react when we login we use this to create Protected Routes

router.delete('/delete/:id', isAuth, deleteUser);  //For Delete User
router.put('/update/:id', isAuth, updateUser);  //for Update User
router.post('/logout', logout);    //for Login User
router.get('/getAll', isAuth, AllUser) //for get All Users Data 
router.get('/id/:id', isAuth, UserById) // for specific user Data


module.exports = router;