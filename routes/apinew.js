const express = require('express');
const router = express.Router();
var myMDBlog = require("../models/blog.model");
const LoaiSP = require("../models/sanpham.model");

router.post('/postblog', async(req, res) => {
    try {
        const { tieude_blog, img, content, tieude, img_blog } = req.body;
        const blog = new myMDBlog.blogModel({ tieude_blog, img_blog });
        if (Array.isArray(content) && Array.isArray(img) && Array.isArray(tieude)) {
            for (let i = 0; i < content.length; i++) {
                blog.noidung.push({ content: content[i], img: img[i], tieude: tieude[i] });
            }
        } else {
            blog.noidung.push({ content, img, tieude });
        }
        await blog.save();
        res.redirect('/main');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
})
router.get('/contentBlog/:tieude', async(req, res) => {
    try {
        const tieude_blog = decodeURIComponent(req.params.tieude).replace(/-/g, ' ');
        const blog = await myMDBlog.blogModel.findOne({ tieude_blog });


        if (!blog) {
            return res.status(404).json({ message: 'Blog không tồn tại' });
        }

        const listBl = await myMDBlog.blogModel.find().sort({ _id: -1 });

        const content = blog.noidung.map(noidung => {
            return {
                tieude: noidung.tieude,
                content: noidung.content.replace(/\\n/g, '<br>'),
                img: noidung.img || ''
            }
        })

        res.render('home/chitietblog.ejs', { content, tieude: blog.tieude_blog, listBl, image_blog: blog.img_blog })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` });
    }
})

module.exports = router