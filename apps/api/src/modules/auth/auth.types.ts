export interface PublicUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface JwtPayload {
  sub: string;
  authVersion: number;
}

export interface AuthResult {
  token: string;
  user: PublicUser;
}
