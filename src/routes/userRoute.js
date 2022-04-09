const express = require("express");
const jwt = require("jsonwebtoken");
const UserData = require("../models/userSchema");
const path = require("path");
const bodyparser = require('body-parser');
const userRouter = express.Router();
const fs = require("fs");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const upload = require("../middleware/fileUpload");
const userMail = require("./userMail");


userRouter.use(bodyparser.json())
userRouter.use(bodyparser.urlencoded({extended:false}))
userRouter.use(cookieParser());

//console.log(path.join(__dirname ,"../" )); // It give one directory back


// User Register with image upload
userRouter.post("/profile",upload.single('image'), async(req,res) =>{
    try {
        const img = fs.readFileSync(req.file.path);

        const encode_image = img.toString("base64");

        const obj = {
            userId : req.body.userId,
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            dob : req.body.dob,
            isAdmin : req.body.isAdmin,
             //Define a JSON object for the image
            image : {
                contentType : req.file.mimetype,
                path : req.file.path,
                image : new Buffer.from(encode_image, "base64")
            }
        
        }
        const user  = new UserData(req.body)
        const token = await user.tokenGenerate();
        console.log(`Register Token : ${token}`);

        //Insert the image to database 
        UserData.create(obj ,async(err,item) =>{
            if(err){
                res.status(400).send(err);
            }else{
                const data =await item.save();
                res.send(data)
            }
        })

    } catch (error) {
        console.log(error);
    }
})

// Upload Single file
userRouter.post("/uploadsinglefile", upload.single('myfile'), async(req, res)=>{
    try {
        const myfile = req.file;
        if(!myfile){
            res.send("Please upload file..")
        }else{
            res.send(myfile);
        }
        
    } catch (error) {
        res.send(error);
    }
})

//Upload Multiple files 
userRouter.post("/uploadfile",upload.array('myfile',12),async(req, res) =>{
    try {
        const files = req.files ;

        if(!files){
            res.send("Please upload a file ....")
        }
        res.send(files)

    } catch (error) {
        res.send(error)
    }
})

//Register api
userRouter.post("/auth/register", async (req, res) =>{
    try {
        const user = new UserData(req.body);

        const insertData = await user.save();

        const token = await user.tokenGenerate();
        console.log(token);

       res.cookie("jwt", token, {
           expires : new Date(Date.now() + 60000),
           httpOnly : true
       })

        if(!insertData){
            res.send("Please inserdata")
        }
        res.status(201).send(insertData);
    } catch (error) {
        res.status(400).send(error);
    }
})

//Login Api not protected
userRouter.post("/auth/login", async(req,res) =>{
    try {
        const email = req.body.email
        const password = req.body.password
     
        const findData = await UserData.findOne({email:email})
       // console.log(findData);
        
       const isMatch = await bcrypt.compare(password,findData.password)

        const token = await findData.tokenGenerate();
        console.log(`Login Token :- ${token}`);

        res.cookie("jwt",token , {
            expires : new Date(Date.now() + 50000),
            httpOnly : true
        })

       if(isMatch){
            res.status(201).send(findData);
       }else{
           res.status(404).send("Password is wrong")
       }
        
    } catch (error) {
        res.status(401).send("Invalid login details...")
    }
})

//Login with jwt token protected
userRouter.post("/users", async (req, res) =>{
    try {
        const email = req.body.email
        const data = await UserData.findOne({email:email})
        

        const token = await data.tokenGenerate();// token generate fun call 
       // console.log(`Token : ${token}`);

       res.status(201).send(data)


    } catch (error) {
        res.status(400).send(error);
    }
})

//Forgot Password API
userRouter.post("/auth/forgotpassword", async(req, res) =>{
    try{
        const email = req.body.email;
        userMail(email)
        // const transpoter = nodemailer.createTransport({
        //     service: "gmail",
        //     auth : {
        //         user : "nodealien003@gmail.com",
        //         pass : "eyru uvde nudp vdct"
        //     }
        // })

        // const mailOptions = {
        //     from : "nodealien003@gmail.com",
        //     to : email,
        //     subject : "Testing on nodemaile",
        //     text : `localhost:3000/auth/forgotpasswordconfirm`
        // }

        // const mail = transpoter.sendMail(mailOptions, (error, data) =>{
        //     if(error){
        //         res.send(error);
        //     }else{
        //         res.status(201).send(data);
        //     }
        // })

    }catch(error){
        res.status(400).send(error);
    }
})

userRouter.put("/auth/forgotpasswordconfirm",async(req,res) =>{
    try {
        const user = req.body.email
        const password = req.body.password
        const userEmail = await UserData.findOne({email : user})
        
        //console.log(userEmail);
        if(!userEmail){
            res.send("Email is not found...")
        }else{

        const updateUser = await UserData.updateOne({_id : userEmail._id},{$set :{password: password}})
        console.log(updateUser); 
        res.send("Password change success....")
        
        }
    } catch (error) {
        res.send(error)
    }
})

module.exports = userRouter ;