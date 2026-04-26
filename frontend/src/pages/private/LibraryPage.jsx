import { useState, useEffect } from "react";
import { BookOpen, FileText, Loader, Search } from "lucide-react";
import { documentsApi } from "../../services/documentsApi";

export default function LibraryPage() {
  const [docs,    setDocs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");

  useEffect(() => {
    documentsApi.getSharedDocuments()
      .then(res => setDocs(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = docs.filter(d =>
    d.original_filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 
                       flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-purple-600" />
          Shared Medical Library
        </h1>
        <p className="text-gray-500 mt-1">
          Medical documents shared by admin — available to all users
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 
                           w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search shared documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">
            {search ? "No documents match your search" : "No shared documents yet"}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Admin will upload WHO guidelines, CDC reports, and more
          </p>
        </div>
      ) : (
        <>
          <p className="text-gray-400 text-sm mb-4">
            {filtered.length} document{filtered.length !== 1 ? "s" : ""} available
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(doc => (
              <div key={doc.id}
                   className="card flex items-start gap-4 
                              hover:shadow-md transition-shadow">
                <div className="bg-purple-100 p-3 rounded-xl flex-shrink-0">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {doc.original_filename}
                  </p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {doc.file_size && (
                      <span className="text-xs text-gray-400">
                        {doc.file_size} MB
                      </span>
                    )}
                    {doc.chunk_count && (
                      <span className="text-xs text-gray-400">
                        {doc.chunk_count} chunks
                      </span>
                    )}
                    <span className="text-xs bg-purple-100 
                                     text-purple-700 px-2 py-0.5 
                                     rounded-full font-medium">
                      Admin Shared
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}