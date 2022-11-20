import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../db/models';
import { ConflictError } from '../errors';
import serverConfig from '../config/sever.config';
import { DecodedToken } from '../interfaces/auth.interface';
import userService from './user.service';
import notificationUtil from '../utils/notification.util';

class AuthService {
  private UserModel = User;

  public async login(userId: number, otp: string) {
    const user = await userService.validateUserVerification(userId, otp);
    const token = this.generateToken(user);
    return { user, token };
  }

  public async validateUser(email: string, password: string): Promise<User> {
    const user = await this.UserModel.scope('withPassword').findOne({ 
      where: { email },
    });
    if (!user || !this.validatePassword(user, password)) {
      throw new ConflictError('Email or password is incorrect');
    }
    await this.generateAndSend2FA(user);
    return user;
  }

  private validatePassword(user: User, password: string): boolean {
    return bcrypt.compareSync(password, user.password);
  }

  private generateToken(user: User): string {
    return jwt.sign({ ...user }, serverConfig.AUTH_SECRET, { 
      expiresIn: serverConfig.JWT_EXPIRATION,
    });
  }

  private async generateAndSend2FA(user: User): Promise<void> {
    const verification = await userService.generateUserVerification(user);
    await notificationUtil.sendOtpNotification(user, verification);
  }

  public verifyToken(token: string): DecodedToken {
    try {
      const payload = jwt.verify(token, serverConfig.AUTH_SECRET) as unknown as User;
      return {
        payload,
        expired: false,
      };
    } catch (error) {
      return {
        payload: null,
        expired: error.message.includes('expired') ? error.message : error,
      };
    }
  }
}

export default new AuthService();