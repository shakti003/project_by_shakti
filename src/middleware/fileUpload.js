const multer = require("multer");
const path = require("path")

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,"src/uploads/files");
    },
    filename : function(req,file,cb){
       cb(null,file.fieldname +"-" + Date.now() + path.extname(file.originalname)) 
        //cb(null, file.originalname)
    },
   
})

const upload = multer({
    storage : storage,
    limits : {fileSize : 1024*1024}// 2MB limit set
    
})

module.exports = upload ;