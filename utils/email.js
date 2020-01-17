let nodemailer = require('nodemailer')
let pug = require('pug')
let htmlToText = require('html-to-text')

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email
        this.firstName = user.name.split(' ')[0]
        this.url = url
        this.from = `Arpit Satyal <${process.env.EMAIL_FROM}>`
    }

    newTrasnport() {
        if (process.env.NODE_ENV === 'production') {
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
            })
        }
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            PORT: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        })
    }
    async send(template, subject) {
        //send the actual email
        // 1 render the html for the email based on pug template
        let html = pug.renderFile(`${__dirname}/../views/email/${template}`, {
            firstName: this.firstName,
            url: this.url,
            subject
        })
        // 2 define the email options
        let mailOptions = {
            from: this.from,
            to: this.to,
            subject, html,
            text: htmlToText.fromString(html)
        }
        // 3 create a transport and send mail
        await this.newTrasnport().sendMail(mailOptions)
    }
    async sendWelcome() {
        await this.send('welcome.pug', 'welcome to the natours app!')
    }
    async sendPasswordReset() {
        await this.send('passwordReset.pug', 'please reset yer password! [valid for 10 mins]')
    }
}

