import Groq from "groq-sdk";

const COACH_SYSTEM_PROMPT =
  "You are a friendly English speaking coach. Correct grammar briefly, explain simply, and ask one short follow-up question. Keep replies short and clear for learners.";

export const chatWithSpeakingCoach = async (req, res) => {
  try {
    const { message } = req.body;

    // Validate user message
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    // Check API key at request time so the server can still start without it
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Groq API key is not configured on the server.",
      });
    }

    // Initialize Groq client lazily
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: COACH_SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      max_tokens: 300,
    });

    const responseText = completion.choices[0]?.message?.content || "";

    // Send response to frontend
    return res.status(200).json({
      success: true,
      userMessage: message,
      coachReply: responseText,
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Speaking coach AI error:`, error);
    return res.status(500).json({
      success: false,
      message: "Failed to get AI coach reply from Groq.",
    });
  }
};