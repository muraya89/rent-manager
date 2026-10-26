"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";
import { validateImage } from "@/lib/imageValidation";

export async function createProperty(formData: FormData) {
  // TODO: const user = await requireUser(); and save ownerId once you add it

  // 1. Read and check the text fields (the browser's checks can be bypassed)
  const name = String(formData.get("name") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const monthlyRent = Number(formData.get("monthlyRent"));

  if (!name || !address) {
    return { ok: false as const, error: "Name and address are required" };
  }
  if (!Number.isFinite(monthlyRent) || monthlyRent < 0) {
    return { ok: false as const, error: "Enter a valid monthly rent" };
  }

  // 2. Check the image BEFORE touching the database
  const file = formData.get("image");
  const image = file instanceof File && file.size > 0 ? file : null;

  if (image) {
    const imageError = validateImage(image);
    if (imageError) return { ok: false as const, error: imageError };
  }

  // 3. Create the property without an image
  let propertyId: number;
  try {
    const property = await prisma.property.create({
      data: { name, address, monthlyRent },
      select: { id: true },
    });
    propertyId = property.id;
  } catch (error) {
    console.error("Failed to create property:", error);
    return {
      ok: false as const,
      error: "Could not create the property. Please try again.",
    };
  }

  // 4. Upload the image and attach it. A failure here must not undo step 3.
  let imageFailed = false;
  if (image) {
    try {
      const { url, publicId } = await uploadImage(image, "rentwise/properties");
      await prisma.property.update({
        where: { id: propertyId },
        data: { coverImageUrl: url, coverImagePublicId: publicId },
      });
    } catch (error) {
      console.error("Image upload failed for property", propertyId, error);
      imageFailed = true;
    }
  }

  revalidatePath("/dashboard/properties");

  // 5. Redirect OUTSIDE any try/catch, because redirect() works by throwing
  const params = new URLSearchParams({
    success: `Property ${name} created successfully`,
  });
  if (imageFailed) {
    params.set(
      "warning",
      "The cover image could not be uploaded. You can add it by editing the property.",
    );
  }
  redirect(`/dashboard/properties?${params.toString()}`);
}

export async function updatePropertyImage(
  propertyId: number,
  formData: FormData,
) {
  // TODO: check the logged-in user owns this property (see the ownership step)

  const file = formData.get("image");

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false as const, error: "Please choose an image" };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { ok: false as const, error: "Use a JPG, PNG or WebP image" };
  }
  if (file.size > MAX_SIZE) {
    return { ok: false as const, error: "Image must be under 5 MB" };
  }

  const existing = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { coverImagePublicId: true },
  });

  const { url, publicId } = await uploadImage(file, "rentwise/properties");

  await prisma.property.update({
    where: { id: propertyId },
    data: { coverImageUrl: url, coverImagePublicId: publicId },
  });

  // Clean up the old image. A failure here shouldn't break the save.
  if (existing?.coverImagePublicId) {
    await deleteImage(existing.coverImagePublicId).catch(console.error);
  }

  revalidatePath(`/dashboard/properties/${propertyId}`);
  revalidatePath("/dashboard/properties");
  return { ok: true as const, url };
}
