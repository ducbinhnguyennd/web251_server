const express = require('express')
const router = express.Router()
var myMDBlog = require('../models/blog.model')
const unicode = require('unidecode')

function escapeRegExp (string) {
  // Thoát các ký tự đặc biệt trong biểu thức chính quy
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function replaceKeywordsWithLinks (content, keywords, urlBase) {
  // Nếu keywords không phải là mảng, chuyển đổi nó thành mảng chứa một từ khóa duy nhất
  if (!Array.isArray(keywords)) {
    keywords = [keywords]
  }

  // Nếu không có từ khóa, trả lại nội dung gốc
  if (!keywords || keywords.length === 0) {
    return content
  }

  // Thay thế từng từ khóa bằng thẻ <a>
  keywords.forEach(keyword => {
    if (keyword === '') {
      return
    }
    // Thoát các ký tự đặc biệt trong từ khóa
    const escapedKeyword = escapeRegExp(keyword)
    // Tạo một biểu thức chính quy để tìm từ khóa
    const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'gi')
    // Thay thế từ khóa bằng thẻ <a> với đường link
    content = content.replace(regex, `<a href="${urlBase}">${keyword}</a>`)
  })

  return content
}


router.post('/postblog', async (req, res) => {
  try {
    const { tieude_blog, img, content, tieude, img_blog, keywords, urlBase } =
      req.body

    const tieude_khongdau = unicode(tieude_blog)
    const blog = new myMDBlog.blogModel({
      tieude_blog,
      img_blog,
      tieude_khongdau
    })

    // Thêm các nội dung blog
    if (Array.isArray(content) && Array.isArray(img) && Array.isArray(tieude)) {
      for (let i = 0; i < content.length; i++) {
        const updatedContent = replaceKeywordsWithLinks(
          content[i],
          keywords[i],
          urlBase[i]
        )

        blog.noidung.push({
          content: updatedContent,
          img: img[i],
          tieude: tieude[i],
          keywords: keywords[i],
          urlBase: urlBase[i]
        })
      }
    } else {
      const updatedContent = replaceKeywordsWithLinks(
        content,
        keywords,
        urlBase
      )

      blog.noidung.push({
        content: updatedContent,
        img,
        tieude,
        keywords,
        keywords
      })
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
    const blogg = await myMDBlog.blogModel.findById(idblog)

    // Hàm để loại bỏ tất cả các thẻ <a> khỏi nội dung
    function removeAllLinks (content) {
      // Biểu thức chính quy để tìm và loại bỏ tất cả các thẻ <a> cùng với nội dung của chúng
      return content.replace(/<a[^>]*>(.*?)<\/a>/gi, '$1')
    }

    const blog = blogg.noidung.map(bl => {
      return {
        content: removeAllLinks(bl.content),
        img: bl.img,
        tieude: bl.tieude,
        keywords: bl.keywords,
        urlBase: bl.urlBase
      }
    })

    res.render('home/editBlog.ejs', {
      idblog,
      blog,
      tieude_blog: blogg.tieude_blog,
      img_blog: blogg.img_blog
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` })
  }
})

router.post('/editblog/:idblog', async (req, res) => {
  try {
    const { tieude_blog, img_blog, tieude, content, img, keywords, urlBase } =
      req.body
    const idblog = req.params.idblog
    const blog = await myMDBlog.blogModel.findById(idblog)
    blog.tieude_blog = tieude_blog
    blog.img_blog = img_blog
    blog.tieude_khongdau = unicode(tieude_blog)

    if (Array.isArray(content) && Array.isArray(img) && Array.isArray(tieude)) {
      blog.noidung.forEach((nd, index) => {
        if (content[index]) {
          const updatedContent = replaceKeywordsWithLinks(
            content[index],
            keywords[index],
            urlBase[index]
          )
          nd.content = updatedContent
        }
        nd.keywords = keywords[index]
        nd.urlBase = urlBase[index]
        if (img[index]) {
          nd.img = img[index]
        }
        if (tieude[index]) {
          nd.tieude = tieude[index]
        }
      })

      for (let i = blog.noidung.length; i < content.length; i++) {
        const updatedContent = replaceKeywordsWithLinks(
          content[i],
          keywords[i],
          urlBase[i]
        )

        blog.noidung.push({
          content: updatedContent,
          img: img[i],
          tieude: tieude[i],
          keywords: keywords[i],
          urlBase: urlBase[i]
        })
      }
    } else {
      const updatedContent = replaceKeywordsWithLinks(
        content,
        keywords,
        urlBase
      )
      blog.noidung = blog.noidung.slice(0, content.length)

      blog.noidung = blog.noidung.map(nd => {
        nd.content = updatedContent
        nd.img = img
        nd.tieude = tieude
        nd.keywords = keywords
        nd.urlBase = urlBase
        return nd
      })
    }

    await blog.save()
    res.redirect('/main')
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: `Đã xảy ra lỗi: ${error}` })
  }
})

module.exports = router
