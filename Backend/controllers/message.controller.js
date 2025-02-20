import Conversation from "../models/conversation.model";
import Message from "../models/message.model";

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