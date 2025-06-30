const OgTag = require("../models/ogTag");

// 📌 Get OG Tags
exports.getOgTags = async (req, res) => {
    try {
        const { page_url } = req.query;

        if (page_url) {
            const ogTag = await OgTag.findOne({ page_url });

            if (!ogTag) {
                return res.status(404).json({ message: "No OG Tag found for this URL" });
            }

            return res.json(ogTag);
        }

        const allOgTags = await OgTag.find();
        res.json(allOgTags);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 📌 Add OG Tag
exports.addOgTag = async (req, res) => {
    try {
        const { page_url, og_title, og_description, og_image, og_type } = req.body;

        const existing = await OgTag.findOne({ page_url });
        if (existing) {
            return res.status(400).json({ message: "OG Tag for this URL already exists" });
        }

        const newOgTag = new OgTag({ page_url, og_title, og_description, og_image, og_type });
        await newOgTag.save();

        res.status(201).json({ message: "OG Tag Created Successfully", data: newOgTag });
    } catch (error) {
        res.status(500).json({ message: "Error Creating OG Tag", error: error.message });
    }
};

// 📌 Update OG Tag
exports.updateOgTag = async (req, res) => {
    try {
        const { page_url, og_title, og_description, og_image, og_type } = req.body;

        const updatedOgTag = await OgTag.findOneAndUpdate(
            { page_url },
            { og_title, og_description, og_image, og_type },
            { new: true }
        );

        if (!updatedOgTag) {
            return res.status(404).json({ message: "OG Tag Not Found" });
        }

        res.json({ message: "OG Tag Updated Successfully", data: updatedOgTag });
    } catch (error) {
        res.status(500).json({ message: "Error Updating OG Tag", error: error.message });
    }
};

// 📌 Delete OG Tag
exports.deleteOgTag = async (req, res) => {
    try {
        const { page_url } = req.body;

        const deletedOgTag = await OgTag.findOneAndDelete({ page_url });

        if (!deletedOgTag) {
            return res.status(404).json({ message: "OG Tag Not Found" });
        }

        res.json({ message: "OG Tag Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error Deleting OG Tag", error: error.message });
    }
};
