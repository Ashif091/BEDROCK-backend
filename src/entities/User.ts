export interface User {
  _id: string;
  fullname: string;
  email: string;
  password?: string;
  googleId?: string;
  githubId?: string;
  profile?: string;
  verify_token?: string; 
  verified:boolean;
}