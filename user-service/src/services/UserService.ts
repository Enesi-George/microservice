import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/userRepo';
import { User } from "@prisma/client";


export class UserService {
    constructor(private userRepository: UserRepository) { }

    public async signup(userData: { password: string; [key: string]: any }): Promise<User | null> {
        const hashPassword = await bcrypt.hash(userData.password, 10);

        const result = await this.userRepository.createUser({ ...userData, password: hashPassword });
        return result;
    }

    public async signin(credentials: { email: string; password: string }): Promise<string> {
        const user = await this.userRepository.getUserByEmail(credentials.email);
        if (!user) throw new Error('Invalid credentials provided');

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) throw new Error('Invalid credentials');

        if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not defined');

        return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    }
}
