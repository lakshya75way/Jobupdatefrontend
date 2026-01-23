export interface IUser {
  _id: string;
  email: string;
  name: string;
  role: string;
  isVerified: boolean;
}

export interface IAuthResponse {
  status: string;
  message?: string;
  data: {
    user: IUser;
    token: string;
    refreshToken?: string;
  };
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface ISignupData {
  email: string;
  password: string;
  name: string;
}
