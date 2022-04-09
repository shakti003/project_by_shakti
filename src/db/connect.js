const mongoose = require("mongoose");
// DB name is :- projectByShakti

mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`).then(
    ()=>{
        console.log("Database connected Successfully.....");
    }
).catch((error) =>{
    console.log(error);
});



