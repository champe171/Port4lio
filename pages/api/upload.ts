import { readFile } from "node:fs/promises";

import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { type File as FormidableFile } from "formidable";

import { uploadToCloudinary } from "@/lib/cloudinary";
import { MAX_UPLOAD_BYTES } from "@/lib/upload-limits";
import { requireOwnerAuth } from "@/lib/auth";

const ALLOWED_KINDS = new Set([
  "avatar",
  "cv",
  "hero-left",
  "hero-right",
  "intro-photo",
  "exp-cover",
]);

type UploadResponse = { url: string } | { error: string };

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(
  req: NextApiRequest,
): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  const form = formidable({ multiples: false, maxFileSize: MAX_UPLOAD_BYTES });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

function getSingleFieldValue(
  v: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

function getSingleFile(
  file: FormidableFile | FormidableFile[] | undefined,
): FormidableFile | undefined {
  if (Array.isArray(file)) return file[0];
  return file;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadResponse>,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!requireOwnerAuth(req, res)) return;

  try {
    const { fields, files } = await parseForm(req);
    const kindRaw = getSingleFieldValue(
      fields.kind as string | string[] | undefined,
    );

    if (typeof kindRaw !== "string" || !ALLOWED_KINDS.has(kindRaw)) {
      return res.status(400).json({
        error:
          "Invalid or missing kind (avatar | cv | hero-left | hero-right | intro-photo | exp-cover)",
      });
    }

    const file = getSingleFile(
      files.file as FormidableFile | FormidableFile[] | undefined,
    );
    if (!file) {
      return res.status(400).json({ error: "Missing file" });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return res.status(413).json({
        error: `File exceeds ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB limit`,
      });
    }

    let folder: string;
    if (kindRaw === "avatar") {
      folder = "portfolio/avatar";
    } else if (kindRaw === "cv") {
      folder = "portfolio/cv";
    } else if (kindRaw === "hero-left") {
      folder = "portfolio/hero/left";
    } else if (kindRaw === "hero-right") {
      folder = "portfolio/hero/right";
    } else if (kindRaw === "intro-photo") {
      folder = "portfolio/intro";
    } else if (kindRaw === "exp-cover") {
      folder = "portfolio/experience";
    } else {
      return res.status(400).json({ error: "Invalid kind" });
    }

    const buffer = await readFile(file.filepath);
    const bytes = new Uint8Array(buffer);
    const webFile = new File([bytes], file.originalFilename || "upload", {
      type: file.mimetype || "application/octet-stream",
    });

    const uploaded = await uploadToCloudinary(webFile, folder);
    return res.status(200).json({ url: uploaded.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed";
    return res.status(500).json({ error: message });
  }
}
