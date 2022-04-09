const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
//const secret_key = "thisisshaktianiyaliyafromsurendtanagadfdjsduofi";
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
    userId : {
        type : Number,
        

    },
    name : {
        type : String,
        required : true,

    },
    email : {
        type : String,
        require : true,
        unique : [true,"Email id is already exist..."],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error
            }
        }

    },
    password : {
        type : String,
        required : true
    },
    dob : {
        type : Date,
        require : true
    },
    isAdmin : {
        type : Boolean,
        require : true
    },
    createdAt : {
        type : Date,
        default : Date.now()
    },
    updatedAt : {
        type : Date,
        default : Date.now()
    },
    image : {
        data : Buffer,
        contentType : String,
        path : String,
        

    },
    tokens: [{
        token: {
            type : String,
            required : true

        }
    }]

})



userSchema.methods.tokenGenerate = async function (){
    try {
      
        const token = await jwt.sign({_id: this._id.toString()},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token ; 

    } catch (error) {
        console.log(error)
    }

}

userSchema.pre("save",async function(next){
    
    if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password,10);
    }

    next();
})

userSchema.pre("updateOne",async function(next){
    try {
        if(this._update.$set.password){
            this._update.$set.password = await bcrypt.hash(this._update.$set.password, 10);
        }

        next();
        
    } catch (error) {
        res.send(error);
    }
    
})



const UserData = new mongoose.model("user", userSchema);

module.exports = UserData ;