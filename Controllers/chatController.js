import ChatMessage from '../models/ChatMessage.js';
import Doctor from '../models/DoctorSchema.js';

export const getChatList = async (req, res) => {
  try {
    const chats = await ChatMessage.aggregate([
      { $match: { $or: [{ sender: req.userId }, { receiver: req.userId }] } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", req.userId] },
              "$receiver",
              "$sender"
            ]
          },
          lastMessage: { $first: "$message" },
          createdAt: { $first: "$createdAt" }
        }
      },
      {
        $lookup: {
          from: "doctors",
          localField: "_id",
          foreignField: "_id",
          as: "doctorInfo"
        }
      },
      { $unwind: "$doctorInfo" }
    ]);

    res.status(200).json({
      success: true,
      chats: chats.map(chat => ({
        doctorId: chat._id,
        doctorName: chat.doctorInfo.name,
        doctorPhoto: chat.doctorInfo.photo,
        lastMessage: chat.lastMessage,
        createdAt: chat.createdAt
      })),
    });
  } catch (error) {
    console.error('Error fetching chat list:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch chat list' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const messages = await ChatMessage.find({
      $or: [
        { sender: req.userId, receiver: doctorId },
        { sender: doctorId, receiver: req.userId }
      ]
    }).sort('createdAt');

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { doctorId, message } = req.body;
    const newMessage = new ChatMessage({
      sender: req.userId,
      receiver: doctorId,
      message,
      senderModel: 'User',
      receiverModel: 'Doctor'
    });
    await newMessage.save();
    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Process the file upload (e.g., save to cloud storage)
    const fileUrl = await uploadToCloudStorage(req.file);

    res.status(200).json({ success: true, filename: req.file.originalname, fileUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ success: false, message: 'Failed to upload file' });
  }
};

// Helper function to upload file to cloud storage (implement according to your cloud provider)
const uploadToCloudStorage = async (file) => {
  // Implement file upload to your preferred cloud storage service
  // Return the public URL of the uploaded file
  return 'https://example.com/uploaded-file-url';
};

export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isApproved: 'approved' }).sort('-averageRating');
    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch doctors' });
  }
};

