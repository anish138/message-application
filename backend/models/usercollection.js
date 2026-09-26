import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({

   role:{
        type:String,
        required:true
   }

})

const Users = mongoose.model("Users", RoleSchema, "UserDB")

export default Users