import cloudinary from 'cloudinary'
import express from 'express';
import multer from 'multer';
import { handleUpload } from '../utils/cloudinary.js';
import { verifyAccessToken }  from '../middleware/verifytoken.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const myUploadMiddleware = upload.single("image");

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

router.post("/upload", verifyAccessToken, async (req, res) => {
  try {
    await runMiddleware(req, res, myUploadMiddleware);

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    const cldRes = await handleUpload(dataURI);

    res.status(200).json({
      message: "Uploaded successfully",
      imageUrl: cldRes.secure_url,
      public_id: cldRes.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

router.delete("/delete", verifyAccessToken, async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) return res.status(400).json({ success: false, message: "Missing public_id" });

    await cloudinary.uploader.destroy(public_id);
    res.status(200).json({ success: true, message: "Photo successfully deleted from Cloudinary" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
