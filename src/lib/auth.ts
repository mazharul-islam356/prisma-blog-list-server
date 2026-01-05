import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_NAME,
    pass: process.env.APP_PASS,
  },
});


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    trustedOrigins: [process.env.APP_URL || "http://localhost:4000"],
    user:{
        additionalFields: {
            role : {
                type: "string",
                defaultValue: "USER",
                required: false,
            },
            phone : {
                type: "string",
                required: false,
            },
            status : {
                type: "string",
                defaultValue: "ACTIVE",
                required: false,
            }
        }
    },
    emailAndPassword: { 
        enabled: true, 
        autoSignIn: false,
        requireEmailVerification: true,

  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
       sendVerificationEmail: async ( { user, url, token }, request) => {

      try {
        const verifyUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

const info = await transporter.sendMail({
  from: '"Prisma blog list" <prismablog45@gmail.com>',
  to: user.email!,
  subject: "Verify Your Email Address ✉️",
  text: `Please verify your email by clicking this link: ${verifyUrl}`, // Plain-text fallback
  html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 20px 40px; text-align: center; background-color: #4F46E5; border-radius: 10px 10px 0 0;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                    📧 Verify Your Email
                  </h1>
                </td>
              </tr>
              
              <!-- Body -->
              <tr>
                <td style="padding: 40px;">
                  <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                    Hello ${user.name},
                  </p>
                  <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                    Thank you for signing up! Please confirm your email address by clicking the button below.
                  </p>
                  
                  <!-- CTA Button -->
                  <table role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td align="center" style="padding: 30px 0;">
                        <a href="${verifyUrl}" 
                           style="display: inline-block; padding: 16px 40px; background-color: #4F46E5; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px; transition: background-color 0.3s;">
                          Verify Email Address
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #666666;">
                    If the button doesn't work, copy and paste this link into your browser:
                  </p>
                  <p style="margin: 0 0 20px 0; font-size: 12px; line-height: 1.6; color: #4F46E5; word-break: break-all;">
                    <a href="${verifyUrl}" style="color: #4F46E5;">${verifyUrl}</a>
                  </p>
                  
                  <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">
                  
                  <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.6; color: #999999;">
                    ⏰ This link will expire in <strong>24 hours</strong>.
                  </p>
                  <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #999999;">
                    If you didn't create an account, you can safely ignore this email.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px; text-align: center; background-color: #f8f9fa; border-radius: 0 0 10px 10px;">
                  <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
                    © ${new Date().getFullYear()} Prisma blog list. All rights reserved.
                  </p>
                  <p style="margin: 0; font-size: 12px; color: #999999;">
                   Demra, Dhaka
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
});
      } catch (error) {
        console.log(error);
      }
  
  }
  }
});