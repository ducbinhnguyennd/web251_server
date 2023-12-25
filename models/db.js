const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://ducbinhnguyennd:ducbinhnguyennd@cluster0.geuahvt.mongodb.net/qlbanhang?retryWrites=true&w=majority')
        .catch((err)=>{
            console.log("Loi ket noi CSDL");
            console.log(err);
        });
module.exports = {mongoose};

