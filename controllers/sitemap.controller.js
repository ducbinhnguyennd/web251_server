const { SitemapStream, streamToPromise } = require('sitemap');
const { createReadStream } = require('fs');
const paths = ['/thanhtoan', '/shop', '/contact'];
exports.sitemap = async (req, res, next)=>{
    try {
        const smStream = new SitemapStream({ hostname: 'https://www.9mobile.shop' });
        const pipeline = smStream.pipe(createReadStream('sitemap.xml')).pipe(res);

        // Thêm các đường dẫn vào sitemap
        paths.forEach(path => {
            smStream.write({ url: path, changefreq: 'daily', priority: 0.7 });
        });

        // Kết thúc quá trình tạo sitemap
        smStream.end();
        await streamToPromise(pipeline);
    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
}
