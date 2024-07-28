import connect from "@/lib/database/db";
import Category from "@/lib/models/Category";
import User from "@/lib/models/User";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const PATCH = async (
  request: Request,
  { params }: { params: { category: string } }
) => {
  try {
    const body: any = await request.json();
    const { title } = body;
    const categoryId = params.category;
    //   search params query string
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return (
        new NextResponse(
          JSON.stringify({ message: "Invalid user id or missing user id" })
        ),
        { status: 400 }
      );
    }
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return (
        new NextResponse(
          JSON.stringify({
            message: "Invalid category id or missing category id",
          })
        ),
        { status: 400 }
      );
    }
    //   connect to the database
    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return (
        new NextResponse(JSON.stringify({ message: "User not found" })),
        { status: 404 }
      );
    }
    const category = await Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        { status: 404 }
      );
    }
    // now update the category
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      {
        title,
      },
      { new: true }
    );
    return new NextResponse(
      JSON.stringify({
        message: "Category successfully updated",
        category: updatedCategory,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        message: "Error in while updating category",
        error: error.message,
      }),
      { status: 500 }
    );
  }
};
