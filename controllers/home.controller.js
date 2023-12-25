
var myMD = require("../models/sanpham.model");
var fs = require("fs");

exports.home = async (req, res, next) => {
  let list_TL = await myMD.spModel.find();
  res.render("home/index.ejs", { listSP: list_TL });
};
exports.main = async (req, res, next) => {
  let list_TL = await myMD.spModel.find();
  res.render("home/home.ejs", { listSP: list_TL });
};
exports.shop = async (req, res, next) => {
  let list_TL = await myMD.spModel.find();
  res.render("home/shop.ejs", { listSP: list_TL });
};
exports.searchByName = async (req, res, next) => {
  const searchQuery = req.query.search;
  const regex = new RegExp(searchQuery, 'i'); 

  try {
    const searchResults = await myMD.spModel.find({ name: regex });
    res.render('home/home.ejs', { listSP: searchResults });
  } catch (error) {
    console.error(error);
    res.render('home/home.ejs', { listSP: [] }); 
  }
};

exports.add = async (req, res, next) => {
  let msg = "";
  console.log(req.body);
  if (req.method == "POST") {
    let objSP = new myMD.spModel();

    try {
      fs.renameSync(req.file.path, "../public/uploads/" + req.file.originalname);
      msg = "Url ảnh:  http://localhost:3000/uploads/" + req.file.originalname;
      objSP.img = "/uploads/" + req.file.originalname;
    } catch (error) {
      msg = error.message;
    }
    
    objSP.name = req.body.name;
    objSP.noidung = req.body.noidung;
    objSP.price = req.body.price;
    objSP.GPU = req.body.GPU;
    objSP.kichthuocmanhinh = req.body.kichthuocmanhinh;
    objSP.congnghemanhinh = req.body.congnghemanhinh;
    objSP.camerasau = req.body.camerasau;
    objSP.cameratruoc = req.body.cameratruoc;
    objSP.chip = req.body.chip;
    objSP.bonho = req.body.bonho;
    objSP.pin = req.body.pin;
    objSP.hedieuhanh = req.body.hedieuhanh;
    objSP.dophangiai = req.body.dophangiai;
    objSP.tinhnangmanhinh = req.body.tinhnangmanhinh;
    objSP.quayvideo = req.body.quayvideo;
    objSP.tinhnangcamera = req.body.tinhnangcamera;
    objSP.kichthuoc = req.body.kichthuoc;
    objSP.trongluong = req.body.trongluong;
    objSP.congnghesac = req.body.congnghesac;
    objSP.congsac = req.body.congsac;
    objSP.kieumanhinh = req.body.kieumanhinh;
    objSP.tinhnagdacbiet = req.body.tinhnagdacbiet;
    objSP.loai = req.body.loai;

    //ghi vào CSDL
    try {
      let new_sp = await objSP.save();
      console.log(new_sp);
      msg = "Lưu thành công";
    } catch (error) {
      msg = "Error" + error.message();
      console.log(error);
    }
  }
  

  res.send({ message: msg });
};  


//////////

exports.addJson = async (req, res, next) => {
  let msg = "";
  console.log(req.body);
  let objSP = new myMD.spModel();

  if (req.method == "POST") {
    
    objSP.img = req.body.img; 
    objSP.name = req.body.name;
    objSP.noidung = req.body.noidung;
    objSP.price = req.body.price;
    objSP.GPU = req.body.GPU;
    objSP.kichthuocmanhinh = req.body.kichthuocmanhinh;
    objSP.congnghemanhinh = req.body.congnghemanhinh;
    objSP.camerasau = req.body.camerasau;
    objSP.cameratruoc = req.body.cameratruoc;
    objSP.chip = req.body.chip;
    objSP.bonho = req.body.bonho;
    objSP.pin = req.body.pin;
    objSP.hedieuhanh = req.body.hedieuhanh;
    objSP.dophangiai = req.body.dophangiai;
    objSP.tinhnangmanhinh = req.body.tinhnangmanhinh;
    objSP.quayvideo = req.body.quayvideo;
    objSP.tinhnangcamera = req.body.tinhnangcamera;
    objSP.kichthuoc = req.body.kichthuoc;
    objSP.trongluong = req.body.trongluong;
    objSP.congnghesac = req.body.congnghesac;
    objSP.congsac = req.body.congsac;
    objSP.kieumanhinh = req.body.kieumanhinh;
    objSP.tinhnagdacbiet = req.body.tinhnagdacbiet;
    objSP.loai = req.body.loai;

      try {
          let new_sp = await objSP.save();
          console.log(new_sp);
          msg = "Lưu thành công";
      } catch (error) {
          msg = "Error" + error.message();
          console.log(error);
      }
  }
  res.send({ message: msg });
};

