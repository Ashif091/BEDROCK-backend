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
  subscription?:any
}












// {
//   status: { type: Boolean, required: false }, 
//   plan: { type: String, required: false },
//   exp_date: { type: Date, required: false } 
// }