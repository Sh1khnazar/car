const nodemailer = require('nodemailer')
require('dotenv').config()
const CustomErrorHandler = require('./custom-error.handler')

const sendEmail = async options => {
	try {
		const transporter = nodemailer.createTransport({
			service: 'Gmail',
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS, // App password ishlatiladi
			},
		})

		const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        .container { font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; }
        .header { background-color: #4A90E2; padding: 20px; text-align: center; }
        .header h1 { color: white; margin: 0; }
        .content { padding: 30px; color: #333; }
        .button { background-color: #4A90E2; color: white !important; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; }
        .footer { background-color: #f4f7f9; padding: 15px; text-align: center; font-size: 12px; color: #777; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header"><h1>Devbook</h1></div>
        <div class="content">
            <h2>Assalomu alaykum!</h2>
            <p>${options.message || "Platformamizda muvaffaqiyatli ro'yxatdan o'tdingiz!"}</p>
            <div style="text-align: center; margin-top: 25px;">
                <a href="http://localhost:3000" class="button">Kutubxonaga o'tish</a>
            </div>
        </div>
        <div class="footer"><p>© 2026 Devbook Team</p></div>
    </div>
</body>
</html>`

		const mailOptions = {
			from: `"Devbook loyihasi" <${process.env.EMAIL_USER}>`,
			to: options.email,
			subject: options.subject || 'Devbook Bildirishnomasi',
			html: htmlContent,
			text: options.message,
		}

		await transporter.sendMail(mailOptions)
	} catch (error) {
		throw CustomErrorHandler.InternalServerError(
			`Email yuborishda xatolik yuz berdi: ${error.message}`,
		)
	}
}

module.exports = sendEmail
