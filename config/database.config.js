const env = process.env.NODE_ENV || 'development';
if (env == "development" || env == "dev") {
    require('dotenv').config();
}

module.exports = {
    USER: process.env.USER_NAME,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_NAME,
}

