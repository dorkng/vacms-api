import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { User, UserAccess, UserVerification } from '../db/models';
import { NotFoundError, ConflictError } from '../errors';
import userUtil from '../utils/user.util';
import authService from './auth.service';
import { QueryOptions } from '../interfaces/functions.interface';

class UserService {
  private UserModel = User;

  private UserAccessModel = UserAccess;

  private UserVerificationModel = UserVerification;

  public async create(data: unknown): Promise<User> {
    const { 
      email, firstName, lastName, phoneNumber, access,
    } = await userUtil.creationSchema.validateAsync(data);
    const password =  userUtil.generateRandomPassword();
    const attributes = { email, password, firstName, lastName, phoneNumber };
    await this.validateEmail(email);
    const user = await this.UserModel.create(attributes);
    const accessAttributes = { userId: user.id, ...access };
    await this.createAccess(accessAttributes);
    return user;
  }

  public async get(id: number): Promise<User> {
    const user = await this.UserModel.findByPk(id, {
      include: [
        {
          model: UserAccess,
          as: 'access',
          include: ['department'],
        },
      ],
    });
    if (!user) throw new NotFoundError('User not found.');
    return user;
  }

  public async getById(id: number): Promise<User> {
    const user = await this.UserModel.findByPk(id);
    if (!user) throw new NotFoundError('User not found.');
    return user;
  }

  public async getAll(opts: QueryOptions): Promise<{ result: User[], totalCount: number }> {
    const { limit, offset, search, accessLevel } = opts;
    const { rows: result, count: totalCount } = await this.UserModel.findAndCountAll({
      where: {
        [Op.or]: {
          email: { [Op.like]: search ? `%${search}%` : '%' },
          firstName: { [Op.like]: search ? `%${search}%` : '%' },
          lastName: { [Op.like]: search ? `%${search}%` : '%' },
        },
      },
      include: [
        {
          model: UserAccess,
          as: 'access',
          where: { accessLevel: { [Op.in]: accessLevel.split(',') } },
        },
      ],
      limit: limit,
      offset: offset,
    });
    return { result, totalCount };
  }

  private async validateEmail(email: string): Promise<User> {
    const user = await this.UserModel.findOne({
      where: { email },
    });
    if (user) throw new ConflictError('A user already exists with this email.');
    return user;
  }

  private async createAccess(data: unknown): Promise<UserAccess> {
    const access = await this.UserAccessModel.create(data);
    return access;
  }

  public async generateUserVerification(user: User): Promise<UserVerification> {
    const [{ id: userId }, otp, expiresOn] = [
      user,
      userUtil.generateOtp(),
      userUtil.getOtpExpiration(),
    ];
    const attributes = { userId, otp, expiresOn, isUsed: false };
    const [verification, isNewRecord] = await this.UserVerificationModel.findOrCreate({
      where: { userId },
      defaults: attributes,
    });
    if (!isNewRecord) {
      await verification.update(attributes);
    }
    return verification.reload();
  }

  public async validateUserVerification(userId: number, otp: string): Promise<User> {
    const now = new Date(Date.now());
    const verification = await this.UserVerificationModel.findOne({
      where: { userId, otp, expiresOn: { [Op.gte]: now }, isUsed: false },
    });
    if (!verification) throw new ConflictError('The otp you entered is invalid/expired.');
    await verification.set('isUsed', true).save();
    const user = await this.getById(userId);
    return user;
  }

  public async generateVerificationToken(id: number): Promise<string> {
    const user = await this.UserModel.scope('withPassword').findOne({ where: { id } });
    if (!user) throw new NotFoundError('User not found.');
    const secret = `${user.id}$@${user.phoneNumber}!${user.password}*${user.email}`;
    return jwt.sign({ id: user.id }, secret, { expiresIn: '7d' });
  }

  private async validateVerificationToken(id: number, token: string): Promise<{ status: boolean; user: User; }> {
    const user = await this.UserModel.scope('withPassword').findOne({ where: { id } });
    if (!user) throw new NotFoundError('User not found.');
    const secret = `${user.id}$@${user.phoneNumber}!${user.password}*${user.email}`;
    try {
      jwt.verify(token, secret);
      return { status: true, user };
    } catch (error) {
      return { status: false, user };
    }
  }

  public async verifyUserAccount(id: number, token: string, password: string): Promise<User> {
    const { status, user } = await this.validateVerificationToken(id, token);
    if (!status) {
      throw new ConflictError('Link is invalid.');
    }
    await user.set('password', password).save();
    return user.reload();
  }

  public async changePassword(userId: number, data: unknown): Promise<User> {
    const user = await this.UserModel.scope('withPassword').findByPk(userId);
    const {
      currentPassword, confirmPassword,
    } = await userUtil.changePasswordSchema.validateAsync(data);
    if (!authService.validatePassword(user, currentPassword)) {
      throw new ConflictError('Current password is incorrect.');
    }
    if (authService.validatePassword(user, confirmPassword)) {
      throw new ConflictError('Current password cannot be used as new password.');
    }
    await user.set('password', confirmPassword).save();
    return user.reload();
  }
}

export default new UserService();




















