// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: {type:String, required:true},
//   email: { type: String, unique: true ,required:true},
//   password:{type:String, required:true},
//   role: { type: String, enum: ['user', 'admin'], default: 'user', 
//   active: { type: Boolean, default: true },  
//   lastLogin: { type: Date , default:null},
//   required:true },
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);



const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  active: { type: Boolean, default: true },
  lastLogin: { type: Date, default: null },
  profileImage: { type: String, default: '' }, // ✅ Add this line
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
