import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [size, setSize] = useState(5);
  const [margin, setMargin] = useState(4);
  const [ecLevel, setEcLevel] = useState("M");
  const [qrSrc, setQrSrc] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const handleGenerate = async () => {
    if (!url) return;

    const API_URL = import.meta.env.VITE_API_URL;

    try {
      
      const response = await axios.post(
        `${API_URL}/generate`,
        { url, size, margin, ec_level: ecLevel },
        { responseType: "blob" } // tells Axios to expect binary (image)// ensures backend image is treated as a file
      );

      const blob = new Blob([response.data], { type: "image/png" });
      const imageUrl = URL.createObjectURL(blob);
      setQrSrc(imageUrl);
    } catch (err) {
      if (err.response && err.response.data) {
        // backend error with message
        alert(err.response.data.error || "Failed to generate QR");
      } else {
        console.error(err);
        alert("Something went wrong");
      }
    }

  };

  const year = new Date().getFullYear();

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <h1>QR Code Generator</h1>

      {/* Dark mode toggle button */}
      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <label>Enter URL</label>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
      />

      <label>Size</label>
      <input
        type="number"
        value={size}
        onChange={(e) => setSize(Number(e.target.value))}
        min="1"
      />

      <label>Margin</label>
      <input
        type="number"
        value={margin}
        onChange={(e) => setMargin(Number(e.target.value))}
        min="0"
      />

      <label>Error Correction Level</label>
      <select value={ecLevel} onChange={(e) => setEcLevel(e.target.value)}>
        <option value="L">L (Low)</option>
        <option value="M">M (Medium)</option>
        <option value="Q">Q (Quartile)</option>
        <option value="H">H (High)</option>
      </select>

      <button onClick={handleGenerate}>Generate QR</button>

      {qrSrc && (
        <div className="qr-container">
          <h3>Your QR Code:</h3>
          <img src={qrSrc} alt="QR Code" />
        </div>
      )}

      <footer>
        <p>Copyright &copy; {year} Codemande Tech</p>
      </footer>
    </div>
  );
}

export default App;