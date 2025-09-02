import express from "express";
import cors from "cors";
import qr from "qr-image";

const app = express();
app.use(express.json());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser requests 
    if (origin.includes(".vercel.app") || origin === "http://localhost:5173") {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

// make sure OPTIONS requests are handled
app.options("*", cors());


// Utility function: check if input is a valid URL
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

app.post("/generate", async(req, res) => {
  console.log("Request body:", req.body); 
  const { url, size = 5, margin = 4, ec_level = "M" } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  try {
    // Generate QR with custom options
    const qr_png = qr.image(url, {
      type: "png",
      size,      // scale of QR
      margin,    // white border
      ec_level,  // error correction level
    });

    res.setHeader("Content-Type", "image/png");
    qr_png.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);