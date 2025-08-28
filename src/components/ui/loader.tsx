"use client";

export default function Loader({ height = 450 }: { height?: number }) {
  return (
    <div
      className="w-full flex items-center justify-center  rounded-2xl"
      style={{ height }}

    >
        <p className="absolute text-center  font-medium">
        Loading...

        </p>
      <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-red-600 border-solid"></div>
    </div>
  );
}
