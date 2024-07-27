import connect from "@/lib/database/db";
import User from "@/lib/models/User";

import { NextResponse } from "next/server";

// get all users route
export const GET = async () => {
  try {
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in fetching users " + error.message, {
      status: 500,
    });
  }
};
// create user route
export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const newUser = new User(body);
    await newUser.save();
    return new NextResponse(
      JSON.stringify({ message: "New user is created", user: newUser }),
      { status: 201 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "Error while creating user",
        message: error.message,
      })
    );
  }
};
