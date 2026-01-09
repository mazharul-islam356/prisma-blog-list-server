import { title } from "node:process";
import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>, userId: string) => {

    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId
        },
    });
    return result;
}

const getAllPosts = async (
    payload: {
        search: string | undefined
    }
) => {
    const allPosts =  await prisma.post.findMany({
        where: {
        OR: [
            {title: {
            contains: payload.search as string,
            mode: "insensitive"
        }},
        {content: {
             contains: payload.search as string,
            mode: "insensitive"
        }},
        {tags:
            {
                 has: payload.search as string,
            }
        }
        ]
    }
    })
    // console.log(allPosts);
    return allPosts;

}

export const PostService = { createPost, getAllPosts };