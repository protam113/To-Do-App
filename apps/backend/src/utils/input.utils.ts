export function password_validate(str: string): boolean {
  if (str.length < 8) return false;
  
  const hasLowerCase = /[a-z]/.test(str);
  
  const hasUpperCase = /[A-Z]/.test(str);
  
  const hasNumber = /[0-9]/.test(str);
  
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(str);
  
  return hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar;
}