import nodemailer from 'nodemailer';
class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.p,
            port: 587,
            secure: false,
            auth: {
                user: '',
                password: 'rootroot'
            }
        });
    }
    static async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: 'damn10587@gmail.com',
            to,
            subject: 'Активация аккаунта: ' + process.env.API_URL
        });
    }
}
export default MailService;
//# sourceMappingURL=mail-service.js.map