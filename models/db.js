const mongoose = require('mongoose');
mongoose.connect('mongodb://0.0.0.0:27017/Server251')
        .catch((err)=>{
            console.log("Loi ket noi CSDL");
            console.log(err);
        });
module.exports = {mongoose};

