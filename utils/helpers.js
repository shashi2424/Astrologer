export const validatePhoneNumber = (phoneNumber) => {
  // Basic validation for Indian mobile numbers
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phoneNumber);
};