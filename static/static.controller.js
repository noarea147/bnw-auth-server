require('dotenv').config();

// getStaticById
exports.home = async(req, res) => {
    res.sendFile(`${__dirname}/index.html`);
};