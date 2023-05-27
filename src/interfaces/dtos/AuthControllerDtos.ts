export interface ILoginDto {
  userName?: string;
  email?: string;
  password: string;
}

export { userInput as ISignupDto } from '@models/User';
