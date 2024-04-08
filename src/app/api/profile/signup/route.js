import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  const data = await req.json();
  await connectDB();

  const { username, email, password } = data;

  const salt = bcrypt.genSaltSync(10);
  const plaintextPassword = password;

  const hashedPassword = bcrypt.hashSync(plaintextPassword, salt);

  const user = new User({
    username,
    email,
    password: hashedPassword,
    salt,
  });

  await user.save();

  return NextResponse.json({ message: "User created" }, { status: 201 });
};
