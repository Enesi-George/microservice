import { PrismaClient, User, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class UserRepository {
    public async createUser(userData: any): Promise<User | null> {
        try {
            return await prisma.user.create({ data: userData });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new Error("A user with this email already exists.");
                }
            }
            throw new Error("An error occurred while creating the user.");
        }
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        try {
            return await prisma.user.findUnique({ where: { email } });
        } catch (error) {
            throw new Error("An error occurred while retrieving the user.");
        }
    }
}
