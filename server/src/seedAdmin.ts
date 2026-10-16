import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "./config/db";
import { User } from "./models/User";

const readArg = (name: string): string | undefined => {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
};

const seedAdmin = async (): Promise<void> => {
  const email = readArg("email")?.trim().toLowerCase();
  const password = readArg("password");
  if (!email || !password || password.length < 12) {
    console.error(
      'Usage: npm run seed:admin -w server -- --email admin@example.com --password "AtLeast12Characters"',
    );
    process.exitCode = 1;
    return;
  }
  await connectDB();
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.error(
      "An account with that email already exists. No changes made.",
    );
    await mongoose.disconnect();
    process.exitCode = 1;
    return;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({ email, passwordHash, role: "admin", isActive: true });
  console.info(`Administrator created for ${email}`);
  await mongoose.disconnect();
};

void seedAdmin();
