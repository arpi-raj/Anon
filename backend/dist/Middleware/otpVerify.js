"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = generateOTP;
exports.sendOTP = sendOTP;
exports.sendOTPForgot = sendOTPForgot;
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.senderEmail,
        pass: process.env.emailPass,
    },
});
function generateOTP(length = 6) {
    return crypto_1.default.randomInt(0, Math.pow(10, length)).toString().padStart(length, '0');
}
function sendOTP(email, otp) {
    return __awaiter(this, void 0, void 0, function* () {
        const mailOptions = {
            from: process.env.email,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}. It is valid for the next 10 minutes.`,
        };
        try {
            const info = yield transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
        }
        catch (error) {
            console.error('Error sending OTP email:', error);
        }
    });
}
function sendOTPForgot(email, otp) {
    return __awaiter(this, void 0, void 0, function* () {
        const mailOptions = {
            from: process.env.email,
            to: email,
            subject: 'Your Password Reset OTP',
            text: `Your OTP code is ${otp} for changing your password. It is valid for the next 10 minutes. Verify it to change your password.`,
        };
        try {
            const info = yield transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
        }
        catch (error) {
            console.error('Error sending OTP email for password reset:', error);
        }
    });
}
//# sourceMappingURL=otpVerify.js.map