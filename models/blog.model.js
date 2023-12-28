var db = require('./db');
const blogChema = new db.mongoose.Schema(
    {
        tieude_blog: { type: String, require: true },
        img_blog: { type: String, require: true },
        noidung_blog: { type: String, require: true },
    },
    {
        collection: 'Blog'
    }
);

let blogModel = db.mongoose.model('blogModel', blogChema);
module.exports = { blogModel };