"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Upload, X } from "lucide-react";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const TYPES = ["image/jpeg", "image/png", "image/webp"];

type ImagePickerProps = {
  initialUrl?: string | null;
  onChange: (file: File | null) => void;
};

export default function ImagePicker({
  initialUrl = null,
  onChange,
}: ImagePickerProps) {
  const [preview, setPreview] = useState<string | null>(initialUrl);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Sync the preview if the existing property image changes.
  useEffect(() => {
    setPreview(initialUrl);
  }, [initialUrl]);

  // Release temporary preview URLs to prevent memory leaks.
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFile = (file: File | null) => {
    setError(null);

    if (!file) return;

    if (!TYPES.includes(file.type)) {
      setError("Please select a JPG, PNG or WebP image.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (file.size > MAX_SIZE) {
      setError("Image must not exceed 5 MB.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setPreview(URL.createObjectURL(file));
    setFileName(file.name);
    onChange(file);
  };

  const clear = () => {
    setPreview(initialUrl);
    setFileName(null);
    setError(null);
    onChange(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        id="image"
        name="image"
        type="file"
        accept={TYPES.join(",")}
        className="hidden"
        onChange={(e) => handleFile(e.currentTarget.files?.[0] ?? null)}
      />

      <div
        className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        {/* Image preview */}
        <div
          className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg"
          style={{
            width: 160,
            height: 112,
            background: "var(--surface-secondary)",
          }}
        >
          {preview ? (
            <img
              src={preview}
              alt="Property cover preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ImagePlus size={28} style={{ color: "var(--secondary-text)" }} />
              <span
                className="text-xs"
                style={{ color: "var(--secondary-text)" }}
              >
                No image
              </span>
            </div>
          )}
        </div>

        {/* Upload controls */}
        <div className="min-w-0 flex-1">
          <h6
            className="mb-1 font-semibold"
            style={{ color: "var(--main-text)" }}
          >
            Property cover image
          </h6>

          <p
            className="mb-3 text-sm"
            style={{ color: "var(--secondary-text)" }}
          >
            Upload an image to represent your property.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors"
              style={{ background: "var(--primary)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--primary-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--primary)";
              }}
            >
              <Upload size={16} />
              {preview ? "Replace image" : "Choose image"}
            </button>

            {preview && (
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm transition-colors"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--secondary-text)",
                }}
              >
                <X size={15} />
                Reset
              </button>
            )}
          </div>

          {fileName && (
            <p
              className="mt-2 truncate text-xs"
              style={{ color: "var(--secondary-text)" }}
              title={fileName}
            >
              Selected: {fileName}
            </p>
          )}

          <p className="mt-2 text-xs" style={{ color: "var(--muted-text)" }}>
            JPG, PNG or WebP · Maximum 5 MB
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
