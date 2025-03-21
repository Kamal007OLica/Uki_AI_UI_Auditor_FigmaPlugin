require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Route to receive UI audit requests
app.post("/api/audit", async (req, res) => {
    try {
        const { textLayers } = req.body;

        // Prepare data for AI analysis
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
            { inputs: textLayers.map(layer => layer.name) },
            { headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` } }
        );

        res.json({ success: true, results: response.data });
    } catch (error) {
        console.error("Error processing UI audit:", error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
