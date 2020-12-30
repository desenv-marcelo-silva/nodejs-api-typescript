import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

import AuthService from '@src/services/auth';
import { User } from '@src/models/user';
import { BaseController } from '@src/controllers/index';

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
      return res.status(401).send({
        code: 401,
        error: "User not found or password doesn't match.",
      });
    }

    if (!(await AuthService.comparePasswords(user.password, password))) {
      return res.status(401).send({
        code: 401,
        error: "User not found or password doesn't match.",
      });
    }

    const token = AuthService.generateToken(user.toJSON());
    return res.status(200).send({ token: token });
  }
}
