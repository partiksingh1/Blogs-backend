import express from "express";
import { AddBlog, CreateCategory, JoinTags, DeleteBlogById, DeleteCategory, EditBlogById, GetBlogByid, GetBlogs } from "../controller/blogController.js";

export const blogRouter = express.Router();

blogRouter.post("/blog",AddBlog);
blogRouter.get("/blogs/:userId",GetBlogs);
blogRouter.get("/blog/:blogId",GetBlogByid);
blogRouter.post("/category",CreateCategory);
blogRouter.delete("/category",DeleteCategory);
blogRouter.put("/blog/:blogId",EditBlogById);
blogRouter.delete("/blog/:blogId",DeleteBlogById);
blogRouter.post("/blog/tag",JoinTags);


