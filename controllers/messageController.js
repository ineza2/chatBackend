const Message = require('../models/Message');

const MessageController = {};

MessageController.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate('sender', 'username');
    res.json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

MessageController.postMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const { userId } = req.session;
    const message = new Message({ sender: userId, content });
    await message.save();
    res.status(201).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = MessageController;
