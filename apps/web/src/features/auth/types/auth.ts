export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface UserResponse {
  user: User;
}
export interface MessageResponse {
  message: string;
}

export interface SignUpResponse extends UserResponse, MessageResponse {
  emailSent: boolean;
}
