export interface UserRegister {
  fullName: string;
  sexIdentify: string;
  phone: string;
  password: string;
}

export interface UserLogin {
  phone: string;
  password: string;
}
