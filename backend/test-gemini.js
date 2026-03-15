import dotenv from "dotenv";
dotenv.config();

console.log("Key starts with:", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 15) : "MISSING");

async function checkModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.error) {
       console.error("API ERROR:", data.error.message);
    } else {
       console.log("AVAILABLE MODELS:");
       data.models.filter(m => m.name.includes("gemini")).forEach(m => console.log(" - " + m.name.split("/")[1]));
    }
  } catch(e) {
    console.error("Network error:", e.message);
  }
}

checkModels();
