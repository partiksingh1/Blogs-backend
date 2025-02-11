import { Request, Response } from "express"
import { BlogSchema } from "../model/blogSchema.js"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()


export const AddBlog = async (req: Request, res: Response) => {
    const validation = BlogSchema.safeParse(req.body);
    if (!validation.success) {
        res.status(400).json({
            message: "blog addition validation error",
            err: validation.error.format()
        })
        return
    }
    try {
        const { url, title, isRead, categoryName, userId } = validation.data
        const category = await prisma.category.upsert({
            where: {
                userId_name: {
                    userId: userId,
                    name: `${categoryName}`
                }
            },
            update: {},
            create: {
                name: `${categoryName}`,
                userId: userId
            }
        });
        const blog = await prisma.blog.create({
            data: {
                url: url,
                title: title,
                userId: userId,
                categories: {
                    connect: {
                        id: category.id
                    }
                }
            }
        })
        if (!blog) {
            res.status(400).json({
                message: "Not able to add blog"
            })
        }
        res.status(201).json({
            message: "Blog added successfully",
            category,
            blog
        })

    } catch (error) {
        res.status(500).send({
            message: "Internal server error in adding the blog"
        })
    }
}
export const CreateCategory = async (req: Request, res: Response) => {
    const { userId, categoryName } = req.body;
    if (!userId) {
        res.status(400).json({
            message: "Invalid user, please provide a userId"
        })
    }
    try {
        const category = await prisma.category.upsert({
            where: {
                userId_name: {
                    userId: userId,
                    name: categoryName
                }
            },
            update: {},
            create: {
                name: `${categoryName}`,
                userId: userId
            }
        });
        if (!category) {
            res.status(400).json({
                message: "unable to create category"
            })
        }
        res.status(201).json({
            message: "Category created successfully",
            category
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error in creating category"
        })
    }
}
export const DeleteCategory = async (req: Request, res: Response) => {
    const { userId, categoryName } = req.body;
    if (!userId) {
        res.status(400).json({
            message: "Invalid user, please provide a userId"
        })
    }
    try {
        const category = await prisma.category.delete({
            where: {
                userId_name: {
                    userId: userId,
                    name: categoryName
                }
            }
        });
        if (!category) {
            res.status(400).json({
                message: "unable to delete category"
            })
        }
        res.status(201).json({
            message: "Category deleted successfully",
            category
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error in deleting category"
        })
    }
}
export const GetBlogs = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (!userId) {
        res.status(400).json({
            message: "Invalid user, please provide a userId"
        })
    }
    try {
        const blogs = await prisma.blog.findMany({
            where: {
                userId: userId
            },
            include:{
                categories:true,
                tags:true
            }
        })
        if (!blogs) {
            res.status(404).json({
                message: "No blogs found for this user"
            })
        }
        res.status(200).json({
            message: "Blogs successfully fetched",
            blogs
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error in getting blogs"
        })
    }
}
export const GetBlogByid = async (req: Request, res: Response) => {
    const { userId } = req.body
    const blogId = parseInt(req.params.blogId)

    if (!userId && !blogId) {
        res.status(404).json({
            message: "No user id for blog id, send it again"
        })
    }
    try {
        const blog = await prisma.blog.findUnique({
            where: {
                id: blogId
            }
        })
        if (!blog) {
            res.status(404).json({
                message: "unable to find the blog with this id"
            })
            return
        }
        res.status(200).json({
            message: "Blog fetched successfully",
            blog
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error in fetching blog with id"
        })
    }
}
export const EditBlogById = async (req: Request, res: Response) => {
    const { userId, status } = req.body
    const blogId = parseInt(req.params.blogId)
    if (!blogId) {
        res.status(400).json({
            message: "no blog id specified"
        })
    }
    try {
        const blogStatus = await prisma.blog.update({
            where: {
                id: blogId,
                userId: userId
            },
            data: {
                isRead: status
            }
        })
        if (!blogStatus) {
            res.status(404).json({
                message: "Unable to change status of blog"
            })
        }
        res.status(200).json({
            message: "Status updated successfully",
            blogStatus
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error in updating status"
        })
    }
}
export const DeleteBlogById = async (req: Request, res: Response) => {
    const { userId, status } = req.body
    const blogId = parseInt(req.params.blogId)
    if (!blogId) {
        res.status(400).json({
            message: "no blog id specified"
        })
    }
    try {
        const deleteBlog = await prisma.blog.delete({
            where: {
                id: blogId,
                userId: userId
            }
        })
        if (!deleteBlog) {
            res.status(404).json({
                message: "Unable to delete blog"
            })
        }
        res.status(200).json({
            message: "blog deleted successfully",
            deleteBlog
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error in deleting status"
        })
    }
}
export const JoinTags = async (req: Request, res: Response) =>{
    const {blogId,userId,tagName} = req.body
    if (!userId && !tagName) {
        res.status(400).json({
            message: "Provide user and tag name"
        })
    }
    try {
        const tag = await prisma.tag.upsert({
            where:{
               userId_name:{
                  userId:userId,
                   name:tagName
               },
            },
               update:{},
               create:{
                name:tagName,
                userId:userId
               }
        })

        const blog = await prisma.blog.update({
            where:{ id: blogId},
            data:{
                tags:{
                    connect:{
                        id:tag.id
                    }
                }
            }
        })
        res.status(200).json({
            message: "Tag added successfully to the blog",
            blog,
            tag
          });
    } catch (error) {
        console.error(error);
    res.status(500).json({
      message: "Internal server error while adding tag to blog."
    });
    }
}