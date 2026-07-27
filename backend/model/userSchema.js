// models/Employee.js
const mongoose = require('mongoose');
 const bcrypt = require('bcryptjs')
 var jwt = require('jsonwebtoken');

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['On Time', 'Late', 'Absent'],
    required: true
  },
  checkInTime: {
    type: String, 
    default: null
  },
  checkOutTime: {
    type: String, 
    default: null
  }
});

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
 

    profileImage: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  totalAttendance: {
    type: Number,
    default: 0
  },
  checkInTime: {
    type: String // Format: HH:mm
  },
  checkOutTime: {
    type: String // Format: HH:mm
  },
password: {
  type: String,
  required: true,

},
checkInLimit: {
  type: String, 
   required: true,

      
 
},isAdmin:{
  type:Boolean,
  default: false

},
  attendanceHistory: [attendanceSchema]
}, {
  timestamps: true
});



employeeSchema.pre('save', async function (next) {
  try {
    const user = this;

    if (!user.isModified('password')) {
      return next();
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash; // ✅ Assignment correct kiya

    next();
  } catch (error) {
    console.log(error);
  
  }
});
employeeSchema.methods.comparePassword = async function(password){
    return bcrypt.compare(password,this.password)

}



employeeSchema.methods.generateToken =async function () {
  try{

    return jwt.sign({
      userId: this._id,
      email: this.email,
      isAdmin: this.isAdmin
    },process.env.JWT_SELECT_KEY,{
      expiresIn: '30d'
    }
  
   )

    
  }catch(error){
     console.log(error);
     
  }
  
}

const User = mongoose.model('Employee', employeeSchema);

module.exports = User
