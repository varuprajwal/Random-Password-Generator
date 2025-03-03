export const generatePassword = (length, lower, upper, numbers, symbols) => {
  let chars = '';
  if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (numbers) chars += '0123456789';
  if (symbols) chars += '!@#$%^&*()_+-={}[];<>:';
  
  if (chars.length === 0) return '⚠ Select at least one option';
  
  let password = '';
  for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};