exports.edit = async (req, res, next) => {
  let msg = "";

  // Load thông tin sản phẩm
  let idsp = req.params.idsp;
  let objSP = await myMD.spModel.findById(idsp);

  if (req.method === "POST") {
    try {
      if (req.file) {
        fs.renameSync(
          req.file.path,
          "../public/uploads/" + req.file.originalname
        );
        msg = "Url ảnh: http://localhost:3000/uploads/" + req.file.originalname;
        objSP.img = "/uploads/" + req.file.originalname;
        console.log(msg);
      }
    } catch (error) {
      msg = error.message;
    }

    // Cập nhật thông tin sản phẩm
    objSP.name = req.body.name;
    objSP.noidung = req.body.noidung;
    objSP.price = req.body.price;
    objSP.GPU = req.body.GPU;
    objSP.kichthuocmanhinh = req.body.kichthuocmanhinh;
    objSP.congnghemanhinh = req.body.congnghemanhinh;
    objSP.camerasau = req.body.camerasau;
    objSP.cameratruoc = req.body.cameratruoc;
    objSP.chip = req.body.chip;
    objSP.bonho = req.body.bonho;
    objSP.pin = req.body.pin;
    objSP.hedieuhanh = req.body.hedieuhanh;
    objSP.dophangiai = req.body.dophangiai;
    objSP.tinhnangmanhinh = req.body.tinhnangmanhinh;
    objSP.quayvideo = req.body.quayvideo;
    objSP.tinhnangcamera = req.body.tinhnangcamera;
    objSP.kichthuoc = req.body.kichthuoc;
    objSP.trongluong = req.body.trongluong;
    objSP.congnghesac = req.body.congnghesac;
    objSP.congsac = req.body.congsac;
    objSP.kieumanhinh = req.body.kieumanhinh;
    objSP.tinhnagdacbiet = req.body.tinhnagdacbiet;
    objSP.loai = req.body.loai;

    try {
      await objSP.save();
      msg = "Cập nhật thành công";
    } catch (error) {
      msg = "Error: " + error.message;
      console.log(error);
    }
  }

  res.render("home/edit.ejs", { msg: msg, objSP: objSP });
};

exports.editJson = async (req, res, next) => {
  let msg = "";

  let idsp = req.params.idsp;
  let objSP = await myMD.spModel.findById(idsp);

  if (req.method == "PUT") {
    
    objSP.img = req.body.img; 
    objSP.name = req.body.name;
    objSP.noidung = req.body.noidung;
    objSP.price = req.body.price;
    objSP.GPU = req.body.GPU;
    objSP.kichthuocmanhinh = req.body.kichthuocmanhinh;
    objSP.congnghemanhinh = req.body.congnghemanhinh;
    objSP.camerasau = req.body.camerasau;
    objSP.cameratruoc = req.body.cameratruoc;
    objSP.chip = req.body.chip;
    objSP.bonho = req.body.bonho;
    objSP.pin = req.body.pin;
    objSP.hedieuhanh = req.body.hedieuhanh;
    objSP.dophangiai = req.body.dophangiai;
    objSP.tinhnangmanhinh = req.body.tinhnangmanhinh;
    objSP.quayvideo = req.body.quayvideo;
    objSP.tinhnangcamera = req.body.tinhnangcamera;
    objSP.kichthuoc = req.body.kichthuoc;
    objSP.trongluong = req.body.trongluong;
    objSP.congnghesac = req.body.congnghesac;
    objSP.congsac = req.body.congsac;
    objSP.kieumanhinh = req.body.kieumanhinh;
    objSP.tinhnagdacbiet = req.body.tinhnagdacbiet;
    objSP.loai = req.body.loai;

      try {
          let new_sp = await objSP.save();
          console.log(new_sp);
          msg = "Sửa thành công";
      } catch (error) {
          msg = "Error" + error.message();
          console.log(error);
      }
  }

  res.send({ message: msg });
};

exports.deleteSP = async (req, res, next) => {
  let idsp = req.params.idsp;
  try {
    await myMD.spModel.findByIdAndDelete({ _id: idsp });
  } catch (error) {}
  res.redirect("/home/home");
};


exports.deleteJson = async (req, res, next) => {
  let idsp = req.params.idsp;
  if(req.method === "DELETE"){
    try {
      await myMD.spModel.findByIdAndDelete({ _id: idsp });
    } catch (error) {}
  }
  res.send({ message: 'Xóa thành công' });
};
exports.chitiet = async (req, res, next) => {
  let idsp = req.params.idsp;
  let objSP = await myMD.spModel.findById(idsp);
  let listSP = await myMD.spModel.find();
  res.render("home/single-product.ejs", { objSP: objSP, listSP: listSP});
};
 
