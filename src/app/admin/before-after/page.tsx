"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import { useBeforeAfter } from "@/hooks/useApi";
import { Plus, Edit, Trash2, ImageIcon, Calendar } from "lucide-react";
import Image from "next/image";

export default function BeforeAfterPage() {
  const {
    beforeAfters,
    pagination,
    loading,
    error,
    fetchBeforeAfters,
    deleteBeforeAfter,
  } = useBeforeAfter();

  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchBeforeAfters().catch((err) => {
      console.error("Fetch error:", err);
    });
  }, []);

  const handleDelete = async (id: string, treatment: string) => {
    if (!id) {
      alert("Error: No record ID found");
      return;
    }

    if (!confirm(`Are you sure you want to delete "${treatment}" case?`)) {
      return;
    }

    setDeleteLoading(id);
    try {
      await deleteBeforeAfter(id);
    } catch (error) {
      console.error("Error deleting record:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Failed to delete record: ${errorMessage}. Please try again.`);
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const successRate =
    pagination?.total && pagination.total > 0
      ? Math.round((beforeAfters.length * 100) / pagination.total)
      : 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0F2A3B]">
              Before & After Photos
            </h1>
            <p className="text-[#5E6E7E] mt-2">
              Manage treatment transformation photos
            </p>
          </div>

          <Link
            href="/admin/before-after/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2FA4C5] text-white rounded-lg hover:bg-[#2389A7] transition-colors font-medium"
          >
            <Plus size={20} />
            Add New Photos
          </Link>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl border border-[#E6EEF3] p-6">
          <h2 className="text-lg font-semibold text-[#0F2A3B] mb-4">
            Overview
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-[#F7FBFE] rounded-lg">
              <p className="text-2xl font-bold text-[#2FA4C5]">
                {pagination?.total || 0}
              </p>
              <p className="text-sm text-[#5E6E7E]">Total Cases</p>
            </div>

            <div className="text-center p-4 bg-[#F7FBFE] rounded-lg">
              <p className="text-2xl font-bold text-[#2FA4C5]">
                {new Set(beforeAfters.map((b) => b.treatment)).size}
              </p>
              <p className="text-sm text-[#5E6E7E]">Treatment Types</p>
            </div>

            <div className="text-center p-4 bg-[#F7FBFE] rounded-lg">
              <p className="text-2xl font-bold text-[#2FA4C5]">
                {successRate}%
              </p>
              <p className="text-sm text-[#5E6E7E]">Success Rate</p>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-xl border border-[#E6EEF3] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E6EEF3]">
            <h2 className="text-lg font-semibold text-[#0F2A3B]">
              All Cases
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center gap-2 text-[#5E6E7E]">
                <div className="w-5 h-5 border-2 border-[#2FA4C5]/30 border-t-[#2FA4C5] rounded-full animate-spin" />
                Loading cases...
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              Error loading cases: {error}
            </div>
          ) : beforeAfters.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-[#F7FBFE] rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-[#5E6E7E]" />
              </div>
              <h3 className="text-lg font-medium text-[#0F2A3B] mb-2">
                No before/after photos yet
              </h3>
              <p className="text-[#5E6E7E] mb-4">
                Start by adding your first transformation case
              </p>

              <Link
                href="/admin/before-after/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#2FA4C5] text-white rounded-lg hover:bg-[#2389A7] transition-colors"
              >
                <Plus size={16} />
                Add First Case
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#E6EEF3]">
              {beforeAfters.map((item, index) => (
                <div key={item._id || index} className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Images */}
                    <div className="flex gap-4 lg:w-80">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-[#5E6E7E] mb-2 uppercase tracking-wide">
                          Before
                        </p>
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={item.beforeImage}
                            alt={`Before - ${item.treatment}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      <div className="flex-1">
                        <p className="text-xs font-medium text-[#5E6E7E] mb-2 uppercase tracking-wide">
                          After
                        </p>
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={item.afterImage}
                            alt={`After - ${item.treatment}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <span className="px-3 py-1 bg-[#2FA4C5]/10 text-[#2FA4C5] text-sm font-medium rounded-full">
                              {item.treatment}
                            </span>

                            <div className="flex items-center gap-1 text-sm text-[#5E6E7E]">
                              <Calendar className="w-3 h-3" />
                              {formatDate(item.createdAt)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 lg:ml-4">
                          <Link
                            href={`/admin/before-after/${item._id}/edit`}
                            className="p-2 text-[#5E6E7E] hover:text-[#2FA4C5] hover:bg-[#F7FBFE] rounded-lg transition-colors"
                            title="Edit case"
                          >
                            <Edit size={18} />
                          </Link>

                          <button
                            onClick={() =>
                              item._id &&
                              handleDelete(item._id, item.treatment)
                            }
                            disabled={deleteLoading === item._id}
                            className="p-2 text-[#5E6E7E] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete case"
                          >
                            {deleteLoading === item._id ? (
                              <div className="w-[18px] h-[18px] border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}