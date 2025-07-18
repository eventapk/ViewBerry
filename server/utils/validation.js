const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateUserData = (userData) => {
  const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'country', 'state', 'city', 'category', 'institution'];
  const missing = required.filter(field => !userData[field] || userData[field].trim() === '');
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }

  if (!validateEmail(userData.email)) {
    throw new Error('Invalid email format');
  }

  return true;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUserData
};
