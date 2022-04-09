const nodemailer = require("nodemailer");


const transpoter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : "nodealien003@gmail.com",
        pass : "eyru uvde nudp vdct"
    }
})

const userMail = (email)=>{

    const mailOption = {
    from : "nodealien003@gmail.com",
    to : email ,// "nodealien003@gmail.com"
    subject : "Practice on Nodemailer",
    text : "Hello from nodemaile npm modules"

}
transpoter.sendMail(mailOption, (error, mailData) =>{
    if(error){
        console.log(error);
    }else{
        console.log(mailData);
        
    }
})

}


module.exports = userMail ;