const nodemailer = require('nodemailer');

// Configuration Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Envoyer OTP par email
const sendOTPEmail = async (email, otp, userName = 'Utilisateur') => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Votre code de vérification - AgriCoopérative Tchad',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2E8B57;">AgriCoopérative Tchad</h2>
          <h3 style="color: #333;">Vérification de votre compte</h3>
          
          <p>Bonjour ${userName},</p>
          
          <p>Votre code de vérification pour accéder à votre compte AgriCoopérative est :</p>
          
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0;">
            <h1 style="color: #2E8B57; font-size: 32px; letter-spacing: 5px; margin: 0;">
              ${otp}
            </h1>
          </div>
          
          <p>Ce code expirera dans 10 minutes.</p>
          
          <p style="color: #666; font-size: 12px;">
            Si vous n'avez pas demandé ce code, veuillez ignorer cet email.
          </p>
        </div>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email OTP envoyé à:', email);
    
    return {
      success: true,
      message: 'OTP envoyé avec succès',
      messageId: result.messageId
    };
    
  } catch (error) {
    console.error('❌ Erreur envoi email OTP:', error);
    return {
      success: false,
      message: 'Erreur lors de l\'envoi de l\'OTP'
    };
  }
};

module.exports = {
  sendOTPEmail,
  transporter
};