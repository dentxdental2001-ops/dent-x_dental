import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BeforeAfter from "@/models/BeforeAfter";
import {
  deleteFromCloudinary,
  extractPublicIdFromUrl,
} from "@/lib/cloudinary";
import mongoose from "mongoose";

function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

/* ==============================
   GET
============================== */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isValidObjectId(params.id)) {
      return NextResponse.json(
        { success: false, error: "Invalid record ID format" },
        { status: 400 }
      );
    }

    await connectDB();

    const beforeAfter = await BeforeAfter.findById(params.id);

    if (!beforeAfter) {
      return NextResponse.json(
        { success: false, error: "Before/After record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: beforeAfter,
    });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch before/after record" },
      { status: 500 }
    );
  }
}

/* ==============================
   PUT
============================== */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isValidObjectId(params.id)) {
      return NextResponse.json(
        { success: false, error: "Invalid record ID format" },
        { status: 400 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { beforeImage, afterImage, treatment } = body;

    if (!beforeImage || !afterImage) {
      return NextResponse.json(
        { success: false, error: "Both before and after images are required" },
        { status: 400 }
      );
    }

    if (!treatment?.trim()) {
      return NextResponse.json(
        { success: false, error: "Treatment is required" },
        { status: 400 }
      );
    }

    const beforeAfter = await BeforeAfter.findById(params.id);

    if (!beforeAfter) {
      return NextResponse.json(
        { success: false, error: "Before/After record not found" },
        { status: 404 }
      );
    }

    const deletePromises = [];

    if (
      beforeImage !== beforeAfter.beforeImage &&
      beforeAfter.beforeImage
    ) {
      const oldId = extractPublicIdFromUrl(beforeAfter.beforeImage);
      if (oldId) deletePromises.push(deleteFromCloudinary(oldId));
    }

    if (
      afterImage !== beforeAfter.afterImage &&
      beforeAfter.afterImage
    ) {
      const oldId = extractPublicIdFromUrl(beforeAfter.afterImage);
      if (oldId) deletePromises.push(deleteFromCloudinary(oldId));
    }

    if (deletePromises.length) {
      Promise.allSettled(deletePromises);
    }

    const updated = await BeforeAfter.findByIdAndUpdate(
      params.id,
      {
        beforeImage,
        afterImage,
        treatment: treatment.trim(),
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update before/after record" },
      { status: 500 }
    );
  }
}

/* ==============================
   DELETE
============================== */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isValidObjectId(params.id)) {
      return NextResponse.json(
        { success: false, error: "Invalid record ID format" },
        { status: 400 }
      );
    }

    await connectDB();

    const beforeAfter = await BeforeAfter.findById(params.id);

    if (!beforeAfter) {
      return NextResponse.json(
        { success: false, error: "Before/After record not found" },
        { status: 404 }
      );
    }

    await BeforeAfter.findByIdAndDelete(params.id);

    const deletePromises = [];

    if (beforeAfter.beforeImage) {
      const id = extractPublicIdFromUrl(beforeAfter.beforeImage);
      if (id) deletePromises.push(deleteFromCloudinary(id));
    }

    if (beforeAfter.afterImage) {
      const id = extractPublicIdFromUrl(beforeAfter.afterImage);
      if (id) deletePromises.push(deleteFromCloudinary(id));
    }

    if (deletePromises.length) {
      Promise.allSettled(deletePromises);
    }

    return NextResponse.json({
      success: true,
      message: "Before/After record deleted successfully",
    });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete before/after record" },
      { status: 500 }
    );
  }
}