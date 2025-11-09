const express = require("express");
const router = express.Router();
const getConnection = require("../config/db");
const upload = require("../config/multer");
const fs = require("fs");
const path = require("path");

// Helper function to validate multimedia data
function validateMultimediaData(type, idMarker) {
    const validTypes = ["photo_file", "video_file", "text_note", "audio_note"];

    if (!type || !idMarker) {
        return "Missing required fields: type, idMarker";
    }

    if (!validTypes.includes(type)) {
        return "Invalid type. Must be one of: 'photo_file', 'video_file', 'text_note', 'audio_note'";
    }

    if (isNaN(idMarker) || idMarker < 1) {
        return "idMarker must be a valid positive number";
    }

    return null;
}

// Helper function to get file type from mimetype
function getFileType(mimetype) {
    if (mimetype.startsWith("image/")) return "photo_file";
    if (mimetype.startsWith("video/")) return "video_file";
    if (mimetype.startsWith("audio/")) return "audio_note";
    return "photo_file"; // default
}

// Helper function to get relative file path
function getRelativeFilePath(file) {
    const uploadsIndex = file.path.indexOf("uploads");
    return file.path.substring(uploadsIndex).replace(/\\/g, "/");
}

// GET all multimedia with pagination
router.get("/", async (req, res) => {
    try {
        const connection = await getConnection();
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        let offset = (page - 1) * limit;

        const [totalResults] = await connection.query(`SELECT COUNT(*) AS total FROM multimedia;`);
        const total = totalResults[0].total;

        const [results] = await connection.query(`SELECT * FROM multimedia ORDER BY created_at DESC LIMIT ? OFFSET ?;`, [limit, offset]);
        await connection.end();

        res.json({
            success: true,
            info: { total, page, limit, totalPages: Math.ceil(total / limit) },
            results,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET multimedia by marker ID
router.get("/marker/:idMarker", async (req, res) => {
    try {
        const connection = await getConnection();
        const [results] = await connection.query(
            `SELECT * FROM multimedia WHERE idMarker = ? ORDER BY created_at DESC;`,
            [req.params.idMarker]
        );
        await connection.end();

        res.json({ success: true, count: results.length, results });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET a single multimedia entry
router.get("/:idMultimedia", async (req, res) => {
    try {
        const connection = await getConnection();
        const [results] = await connection.query(`SELECT * FROM multimedia WHERE idMultimedia = ?;`, [req.params.idMultimedia]);
        await connection.end();

        if (results.length === 0) return res.status(404).json({ success: false, message: "Multimedia entry not found" });

        res.json({ success: true, result: results[0] });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST upload file(s) - NEW ENDPOINT
router.post("/upload", upload.array("files", 10), async (req, res) => {
    try {
        const { idMarker, notes } = req.body;

        if (!idMarker || isNaN(idMarker)) {
            return res.status(400).json({ success: false, message: "Invalid or missing idMarker" });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "No files uploaded" });
        }

        const connection = await getConnection();

        // Verify marker exists
        const [markerCheck] = await connection.query(`SELECT idMarker FROM markers WHERE idMarker = ?;`, [idMarker]);
        if (markerCheck.length === 0) {
            await connection.end();
            return res.status(404).json({ success: false, message: "Marker not found" });
        }

        const uploadedFiles = [];

        for (const file of req.files) {
            const type = getFileType(file.mimetype);
            const filepath = getRelativeFilePath(file);

            const [result] = await connection.execute(
                `INSERT INTO multimedia (type, idMarker, filename, filepath, mimetype, filesize, notes) VALUES (?, ?, ?, ?, ?, ?, ?);`,
                [type, idMarker, file.originalname, filepath, file.mimetype, file.size, notes || null]
            );

            uploadedFiles.push({
                idMultimedia: result.insertId,
                filename: file.originalname,
                filepath: filepath,
                type: type,
            });
        }

        await connection.end();

        res.json({
            success: true,
            message: `${uploadedFiles.length} file(s) uploaded successfully`,
            files: uploadedFiles,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST a text note
router.post("/note", async (req, res) => {
    try {
        const { idMarker, notes } = req.body;

        if (!idMarker || isNaN(idMarker)) {
            return res.status(400).json({ success: false, message: "Invalid or missing idMarker" });
        }

        if (!notes || notes.trim() === "") {
            return res.status(400).json({ success: false, message: "Notes cannot be empty" });
        }

        const connection = await getConnection();

        // Verify marker exists
        const [markerCheck] = await connection.query(`SELECT idMarker FROM markers WHERE idMarker = ?;`, [idMarker]);
        if (markerCheck.length === 0) {
            await connection.end();
            return res.status(404).json({ success: false, message: "Marker not found" });
        }

        const [result] = await connection.execute(
            `INSERT INTO multimedia (type, idMarker, notes) VALUES (?, ?, ?);`,
            ["text_note", idMarker, notes]
        );

        await connection.end();

        res.json({
            success: true,
            idMultimedia: result.insertId,
            message: "Note added successfully",
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST a new multimedia entry (legacy support)
router.post("/", async (req, res) => {
    try {
        const { type, idMarker, notes } = req.body;
        const validationError = validateMultimediaData(type, idMarker);
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }

        const connection = await getConnection();
        const [result] = await connection.execute(
            `INSERT INTO multimedia (type, idMarker, notes) VALUES (?, ?, ?);`,
            [type, idMarker, notes || null]
        );

        await connection.end();
        res.json({ success: true, idMultimedia: result.insertId });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT (update) a multimedia entry
router.put("/:idMultimedia", async (req, res) => {
    try {
        const idMultimedia = req.params.idMultimedia;
        const { notes } = req.body;

        if (!idMultimedia || isNaN(idMultimedia)) {
            return res.status(400).json({ success: false, message: "Invalid ID format. ID must be a number." });
        }

        const connection = await getConnection();

        // Check if the multimedia entry exists before updating
        const [existing] = await connection.query(`SELECT * FROM multimedia WHERE idMultimedia = ?;`, [idMultimedia]);

        if (existing.length === 0) {
            await connection.end();
            return res.status(404).json({ success: false, message: "Multimedia entry not found" });
        }

        const [result] = await connection.execute(
            `UPDATE multimedia SET notes = ? WHERE idMultimedia = ?;`,
            [notes !== undefined ? notes : existing[0].notes, idMultimedia]
        );

        await connection.end();
        res.json({ success: true, message: "Multimedia entry updated successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE a multimedia entry
router.delete("/:idMultimedia", async (req, res) => {
    try {
        const idMultimedia = req.params.idMultimedia;

        if (!idMultimedia || isNaN(idMultimedia)) {
            return res.status(400).json({ success: false, message: "Invalid ID format. ID must be a number." });
        }

        const connection = await getConnection();

        // Check if the multimedia entry exists before deleting
        const [existing] = await connection.query(`SELECT * FROM multimedia WHERE idMultimedia = ?;`, [idMultimedia]);

        if (existing.length === 0) {
            await connection.end();
            return res.status(404).json({ success: false, message: "Multimedia entry not found" });
        }

        // Delete the file from disk if it exists
        if (existing[0].filepath) {
            const fullPath = path.join(__dirname, "../", existing[0].filepath);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }

        await connection.execute(`DELETE FROM multimedia WHERE idMultimedia = ?;`, [idMultimedia]);

        await connection.end();
        res.json({ success: true, message: "Multimedia entry deleted successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
