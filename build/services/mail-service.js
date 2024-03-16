import nodemailer from 'nodemailer';
class MailService {
    static async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: 'damn10586@mail.com',
            to,
            subject: 'Активация аккаунта: ' + process.env.API_URL,
            text: '',
            html: `
                <div>
                    <h1>Для активации перейдите по ссылке</h1>
                    <a href="${link}>${link}</a>
                </div>
            `
        });
    }
}
MailService.transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true,
    auth: {
        user: 'damn10586@mail.ru',
        pass: 'yqFrtrd2pQbvAMzb9iL3'
    }
});
export default MailService;
//# sourceMappingURL=mail-service.js.map