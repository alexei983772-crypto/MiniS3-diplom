const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});
exports.sendVerificationEmail = async (
  email,
  code
) => {
  await transporter.sendMail({
    from: `"Mini-S3" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Verify your Mini-S3 account",
    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 30px;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
      ">
        <h2 style="margin-bottom:20px;">
          Email Verification
        </h2>

        <p>
          Thank you for creating your Mini-S3 account.
        </p>

        <p>
          Enter the following verification code:
        </p>

        <div style="
          font-size:32px;
          font-weight:bold;
          letter-spacing:6px;
          margin:25px 0;
          color:#059669;
        ">
          ${code}
        </div>

        <p>
          This code will expire in 15 minutes.
        </p>

        <hr style="margin:25px 0;" />

        <p style="
          font-size:12px;
          color:#6b7280;
        ">
          Mini-S3 Distributed Storage Platform
        </p>
      </div>
    `,
  });
};