export default interface IAuthUtils {
  generatePassword(password: string, salt: string): Promise<string>;
  validatePassword(
    enteredPassword: string,
    databaseSavedPassword: string
  ): Promise<boolean>;
}
