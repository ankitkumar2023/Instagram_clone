import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";


const addNewPost = async(req,res) => {
    try {
        const { caption } = req.body;
        const authorId = req.user.userId;
        const image = req.file;

        if (!image) {
            return res.status(400).json({
                message: "Image is required",
                success:false
            })
        }

        //we can get vary large size of image to we have to optimize that image
        //to optimize we gonna use sharp
        
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: "inside" })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer()
        
        //converting buffer to data uri

        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;

        const cloudResponse = await cloudinary.uploader.upload(fileUri);

        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author:authorId
        })

        //so each time a new post is being created by someone 
        //it should be reflected inside the posts of the user

        const user = await User.findById(authorId);

        if (user) {
            user.posts.push(post._id)
            await user.save()
        }

        //now we have to populate - we populate to get the information about something that is attact to something
        //like here the post is being created by someone and we want to know about the person who created

        await post.populate({ path: "author", select: "-password" });

        return res.status(201).json({
            message: "New post added successfully",
            success: true,
            post:post
        })

        
    } catch (error) {
        console.log("error while adding new post", error);
        return res.status(500).json({
            message: "Error while adding a new post",
            error
        })
    }
}

const getAllPost = async(req,res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: "author", select: "username profilePicture" })
            .populate({
                path: "comments",
                sort: { createdAt: -1 },
                populate: {
                    path: "author",
                    select: "username profilePicture"
                }
            });
        return res.status(200).json({
            message: "All posts fetched",
            success: true,
            posts
        })
        
    } catch (error) {
        console.log("Error while fetching all posts", error);
        return res.status(500).json({
            message: "Error while fetching all posts",
            error
        })
    }
}

const getUserPost = async(req,res) => {
    try {
        //get the logged in user id
        const authorId = req.user.userId //author id is basically the user id who is currently logged in

        //now find the post of the particular user
        const posts = await Post.find({ author: authorId })   //here i have find the all those post releated to the user
            .sort({ createdAt: -1 })                          //here i have sort in the latest on top like bottom to top approach
            .populate({ path: "author", select: "username profilePicture" }) //here i want to get the information of the user
            .populate({
                path: "comments",
                sort: { createdAt: -1 },
                populate: {
                    path: "author",
                    select: "username, profilePicture"
                }
            });
        return res.status(200).json({
            message: "user post successfully fetched",
            success: true,
            posts
        })
    } catch (error) {
        console.log("Error while fetching user post", error);
        return res.status(500).json({
            message: "Error while fetching user posts",
            error
        })
    }
}

const likePost = async (req,res) => {
    try {
        //so a post can only be liked by the user who is logged in
        //so we first get the post id from the frontend
        //we find that particular post
        //we will update the likes array in the post and add the user id who liked it
        //we will implement the socketio fro real time notification

        const userWhoLikes = req.user.userId;
        const postId = req.params.id;

        //findind that particular post
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "post not found",
                success:false
            })
        }

        await post.updateOne({ $addToSet: { likes: userWhoLikes } });
        await post.save();

        //Implementation of socket io for real time notification


        return res.status(200).json({
            message: "post liked ",
            success:true
            
        })
    } catch (error) {
        console.log("Error while liking the post", error);
        return res.status(501).json({
            message: "Error while liking the post",
            error,
            success:false
        })
    }
    
}

const disLikePost = async(req,res) => {
    try {
        const whoDisLike = req.user.userId;
        const postId = req.params.id;

        const post = await Post.findById(postId);

        if (!post) res.status(404).json({
            message: "post not found",
            success: false
        })

        await post.updateOne({ $pull: { likes: whoDisLike } });
        post.save();

        //Implementation of socket io for real time notification


        return res.status(200).json({
            message: "post disliked ",
            success:true
        })
    } catch (error) {
        console.log("Error while disliking the post", error);
        return res.status(500).json({
            message: "Error while disliking gthe post",
            error,
            success:false
        })
    }
}


const addComment = async(req,res) => {
    try {
        const postId = req.params.id;
        const userWhoCommented = req.user.userId;
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                message: " something Comment is required to add comment ",
                success:false
            })
        }

        const post = await Post.findById(postId);

        //create a comment 
        const newComment = await Comment.create({
            text: text,
            author: userWhoCommented,
            post: postId
        }).populate({path:"author", select:"username profilePicture"});

        await newComment.save();

        post.comments.push(newComment._id)
        await post.save()
        
        return res.status(200).json({
            message: "successfully commented",
            success: true,
            newComment
        })

    } catch (error) {
        console.log("Error while adding comment", error);
        return res.status(500).json({
            message: "Error while adding comment",
            error
        })
    }
}


