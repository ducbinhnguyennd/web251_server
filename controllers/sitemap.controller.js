const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs'); // Chú ý sự thay đổi ở đây

const paths = ['/thanhtoan', '/shop', '/contact'];

exports.sitemap = async (req, res, next) => {
    try {
        const smStream = new SitemapStream({ hostname: 'https://www.9mobile.shop' });

        // Tạo hoặc ghi đè tệp sitemap.xml
        const writeStream = createWriteStream('sitemap.xml');
        smStream.pipe(writeStream);

        // Thêm các đường dẫn vào sitemap
        paths.forEach(path => {
            smStream.write({ url: path, changefreq: 'daily', priority: 0.7 });
        });

        // Kết thúc quá trình tạo sitemap
        smStream.end();

        // Chờ hoàn thành ghi tệp
        await streamToPromise(writeStream);

        // Đọc và trả về nội dung của tệp sitemap.xml cho client
        const readStream = createReadStream('sitemap.xml');
        readStream.pipe(res);

    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
};