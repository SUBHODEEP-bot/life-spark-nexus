
import emailjs from '@emailjs/browser';

// EmailJS credentials with the correct service ID
const EMAIL_SERVICE_ID = 'service_lw06cte';
const EMAIL_TEMPLATE_ID = 'template_l4ztjb1';
const EMAIL_USER_ID = 'a8Z0Ywd6Efq0mY_tr';

interface SendOTPEmailParams {
  email: string;
  otp: string;
}

export const sendOTPEmail = async ({ email, otp }: SendOTPEmailParams) => {
  try {
    console.log(`Sending OTP ${otp} to ${email}`);
    
    // Corrected params to match EmailJS template expectations
    // The template has {{email}} instead of {{to_email}}
    const response = await emailjs.send(
      EMAIL_SERVICE_ID,
      EMAIL_TEMPLATE_ID,
      {
        email: email,       // Changed from to_email to email
        otp_code: otp,      // Changed from otp to otp_code
        expiry_time: "5 minutes"
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
