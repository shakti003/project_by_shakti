require('dotenv').config();
const express = require("express");
require("./db/connect");

const userRouter = require('./routes/userRoute');
const bodyparser = require("body-parser")
const cron = require("node-cron");

const app = express();

const port = process.env.PORT || 3000 ;

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(bodyparser.urlencoded({extended : true}));
app.use(userRouter);



// const task = cron.schedule( '* * * * * *',()=>{

    
//     console.log(`cron Scheduler running.....`);
// },{
//     timezone : "India"
// }
// )


// //task.start();
// //task.stop();


app.get("/",(req, res) =>{
    console.log("Hello from express side..");
})



app.listen(port ,()=> {
    console.log(`server listening on port number ${port}`);
})