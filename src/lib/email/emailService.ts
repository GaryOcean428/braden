
// This is a mock email service until a real email integration is set up

export const sendLeadConfirmationEmail = async (
  email: string,
  name: string,
  serviceType: string
) => {
  console.log(`Mock: Sending confirmation email to ${name} (${email}) regarding ${serviceType}`);
  
  // In a real implementation, this would send an actual email via an API
  // For now, we'll simulate success and return after a small delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return { success: true };
};

export const sendStaffNotificationEmail = async (
  staffEmail: string,
  leadDetails: any
) => {
  console.log(`Mock: Sending notification email to staff (${staffEmail}) about new lead`);
  console.log('Lead details:', leadDetails);
  
  // In a real implementation, this would send an actual email via an API
  // For now, we'll simulate success and return after a small delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return { success: true };
};
