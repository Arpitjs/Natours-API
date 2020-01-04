let nodemailer = require('nodemailer')

let sendEmail = async options => {
    // 1 create a transporter
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        PORT: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    // 2 define email options
    let mailOptions = {
        from: 'Arpit Satyal <arpited7@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    }
    // 3 send the email
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail