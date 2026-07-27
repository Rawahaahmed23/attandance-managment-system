const mongoose =require('mongoose')



const URI = process.env.MONGO_URI




const connecdb = async()=>{
    try{
      await mongoose.connect(URI)
    }catch(error){
      console.log(error);
      
    }

}


module.exports = connecdb