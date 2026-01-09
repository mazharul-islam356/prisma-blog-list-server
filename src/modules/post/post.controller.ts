import { Request, response, Response } from "express";
import { PostService } from "./post.service";
import { string } from "better-auth/*";

const createPost = async (req: Request, res: Response) => {

    try {
        const user = req.user;
        if(!user){
            return res.status(401).json({ error: "Unauthorized" });
        }
        const restult = await PostService.createPost(req.body, user.id);
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

const getAllPosts = async ( req: Request, res: Response) => {
    try {
        const {search} = req.query
        // console.log(search);
        const searchString = typeof search === "string" ? search : undefined
        const result = await PostService.getAllPosts({search: searchString})
        res.status(200).json(result)
    } catch (error) {
         res.status(400).json({ error: "Failed to get all post",
        details: error
         });
    }
}

export const postController = { 
    createPost,
    getAllPosts

};