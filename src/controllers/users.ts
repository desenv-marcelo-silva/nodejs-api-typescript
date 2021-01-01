import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

import AuthService from '@src/services/auth';
import { User } from '@src/models/user';
import { BaseController } from '@src/controllers/index';
import { authMiddleware } from '@src/middlewares/auth';

@Controller('users')
export class UsersController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      const result = await user.save();

      res.status(201).send(result);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Post('authenticate')
  public async authenticate(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: "User not found or password doesn't match.",
      });
    }

    if (!(await AuthService.comparePasswords(user.password, password))) {
      return this.sendErrorResponse(res, {
        code: 401,
        message: "User not found or password doesn't match.",
      });
    }

    const token = AuthService.generateToken(user.toJSON());
    return res.send({ ...user.toJSON(), ...{ token } });
  }

  @Get('me')
  @Middleware(authMiddleware)
  public async me(req: Request, res: Response): Promise<Response> {
    const email = req.decoded ? req.decoded.email : undefined;
    const user = await User.findOne({ email });
    if (!user) {
      return this.sendErrorResponse(res, {
        code: 404,
        message: 'User not found!',
      });
    }
    return res.send({ user });
  }
}
