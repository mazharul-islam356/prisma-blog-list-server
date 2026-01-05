
import express, { NextFunction, Request, Response } from 'express';
import { postController } from './post.controller';
import { auth as betterAuth } from '../../lib/auth';

const router = express.Router();

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                role: string;
                emailVerified: boolean;
            }
           
        }
    }
}

const auth = (...roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
    
        const session = await betterAuth.api.getSession({
  headers: req.headers as any
})

     
    console.log(session);


        if(!session){
            return res.status(401).send({ message: 'Unauthorized access!' });
        }

        if(!session.user.emailVerified){
            return res.status(403).send({ message: 'Please verify your email to access this resource.' });
        }

         req.user = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.name!,
            role: session.user.role!,
            emailVerified: session.user.emailVerified,
        }

        if(roles.length && !roles.includes(session.user.role as UserRole)){
            return res.status(403).send({ message: 'Forbidden access!' });
        }


       


next();
    }
}

router.post('/', 
    auth(UserRole.ADMIN),
    postController.createPost);

export const postRouter = router;