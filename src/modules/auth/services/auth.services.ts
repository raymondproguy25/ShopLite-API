import User from '@/models/User';
import { createToken } from '@/utils/jwt';

class AuthService {
  async register(name: string, email: string, password: string) {
    if (await User.findOne({ email })) {
      throw new Error('Email already exists');
    }
    return await User.create({ name, email, password });
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {                                  
      throw new Error('Invalid credentials');
    }
    return createToken(user.id, user.role);
  }                                                                                     
  async logout(res: Response) {
    res.clearCookie('token');
  }     
 }

export default new AuthService();
