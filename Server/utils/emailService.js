const nodemailer = require('nodemailer');

// Create email transporter using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Function to send contact message email
const sendContactEmail = async (name, email, subject, message) => {
    try {
        const adminMailOptions = {
            from: `My Portfolio <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            replyTo: email,
            subject: `New Message from ${name} - ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
                        <div style="background-color: #007bff; color: white; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                            <h2 style="margin: 0; font-size: 20px;">New Contact Message</h2>
                            <p style="margin: 5px 0 0 0; font-size: 12px;">FROM: ${name} &lt;${email}&gt;</p>
                        </div>
                        
                        <table style="width: 100%; margin: 20px 0;">
                            <tr>
                                <td style="padding: 8px; background-color: #e9ecef; width: 30%;"><strong>Name:</strong></td>
                                <td style="padding: 8px;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; background-color: #e9ecef;"><strong>Email:</strong></td>
                                <td style="padding: 8px;"><a href="mailto:${email}" style="color: #007bff;">${email}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; background-color: #e9ecef;"><strong>Subject:</strong></td>
                                <td style="padding: 8px;"><strong>${subject}</strong></td>
                            </tr>
                        </table>
                        
                        <div style="background-color: white; padding: 15px; border-left: 4px solid #007bff; margin: 15px 0; border-radius: 3px;">
                            <p style="margin: 0; color: #555;"><strong>Message:</strong></p>
                            <p style="margin: 10px 0; color: #333; line-height: 1.6; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
                        </div>
                        
                        <div style="background-color: #f0f0f0; padding: 10px; border-radius: 3px; font-size: 12px;">
                            <p style="margin: 0; color: #666;">
                                <strong>Quick Reply:</strong> Click reply to respond directly to ${name}
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        const userMailOptions = {
            from: `"Akhlaque Rahman" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Message Received - Thank You!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background-color: #f8f9fa; padding: 24px; border-radius: 8px;">
                        <h2 style="margin-top: 0; color: #111827;">Thank You</h2>
                        <p style="color: #374151; line-height: 1.6;">
                            We received your message and will review it as soon as possible.
                        </p>
                        <div style="background-color: white; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0; border-radius: 3px;">
                            <p style="margin: 0 0 10px; color: #555;"><strong>Subject:</strong> ${subject}</p>
                            <p style="margin: 0; color: #333; line-height: 1.6; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
                        </div>
                        <p style="color: #6b7280; font-size: 13px;">
                            If this email address does not exist, your mail provider may return an address-not-found message.
                        </p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(userMailOptions);

        console.log('Admin notification and user confirmation emails sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = { sendContactEmail };
