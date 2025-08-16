import nodemailer from "nodemailer";

export const shareSummary = async (req, res) => {
  const { emails, summary } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: emails,
      subject: "Meeting Summary",
      text: summary,
    });

    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
