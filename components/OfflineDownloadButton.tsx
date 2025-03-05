"use client";

import { useState } from "react";

export default function OfflineDownloadButton({
  memberDocuments,
}: {
  memberDocuments: { [memberId: string]: string[] };
}) {
  const [downloading, setDownloading] = useState(false);

  const downloadAllForOffline = async () => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      setDownloading(true);

      // Flatten all member document URLs into a single list
      const allDocuments = Object.values(memberDocuments).flat();

      navigator.serviceWorker.controller.postMessage({
        type: "CACHE_ALL",
        files: allDocuments,
      });

      setTimeout(() => setDownloading(false), 3000); // Simulate download completion
    } else {
      alert("Service Worker not registered. Please reload the page.");
    }
  };

  return (
    <button
      onClick={downloadAllForOffline}
      className="bg-blue-600 text-white px-4 py-2 rounded-md"
      disabled={downloading}
    >
      {downloading ? "Downloading..." : "Download All for Offline"}
    </button>
  );
}
