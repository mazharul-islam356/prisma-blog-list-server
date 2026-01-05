import { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {

    try {
        const user = req.user;
        if(!user){
            return res.status(401).json({ error: "Unauthorized" });
        }
        const restult = await postService.createPost(req.body, user.id);
        res.status(201).json(
            {message: "Post created successfully",
            data: restult});
    } catch (error) {
        res.status(400).json({ error: "Failed to create post",
        details: error
         });
        console.log(error);
    }
    
}

export const postController = { createPost };