import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default class AuthService {
  public static async hashPassword(
    password: string,
    salt = 10
  ): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  public static async comparePasswords(
    hashPassword: string,
    password: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }

  public static generateToken(payload: object): string {
    return jwt.sign(payload, 'test', {
      expiresIn: 1000,
    });
  }
}
