import type { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt, { type JwtPayload } from "jsonwebtoken";

interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
}

export interface IAuthRequest extends Request {
    user?: IUser;
}


const isAuth = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ 
            message: "Unauthorized - Please login to access, no token provided!"
        });
        return;
    }

    const token = authHeader.split(" ")[1] as string;

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    if (!decoded || !decoded.user) {
        res.status(401).json({ message: "Unauthorized - Invalid token!" });
        return;
    }

    req.user = decoded.user;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({
        message: "Please login to access, invalid token!",
    });
  }
};

export default isAuth;