"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Building2,
  Eye,
  EyeOff,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Brand } from "@/lib/types";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchBrands = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("brands")
      .select("*")
      .order("display_order", { ascending: true });

    setBrands(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand? All associated products will also be deleted.")) return;

    setDeleteId(id);
    const response = await fetch(`/api/brands/${id}`, { method: "DELETE" });

    if (response.ok) {
      setBrands(brands.filter((b) => b.id !== id));
    }
    setDeleteId(null);
  };

  const togglePublish = async (brand: Brand) => {
    const response = await fetch(`/api/brands/${brand.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !brand.published }),
    });

    if (response.ok) {
      fetchBrands();
    }
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-steel-100">Brands</h1>
          <p className="text-steel-400 mt-1">
            Manage product brands and manufacturers
          </p>
        </div>
        <Link
          href="/admin/brands/new"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 text-white rounded-lg font-semibold transition-all shadow-lg shadow-safety-500/25"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Brand
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-steel-500" />
        <input
          type="text"
          placeholder="Search brands..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-steel-900 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
        />
      </div>

      {/* Brands List */}
      <div className="bg-steel-900 border border-steel-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-steel-400">Loading...</div>
        ) : filteredBrands.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-steel-400 mb-4">No brands found</p>
            <Link
              href="/admin/brands/new"
              className="text-accent-400 hover:text-accent-300"
            >
              Add your first brand
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-steel-700 bg-steel-800/50">
                <th className="text-left px-6 py-4 text-sm font-semibold text-steel-300">
                  Brand
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-steel-300">
                  Order
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-steel-300">
                  Status
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-steel-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBrands.map((brand, index) => (
                <motion.tr
                  key={brand.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-steel-800 hover:bg-steel-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
                        {brand.logo_url ? (
                          <Image
                            src={brand.logo_url}
                            alt={brand.name}
                            width={40}
                            height={40}
                            className="object-contain p-1"
                          />
                        ) : (
                          <Building2 className="h-5 w-5 text-steel-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-steel-100 font-medium">
                          {brand.name}
                        </p>
                        {brand.description && (
                          <p className="text-steel-500 text-sm truncate max-w-xs">
                            {brand.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-steel-400 text-sm">
                    {brand.display_order}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePublish(brand)}
                      className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                        brand.published
                          ? "bg-green-500/10 text-green-400"
                          : "bg-steel-700 text-steel-400"
                      }`}
                    >
                      {brand.published ? (
                        <>
                          <Eye className="h-3 w-3" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/admin/brands/${brand.id}/edit`}
                        className="p-2 text-steel-400 hover:text-accent-400 hover:bg-steel-800 rounded transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(brand.id)}
                        disabled={deleteId === brand.id}
                        className="p-2 text-steel-400 hover:text-red-400 hover:bg-steel-800 rounded transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
