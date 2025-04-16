
import emailjs from '@emailjs/browser';

// Updated EmailJS credentials
// These should match your actual EmailJS account details
const EMAIL_SERVICE_ID = 'service_x6007iv';
const EMAIL_TEMPLATE_ID = 'template_l4ztjb1';
const EMAIL_USER_ID = 'a8Z0Ywd6Efq0mY_tr';

interface SendOTPEmailParams {
  email: string;
  otp: string;
}

export const sendOTPEmail = async ({ email, otp }: SendOTPEmailParams) => {
  try {
    console.log(`Sending OTP ${otp} to ${email}`);
    
    const response = await emailjs.send(
      EMAIL_SERVICE_ID,
      EMAIL_TEMPLATE_ID,
      {
        to_email: email,
        otp: otp,
      },
      EMAIL_USER_ID
    );

    console.log('Email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error };
  }
};
