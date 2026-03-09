import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a friendly English speaking coach. Correct grammar briefly, explain simply, and ask one short follow-up question. Keep replies short and clear for learners.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    // Send response to frontend
    return res.status(200).json({
      success: true,
      userMessage: message,
      coachReply: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Speaking coach AI error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get AI coach reply.",
    });
  }
};