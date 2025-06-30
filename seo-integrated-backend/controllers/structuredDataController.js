const StructuredData = require('../models/StructuredData');

exports.addStructuredData = async (req, res) => {
  try {
    const { type } = req.params;
    const { url, jsonLD } = req.body;

    if (!url || !jsonLD) {
      return res.status(400).json({ success: false, message: 'URL and JSON-LD are required' });
    }

    const newData = new StructuredData({ type, url, jsonLD });
    await newData.save();

    res.status(201).json({ success: true, message: 'Structured data added', data: newData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};


exports.getStructuredData = async (req, res) => {
    try {
        const { type } = req.params;
        const data = await StructuredData.find({ type });

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.deleteStructuredData = async (req, res) => {
    try {
        const { id } = req.params;
        await StructuredData.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: 'Structured data deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getStructuredDataCount = async (req, res) => {
    try {
        const { type } = req.params;
        const count = await StructuredData.countDocuments({ type });

        res.status(200).json({ success: true, count });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.getStructuredDataByUrl = async (req, res) => {
  try {
    const { type } = req.params;
    const { url } = req.query;

    if (!url) return res.status(400).json({ success: false, message: 'URL is required' });

    const data = await StructuredData.findOne({ type, url });

    if (!data) {
      return res.status(404).json({ success: false, message: 'Structured data not found for this URL' });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
