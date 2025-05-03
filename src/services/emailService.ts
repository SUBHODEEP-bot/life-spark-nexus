
import emailjs from '@emailjs/browser';

// EmailJS credentials with the correct service ID
const EMAIL_SERVICE_ID = 'service_gkrhayg';
const EMAIL_TEMPLATE_ID = 'template_nj89jpf';
const EMAIL_USER_ID = 'a8Z0Ywd6Efq0mY_tr';

interface SendOTPEmailParams {
  email: string;
  otp: string;
  expiryTime?: string;
}

export const sendOTPEmail = async ({ email, otp, expiryTime = "5 minutes" }: SendOTPEmailParams) => {
  try {
    console.log(`Sending OTP ${otp} to ${email}`);
    
    // Format data according to the EmailJS template expectations
    const response = await emailjs.send(
      EMAIL_SERVICE_ID,
      EMAIL_TEMPLATE_ID,
      {
        email: email,       // This matches the template's {{email}} parameter
        otp_code: otp,      // This matches the template's {{otp_code}} parameter
        expiry_time: expiryTime  // This matches the template's {{expiry_time}} parameter
      },
      EMAIL_USER_ID
    );

    console.log('OTP email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error };
  }
};
