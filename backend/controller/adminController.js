
const User = require('../model/userSchema')


const getuserstats = async(req,res)=>{
   try{
    const user = await User.find().select({password:0})

    res.status(200).json(user)
   }catch(error){
      console.log(error);
      
   }
}


const getUserById= async(req,res)=>{
   try{
      const user= req.params._id
    const data = await User.findOne({_id:id},{password:0})
    res.status(200).json(data)
   }catch(error){
      console.log(error);
      
   }
}

module.exports = {getuserstats,getUserById}