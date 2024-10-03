import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
    constructor(private readonly userService: UserService) {
    }

    public signup = async (req: Request, res: Response) => {
        try {
            const user = await this.userService.signup(req.body);
            res.status(201).json({ message: 'Registered successfully', data: user });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Don't fret! An error occurred. Please contact the administrator." });
            }
        }
    };

    public signin = async (req: Request, res: Response) => {
        try {
            const credentials = await this.userService.signin(req.body);
            res.status(200).json({ message: "Login successfully", token: credentials });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "An error occurred. Please contact the administrator." });
            }
        }
    };
}
