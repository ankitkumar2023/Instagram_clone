import User from "../models/user.model.js"
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import bcrypt from "bcryptjs"
import mongoose from "mongoose";
import Post from "../models/post.model.js";


const userRegisteration = async (req, res) => {
    try {
        const { username, email, password } = req.body

        //checking whether any field is empty or not
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "All fields must be filled",
                success: false
            })
        }

        //checking whether any user already exist with the email id or  not

        const user = await User.findOne({ email });

        if (user) {
            return res.status(401).json({
                message: "username /email already exist.Try different email id",
                success: false
            })
        };

        //hashing the password before save
        const hasedPassword = await bcrypt.hash(password, 10);
        
        //registering the new user
        const newUser = await User.create({
            username,
            email,
            password: hasedPassword
        })

        await newUser.save();

        return res.status(201).json({
            message: "Account created successfully",
            success: true,
            user:newUser
        })
        
    } catch (error) {
        console.log("error while registering the user", error);
        return res.status(500).json({
            message: "Error while registering the user",
            success:false,
            error
        })
    }
};

const userLoginVerification = async (req,res) => {
    try {
        //getting the email and password from req.body
        const { email, password } = req.body

        //checking if any given fields are empty or not
        if (!email || !password) {
            return res.status(401).json({
                message: "All fields are must to be filled",
                success: false
            })
        }

        //checking whether user exist or not
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Wrong user id or password",
                success:false
            })
        }

        //decrypt the user password and compare the given password

        const decryptedPasswordVerification = await bcrypt.compare(password, user.password);

        //if password verification fails 
        if (!decryptedPasswordVerification) {
            return res.status(400).json({
                message: "Wrong password",
                success: false
            })
        }

        //now generate jwt token

        const accessToken = await jwt.sign(
            {
            userId: user._id,
            email: user.email
            }
            , process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIREY_KEY });

        
        const options = {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 1 * 24 * 60 * 60 * 1000
        }
        
        //we want as soon as user logged in all the post the user posted get fetched
        const userAllPosts = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId)
                if (post && post.author.equals(user._id)) {
                    return post;
            
                }
                return null
            })
        )
        //selecting fields that are to be send to frontend
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: userAllPosts,
            
            
        }
        return res.cookie("accessToken", accessToken, options).json({
            message: `Welcome back ${user.username}`,
            success:true,
            user
        })
    
    } catch (error) {
        console.log("error while logged in", error);
        return res.status(500).json({
            message: "error while logged in",
            error
        })
    }
}

const userLogout = async (req,res) => {
    try {
        return res.cookie("accessToken", "", { maxAge: 0 }).json({
            message: "logged out successfully",
            success:true
        })
    } catch (error) {
        console.log("error while logging out", error);
        return res.status(501).json({
            message: "Error while logging out",
            error,
            success:false
        })
    }
}

const getUserProfile = async (req,res) => {
    try {
        const userId = req.params.id;

        let user = await User.findById(userId).populate({
            path: "posts",
            createdAt: -1,
            populate: {
                path:"author"
            }
        }).populate({ path: "bookmarks" });
        
        console.log("user", user);

        if (!user) {
            return res.status(400).json({
                message: "user profile is not found",
                success:false
            })
        }

        return res.status(201).json({
            message: "user profile successfully get",
            success:true,
            user
        })
    } catch (error) {
        console.log("error while fetching user profile",error)
        return res.status(500).json({
            message: "Error while getting user profile",
            error,
            success:false
        })
    }
}


const editLoggedInUserProfile = async (req, res) => {
    try {

        const userId = req.user.userId;
        // console.log("user id", userId)
        
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById( userId).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url; 
        
        await user.save();

        return res.status(200).json({
            message: "User profile successfully updated",
            success: true,
            user:user
        });
    } catch (error) {
        console.log("Error while updating user profile", error);
        return res.status(501).json({
            message: "Error while updating the user profile",
            error
        });
    }
};


const getSuggestedUser = async (req,res) => {
    try {

        //so we want to find all the user id except the person who is logged in
        //so we get the person id who is logged in from the middleware
        const userId = req.user.userId;

        //now get the all user data

        const suggestedUsers = await User.find({ _id: { $ne: userId } }).select("-password");

        if (!suggestedUsers) {
            return res.status(400).json({
                message: "Currently do not have any users",
                success:false
            })
        }

        return res.status(200).json({
            message:"All suggested user successfully fetched",
            success: true,
            users:suggestedUsers
        })
    } catch (error) {
        console.log("Error while fetching the suggested user details", error);
        return res.status(500).json({
            message: "Error while fetching the suggested user details",
            success:false
        })
    }
}

const followOrUnfollow = async (req,res) => {
    try {
        const whoFollows = req.user.userId;
        const whomFollows = req.params.id;

        //check whether the follow's id and following's id is not same
        if (whoFollows === whomFollows) {
            return res.status(400).json({
                message: "You cant follow/unfollow yorself",
                success:false
            })
        }

        const user = await User.findById(whoFollows);
        const TargetUser = await User.findById(whomFollows);

        if (!user || !TargetUser) {
            return res.status(400).json({
                message: "User not found",
                success:false
            })
        }

        //check whether user follows the target user or not
        const isFollowing = await user.following.includes(whomFollows);

        if (isFollowing) {
            //unfollow logic

            await Promise.all([
                User.updateOne({ _id: whoFollows }, { $pull: { following: whomFollows } }),
                User.updateOne({ _id: whomFollows}, { $pull: { followers: whoFollows } } )
            ])
            return res.status(200).json({
                message: "Unfollowed successfully",
                success:true
            })
        }
        else {
            //follow
            await Promise.all([
                User.updateOne({ _id: whoFollows }, { $push: { following: whomFollows } }),
                User.updateOne({ _id: whomFollows }, { $push: { followers: whoFollows } }),
                
            ])
            return res.status(200).json({
                message: "Followed successfully",
                success:true
            })
        }
    } catch (error) {
        
    }
}

export {
    userRegisteration,
    userLoginVerification,
    userLogout,
    followOrUnfollow,
    editLoggedInUserProfile,
    getSuggestedUser,
    getUserProfile
}

