export const generateSummary = async (req, res) => {
  try {
    const { transcript, prompt } = req.body;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          inputs: transcript,
          parameters: { max_length: 120, min_length: 30 } 
        })
      }
    );

    const result = await response.json();

    if (result.error) {
      return res.status(500).json({ error: result.error });
    }

    // Simple way: append the user’s instruction
    const finalSummary = `${prompt}:\n${result[0].summary_text}`;

    res.json({ summary: finalSummary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
