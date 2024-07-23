const express = require('express')
const router = express.Router()
var myMDBlog = require('../models/blog.model')
const LoaiSP = require('../models/sanpham.model')
const unicode = require('unidecode')

router.post('/postblog', async (req, res) => {
  try {
    const { tieude_blog, img, content, tieude, img_blog } = req.body
    const tieude_khongdau = unicode(tieude_blog)
    const blog = new myMDBlog.blogModel({
      tieude_blog,
      img_blog,
      tieude_khongdau
    })
    if (Array.isArray(content) && Array.isArray(img) && Array.isArray(tieude)) {
      for (let i = 0; i < content.length; i++) {
        blog.noidung.push({
          content: content[i],
          img: img[i],
          tieude: tieude[i]
        })
      }
    } else {
      blog.noidung.push({ content, img, tieude })
    }
    await blog.save()
    res.redirect('/main')
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` })
  }
})
router.get('/contentBlog/:tieude', async (req, res) => {
  try {
    const tieude_khongdau = decodeURIComponent(req.params.tieude).replace(/-/g, ' ')
    const blog = await myMDBlog.blogModel.findOne({ tieude_khongdau })

    if (!blog) {
      return res.status(404).json({ message: 'Blog không tồn tại' })
    }

    const listBl = await myMDBlog.blogModel.find().sort({ _id: -1 })

    const content = blog.noidung.map(noidung => {
      return {
        tieude: noidung.tieude,
        content: noidung.content.replace(/\\n/g, '<br>'),
        img: noidung.img || ''
      }
    })

    res.render('home/chitietblog.ejs', {
      content,
      tieude: blog.tieude_blog,
      listBl,
      image_blog: blog.img_blog
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` })
  }
})

router.post('/deleteblog/:idblog', async (req, res) => {
  try {
    const idblog = req.params.idblog
    const blog = await myMDBlog.blogModel.findByIdAndDelete(idblog)
    res.redirect('/main')
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` })
  }
})
router.get('/editblog/:idblog', async (req, res) => {
  try {
    const idblog = req.params.idblog
    const blog = await myMDBlog.blogModel.findById(idblog)
    res.render('home/editBlog.ejs', {
      blog
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` })
  }
})

router.post('/editblog/:idblog', async (req, res) => {
  try {
    const { tieude_blog, img_blog, tieude, content, img } = req.body
    const idblog = req.params.idblog
    const blog = await myMDBlog.blogModel.findById(idblog)
    blog.tieude_blog = tieude_blog
    blog.img_blog = img_blog
    blog.tieude_khongdau=unicode(tieude_blog)

    if (Array.isArray(content) && Array.isArray(img) && Array.isArray(tieude)) {
      blog.noidung.forEach((nd, index) => {
        nd.content = content[index]
        nd.img = img[index]
        nd.tieude = tieude[index]
      })

      for (let i = blog.noidung.length; i < content.length; i++) {
        blog.noidung.push({
          content: content[i],
          img: img[i],
          tieude: tieude[i]
        })
      }
    } else {
      blog.noidung.push({ content, img, tieude })
    }

    await blog.save()
    res.redirect('/main')
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` })
  }
})
module.exports = router
