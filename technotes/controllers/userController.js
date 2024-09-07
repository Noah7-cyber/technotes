const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler');
const bcrypt =require('bcrypt');

const getAllUsers =asyncHandler( async(req, res)=>{
    const users = await User.find().select("password").lean();
    if(!users?.length){
        return res.status(400).json({messsage:'No Users found'});
    }
    res.json(users);
})
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body;

    // Confirm data
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec();
    console.log(duplicate)
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate Username' });
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10);
    const userObject = { username, password: hashedPwd, roles };

    // Store
    const user = await User.create(userObject);
    if (user) {
        res.status(201).json({ message: `New user ${username} created` });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
});
const updateUser =asyncHandler( async(req, res)=>{
    const {id, username, roles, active, password} = req.body;
    //confirm data
    if(!id || !username ||!Array.isArray(roles) ||!roles.length || typeof active !=='boolean'){
        return res.status(400).json({message:'All feilds are required'});
    }
    const user = await User.findById(id).exec();
    if(!user){
        return res.status(400).json({message: 'User not found'});
    }
    //check for duplicate
    const duplicate = await User.findOne({usernae}).lean().exec();
    if(duplicate && duplicate ?._id.toString() !==id){
        return res.status(409).json({message:'Duplicate username'});
    }

    user.username= username;
    user.roles = roles;
    user.active =active;

    if(password){
        user.password = await bcrypt.hash(password, 10);
    }
    
    const updatedUser = await user.save();
    res.json({message:`${updatedUser.username} updated`})
})
const deleteUser =asyncHandler( async(req, res)=>{
    const {id} = req.body;
    if(!id){
        return res.status(400).json({message:'User ID Required'})
    }
    const notes = await Note.findOne({user:id}).lean().exec();
    if(notes?.length){
        return res.status(400).json({message:'User has assigned notes'});

    }
    const user = await User.findById(id).exec();
    if(!user){
        return res.status(400).json({message:'User not found'})
       const result = await user.deleteOne();

       const reply =`Username ${result.username} with ID ${result._id} deleted`;
       res.json(reply)
    }
})
module.exports ={
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}