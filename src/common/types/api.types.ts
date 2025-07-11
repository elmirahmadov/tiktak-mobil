export interface IUser {
  id: number;
  full_name: string;
  phone: string;
}

export interface ILoginRequest {
  phone: string;
  password: string;
}

export interface ISignupRequest {
  full_name: string;
  phone: string;
  password: string;
}

export interface IRefreshTokenRequest {
  refresh_token: string;
}

export interface IProfileUpdateRequest {
  full_name?: string;
  phone?: string;
}

export interface IAuthResponse {
  access_token?: string;
  refresh_token?: string;
  user?: any;
  profile?: any;
  tokens?: {
    access_token: string;
    refresh_token: string;
  };
  data?: {
    access_token?: string;
    refresh_token?: string;
    user?: any;
    profile?: any;
    tokens?: {
      access_token: string;
      refresh_token: string;
    };
  };
}