//by post model searching

// const getCommentOfParticularPost = async (req, res) => {
//     try {
//         const postId = req.params.id;
//         const postComments = await Post.findById(postId).populate({
//             path: "comments",
//             select: "text",
//             populate: {
//                 path: "author",
//                 select: "username profilePicture"
//             }
//         });

//         if (!postComments) {
//             return res.status(404).json({
//                 message: "No post found",
//                 success: false
//             });
//         }

//         return res.status(200).json({
//             message: "Post comments retrieved successfully",
//             success: true,
//             postComments
//         });

//     } catch (error) {
//         console.log("Error while fetching the post's comments", error);
//         return res.status(500).json({
//             message: "Error while fetching the post's comments",
//             success: false,
//             error
//         });
//     }
// };


const getCommentOfParticularPost = async(req,res) => {
    try {
        const postId = req.params.id;
        const postallComments = await Comment.find({ post:postId }).populate({path:"author",select:"username, profilePicture"});

        if (!postallComments) {
            return res.status(404).json({
                message: "No comments found for this post",
                success:false
            })
        }

        return res.status(200).json({
            message: "Post comments retrieve successfully",
            success: true,
            postallComments
        })

    } catch (error) {
        console.log("Error while fetching the post's comments", error);
        return res.status(500).json({
            message: "Error while fetching the post's comments",
            success: false,
            error
        })
    }
}

const deletePost = async(req,res) => {
    try {
        // steps : ---

        //get the post id
        //get the user id
        //check for the post 
        //check if the user is authorized to delete -- only logged in user can delete the post 
        //delete the post
        //delete associated comments of that post
        //also delete the post id reffernce fron the user model-- because that model is also keeping track of the post id
        
        const postId = req.params.id;
        // console.log("post id inside delete post controller",postId)

        const authorId = req.user.userId;
        // console.log("user id inside delete post contoller",authorId)


        //searching for the particular post
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success:false
            })
        }

        //checking the user is authenticated or not

        if (post.author.toString() != authorId) {
            return res.status(403).json({
                message: "Unauthorized request",
                success: false
            })
        }

        //if authorized then -- delete the post

        await Post.findByIdAndDelete(postId)

        //now also delete the post id refference from the user model

        const user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() != postId);

        await user.save()

        //deleting associated comments

        await Comment.deleteMany({ post: postId });

        return res.status(200).json({
            message: "Post successfully deleted",
            success: true,
            
        })
        
    } catch (error) {
        console.log("Error while deleting the post", error);
        return res.status(500).json({
            message: "Error while deleting the post",
            success:false
        })
            
    }
}

const BookmarkPost= async(req,res) => {
    try {

        //steps
        //get the user id who is bookmarking
        //get the post id
        //check whether that post id already existed befor or not in bookmark array of user
        //if not then add and if then remove

        const authorId = req.user.userId;
        const postId = req.params.id

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(400).json({
                message: "Post not found",
                success:false
            })
        }

        const user = await User.findById(authorId);

        const doesPostAlreadyExisted = user.bookmarks.includes(post._id)
        // if (!doesPostAlreadyExisted) {
        //     //if post doesnot exist already --> then bookmark
        //      user.bookmarks.push(postId)

        // } else {

        //     //if post already exist --> then remove from the bookmark
        //     user.bookmarks=user.bookmarks.filter(id=> id.toString()!= postId)
        // }
        // await user.save()

        if (doesPostAlreadyExisted) {
            //if already exist -- then remove from the bookmark
            await user.updateOne({ $pull: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({
                type: "unsaved",
                message: "post remove from the bookmar",
                success:true
            })
        } else {
            //if not exist already then --> add to bookmark

            await user.updateOne({ $addToSet: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({
                type: "saved",
                message: "post added to bookmark",
                success:true
            })
        }
    } catch (error) {
        console.log("Error while bookmarking the post");
        return res.status(500).json({
            message: "Error while Bookmarking the post",
            success:false
        })
    }
}


export {
    addNewPost,
    getAllPost,
    getUserPost,
    likePost,
    disLikePost,
    addComment,
    getCommentOfParticularPost,
    deletePost,
    BookmarkPost
}