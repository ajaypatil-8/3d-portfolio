import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 📩 EMAIL TO YOU (main message)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: ` New Portfolio Message from ${name}`,
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2> New message from your portfolio</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Subject:</b> ${subject}</p>
          <p><b>Message:</b></p>
          <p>${message}</p>
          <hr/>
          <p style="color:gray;font-size:12px">Sent from your portfolio website</p>
        </div>
      `,
    });

    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thanks for contacting Me ( I am Ajay Patil)",
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>Thanks for reaching out 🙌</h2>
          <p>Hi ${name},</p>
          <p>Thank you for contacting me through my portfolio.</p>
          <p>I have received your message and will reply within 24 hours.</p>
          <br/>
          <p>Regards,</p>
          <b>Ajay Patil</b><br/>
          Java & Full Stack Developer<br/>
          <a href="https://yourportfolio.com">Portfolio</a>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.log("MAIL ERROR:", err);
    return Response.json({ success: false });
  }
}
