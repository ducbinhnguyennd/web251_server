
var myMD = require("../models/sanpham.model");
const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);


// Hàm điều chỉnh kích thước ảnh
async function resizeImage(buffer, width, height) {
  // Đọc buffer vào một ReadableStream
  const readableStream = require('stream').Readable.from(buffer);

  // Ghi dữ liệu từ ReadableStream vào một WritableStream với kích thước đã chỉ định
  const writableStream = require('stream').Writable.from(new Array(width * height).fill(0));

  await new Promise((resolve, reject) => {
    readableStream.pipe(writableStream)
      .on('finish', resolve)
      .on('error', reject);
  });

  // Trả về buffer của WritableStream
  return Buffer.from(writableStream.getBuffer());
}

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
      // Đọc buffer của ảnh từ req.file
      const imageBuffer = await readFileAsync(req.file.path);

      // Thực hiện điều chỉnh kích thước (ví dụ: giảm kích thước xuống 800x600)
      const resizedBuffer = await resizeImage(imageBuffer, 800, 600);

      // Chuyển đổi buffer thành base64
      objSP.img = resizedBuffer.toString('base64');
    } catch (error) {
      msg = error.message;
    }finally {
      // Xóa file tạm thời sau khi sử dụng
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        // Xử lý lỗi khi xóa file
        console.error("Error deleting file:", unlinkError);
      }
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
      res.send({ message: msg });
    } catch (error) {
      console.log(error);
    }
  }

  

  res.render("home/add.ejs", { msg: msg });
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
        objSP.img = req.file.buffer.toString('base64');
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
 
