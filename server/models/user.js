import mongoose from "mongoose";

const userschema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  userID: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isverified: {
    type: Boolean,
    default: false
  },
  resetpasswordtoken: String,
  resetpasswordexpires: Date,
  verificationtoken: String,
  verificationtokenexpiresat: Date,

  friendlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // ✅ Correct
    }
  ],
  sentRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // ✅ Correct
    }
  ],
  receivedRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // ✅ Correct
    }
  ],
  profilepicture:{
    type:String,
    default:""
  },
  profilepicturepublicid:{
    type:String,
    default:""
  },
  bio:{
    type:String,
    default:""
  },
  posts:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ],
  likedposts:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ],

});

export const User = mongoose.model("User", userschema);
