// import { useEffect, useState } from "react";
// import { documentsApi } from "../../services/documentsApi";

// export default function DocumentsPage() {
//   const [myDocs, setMyDocs] = useState([]);
//   const [sharedDocs, setSharedDocs] = useState([]);
//   const [error, setError] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [deletingId, setDeletingId] = useState(null);

//   const loadDocuments = async () => {
//     try {
//       const [myRes, sharedRes] = await Promise.all([
//         documentsApi.getMyDocuments(),
//         documentsApi.getSharedDocuments(),
//       ]);
//       setMyDocs(myRes.data || []);
//       setSharedDocs(sharedRes.data || []);
//     } catch (err) {
//       setError(err.response?.data?.detail || "Failed to load documents.");
//     }
//   };

//   useEffect(() => {
//     loadDocuments();
//   }, []);

//   // Upload handler
//   const handleUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     try {
//       setUploading(true);

//       const formData = new FormData();
//       formData.append("file", file);

//       await documentsApi.uploadDocument(formData);

//       await loadDocuments();
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.detail || "Upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // 🔥 Delete handler
//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this file?")) return;

//     try {
//       setDeletingId(id);
//       await documentsApi.deleteDocument(id);
//       await loadDocuments();
//     } catch (err) {
//       alert(err.response?.data?.detail || "Delete failed");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-2xl font-semibold text-gray-800 mb-6">
//         Documents
//       </h1>

//       {/* Upload Card */}
//       <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
//         <h2 className="text-lg font-medium text-gray-700 mb-4">
//           Upload PDF
//         </h2>

//         <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
//           <span className="text-sm text-gray-500">
//             Click to upload or drag & drop PDF
//           </span>

//           <input
//             type="file"
//             accept="application/pdf"
//             onChange={handleUpload}
//             disabled={uploading}
//             className="hidden"
//           />
//         </label>

//         {uploading && (
//           <p className="text-sm text-blue-600 mt-2">
//             Uploading...
//           </p>
//         )}
//       </div>

//       {error && (
//         <p className="text-red-500 mb-4 text-sm">{error}</p>
//       )}

//       {/* Documents Grid */}
//       <div className="grid md:grid-cols-2 gap-6">

//         {/* My Documents */}
//         <div className="bg-white border border-gray-200 rounded-xl p-5">
//           <h2 className="text-gray-800 font-medium mb-3">
//             My Documents ({myDocs.length})
//           </h2>

//           {myDocs.length === 0 ? (
//             <p className="text-sm text-gray-500">
//               No documents uploaded yet.
//             </p>
//           ) : (
//             <ul className="space-y-2">
//               {myDocs.map((d) => (
//                 <li
//                   key={d.id}
//                   className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50 transition"
//                 >
//                   <span className="text-sm text-gray-700">
//                     {d.original_filename || d.filename}
//                   </span>

//                   <button
//                     onClick={() => handleDelete(d.id)}
//                     disabled={deletingId === d.id}
//                     className="text-red-500 text-xs hover:text-red-700 transition"
//                   >
//                     {deletingId === d.id ? "Deleting..." : "Delete"}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* Shared Library */}
//         <div className="bg-white border border-gray-200 rounded-xl p-5">
//           <h2 className="text-gray-800 font-medium mb-3">
//             Shared Library ({sharedDocs.length})
//           </h2>

//           {sharedDocs.length === 0 ? (
//             <p className="text-sm text-gray-500">
//               No shared documents yet.
//             </p>
//           ) : (
//             <ul className="space-y-2">
//               {sharedDocs.map((d) => (
//                 <li
//                   key={d.id}
//                   className="p-2 rounded-md hover:bg-gray-50 text-sm text-gray-700"
//                 >
//                   {d.original_filename || d.filename}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import {
  Upload, FileText, Trash2, AlertCircle,
  CheckCircle, Loader, BookOpen
} from "lucide-react";
import { documentsApi } from "../../services/documentsApi";
import Toast from "../../components/ui/Toast";

export default function DocumentsPage() {
  const [myDocs,    setMyDocs]    = useState([]);
  const [sharedDocs, setSharedDocs] = useState([]);
  const [uploading,  setUploading]  = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [toast,      setToast]      = useState(null);
  const [dragOver,   setDragOver]   = useState(false);
  const fileInputRef                = useRef(null);

  const showToast = (message, type = "success") =>
    setToast({ message, type });

  const fetchDocuments = async () => {
    try {
      const [myRes, sharedRes] = await Promise.all([
        documentsApi.getMyDocuments(),
        documentsApi.getSharedDocuments()
      ]);
      setMyDocs(myRes.data);
      setSharedDocs(sharedRes.data);
    } catch (err) {
      showToast("Failed to load documents", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocuments(); }, []);

  const handleUpload = async (file) => {
    if (!file || file.type !== "application/pdf") {
      showToast("Please upload a PDF file only", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);

    try {
      await documentsApi.uploadDocument(formData);
      showToast("PDF uploaded and processed successfully!");
      fetchDocuments();
    } catch (err) {
      showToast(
        err.response?.data?.detail || "Upload failed",
        "error"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId, filename) => {
    if (!confirm(`Delete "${filename}"?`)) return;
    try {
      await documentsApi.deleteDocument(docId);
      showToast("Document deleted");
      fetchDocuments();
    } catch (err) {
      showToast("Failed to delete document", "error");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        📄 My Documents
      </h1>

      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 
                    text-center cursor-pointer transition-all mb-8
          ${dragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 hover:border-blue-400 hover:bg-gray-50"
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files[0])}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader className="w-10 h-10 text-blue-500 animate-spin" />
            <p className="text-blue-600 font-medium">
              Processing PDF — building vector index...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="w-10 h-10 text-gray-400" />
            <p className="text-gray-600 font-medium">
              Drag & drop PDF here or{" "}
              <span className="text-blue-600">browse</span>
            </p>
            <p className="text-gray-400 text-sm">
              Max 10MB — Medical PDFs only
            </p>
          </div>
        )}
      </div>

      {/* My Documents */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          My Private Documents ({myDocs.length})
        </h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : myDocs.length === 0 ? (
          <div className="card text-center py-10">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">
              No documents yet. Upload your first PDF above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myDocs.map(doc => (
              <div key={doc.id} className="card flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-xl flex-shrink-0">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {doc.original_filename}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400">
                      {doc.file_size} MB
                    </span>
                    {doc.chunk_count && (
                      <span className="text-xs text-gray-400">
                        {doc.chunk_count} chunks
                      </span>
                    )}
                    {doc.is_processed && (
                      <span className="flex items-center gap-1 
                                       text-xs text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        Indexed
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleDelete(doc.id, doc.original_filename)
                  }
                  className="text-red-400 hover:text-red-600 
                             transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Shared Library */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 
                       flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-600" />
          Shared Medical Library ({sharedDocs.length})
        </h2>

        {sharedDocs.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-400 text-sm">
              No shared documents available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sharedDocs.map(doc => (
              <div key={doc.id} className="card flex items-start gap-4 
                                           border-purple-100">
                <div className="bg-purple-100 p-3 rounded-xl flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {doc.original_filename}
                  </p>
                  <span className="text-xs text-purple-500 font-medium">
                    Admin Shared
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}