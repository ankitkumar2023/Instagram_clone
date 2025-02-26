import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

const sendMessage = async(req,res) => {
    try {

        //steps
        //the sender will be the one who is logged in
        //the receiver is the one whom chatbox the sender opens
        //check whether there was any conversation existed before between then
        //if yes then add  new converstation to the them
        //if not then create a new conversation between them


        const senderId = req.user.userId;
        const receiverId = req.params.id;

        const { message } = req.body;

        let conversation = await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        })

        //establish the converstaion if not started yet
        if (!conversation) {
            conversation = await Conversation.create({
                participants:[senderId,receiverId]
            })
        };
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        })

        await newMessage.save();
        
        if (newMessage) conversation.messages.push(newMessage._id)
        
        await conversation.save();

        //Implement socket io for real time data transfer
        const receiverSocketId = getReceiverSocketId(receiverId)

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage',newMessage)
        }

        return res.status(201).json({
            message: "Message send successfully",
            success: true,
            newMessage
        })

    } catch (error) {
        console.log("Error while sending the message", error);
        return res.status(500).json({
            message: "Error while sending the message",
            success: false,
            error
        })
    }
}

const getMessage = async(req,res) => {
    try {
        //steps
        //get the sender id -- sender id is the one who is logged in
        //get the receiver id -- receiver id is the one whom message box is opened
        //get the conversation between them 
        //if conversation happen between them then populate those messages
        
        const senderId = req.user.userId;
        const receiverId = req.params.id;

        const conversationBetweenThem = await Conversation.find({
            participants: { $all: [senderId, receiverId] }
        }).populate({path:"messages"});
        
        if (!conversationBetweenThem) {
            return res.status(400).json({
                message: "No conversation happen",
                success: false,
                conversation:{}
            })
        }

        return res.status(200).json({
            message: "conversation among them retrieve successfully",
            success: true,
            conversation:conversationBetweenThem?.messages
        })
    } catch (error) {
        console.log("Error while retrieving the conversation between them",error)
    }
}

export {sendMessage,getMessage}