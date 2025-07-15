// Mock implementation for email service functions

export const sendLeadConfirmationEmail = async (
  email: string,
  name: string,
  serviceType: string
) => {
  try {
    console.log(
      `Sending lead confirmation email to ${email} (${name}) for service: ${serviceType}`
    );
    // In a real implementation, we would send an email

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error sending lead confirmation email:', error);
    return {
      success: false,
      error: 'Failed to send confirmation email',
    };
  }
};

export const sendStaffNotificationEmail = async (email: string, data: any) => {
  try {
    console.log(`Sending staff notification email to ${email}`, data);
    // In a real implementation, we would send an email

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error sending staff notification email:', error);
    return {
      success: false,
      error: 'Failed to send staff notification email',
    };
  }
};
