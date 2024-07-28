import connect from "@/lib/database/db";
import User from "@/lib/models/User";
import { Types } from "mongoose";
const ObjectId = require("mongoose").Types.ObjectId;

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
    await connect()
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
// update user name
export const PATCH = async (request: Request) => {
  try {
    const body: any = await request.json();
    const { userId, username } = body;
    console.log(userId, username);

    if (!userId || !username) {
      return new NextResponse(
        JSON.stringify({ message: "User id or username not found" }),
        { status: 400 }
      );
    }
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid user id" }), {
        status: 400,
      });
    }
    await connect();
    // now update the user
    const updatedUser = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { username },
      { new: true }
    );
    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({ message: "No user found in the database" }),
        { status: 404 }
      );
    }
    return new NextResponse(
      JSON.stringify({
        message: "User updated successful.",
        user: updatedUser,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        error: "Error while updating the user name",
        message: error.message,
      }),
      { status: 500 }
    );
  }
};
// delete user

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId: any = searchParams.get("userId");
    console.log(userId);
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid user Id" }), {
        status: 400,
      });
    }
    await connect();
    const deletedUser = await User.findByIdAndDelete(new ObjectId(userId));
    if (!deletedUser) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    return new NextResponse(
      JSON.stringify({ message: "User Deleted Successfully" })
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        message: "Error while deleting the user",
        error: error.message,
      }),
      { status: 500 }
    );
  }
};
