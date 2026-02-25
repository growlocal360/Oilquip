"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  X,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "date-fns";
import type { PortalAccessRequest } from "@/lib/types";

export default function AccessRequestsPage() {
  const [requests, setRequests] = useState<PortalAccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("pending");

  const fetchRequests = async () => {
    const supabase = createClient();

    let query = supabase
      .from("portal_access_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data } = await query;
    setRequests(data || []);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchRequests();
  }, [statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    const response = await fetch(`/api/portal/access-requests/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      fetchRequests();
    }
  };

  const deleteRequest = async (id: string) => {
    if (!confirm("Delete this access request?")) return;

    const response = await fetch(`/api/portal/access-requests/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setRequests(requests.filter((r) => r.id !== id));
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-4 mb-8">
        <Link
          href="/admin/portal"
          className="p-2 text-steel-400 hover:text-steel-200 hover:bg-steel-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-steel-100">
            Access Requests
          </h1>
          <p className="text-steel-400 mt-1">
            Review portal access requests from customers
          </p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex space-x-2 mb-6">
        {["pending", "approved", "denied", "all"].map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === filter
                ? "bg-accent-500/10 text-accent-400 border border-accent-500/30"
                : "text-steel-400 hover:text-steel-200 hover:bg-steel-800 border border-steel-700"
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="bg-steel-900 border border-steel-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-steel-400">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center">
            <Clock className="h-12 w-12 text-steel-600 mx-auto mb-4" />
            <p className="text-steel-400">
              No {statusFilter !== "all" ? statusFilter : ""} access requests
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-steel-700 bg-steel-800/50">
                <th className="text-left px-6 py-4 text-sm font-semibold text-steel-300">
                  Name
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-steel-300">
                  Email
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-steel-300">
                  Company
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-steel-300">
                  Message
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-steel-300">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-steel-300">
                  Date
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-steel-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <motion.tr
                  key={request.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-steel-800 hover:bg-steel-800/30 transition-colors"
                >
                  <td className="px-6 py-4 text-steel-100 text-sm font-medium">
                    {request.name}
                  </td>
                  <td className="px-6 py-4 text-steel-400 text-sm">
                    {request.email}
                  </td>
                  <td className="px-6 py-4 text-steel-400 text-sm">
                    {request.company_name}
                  </td>
                  <td className="px-6 py-4 text-steel-500 text-sm max-w-xs truncate">
                    {request.message || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${
                        request.status === "pending"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : request.status === "approved"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {request.status === "pending" && (
                        <Clock className="h-3 w-3" />
                      )}
                      {request.status === "approved" && (
                        <CheckCircle className="h-3 w-3" />
                      )}
                      {request.status === "denied" && (
                        <XCircle className="h-3 w-3" />
                      )}
                      <span>{request.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-steel-500 text-sm">
                    {formatDistanceToNow(new Date(request.created_at), {
                      addSuffix: true,
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-1">
                      {request.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              updateStatus(request.id, "approved")
                            }
                            className="p-2 text-steel-400 hover:text-green-400 hover:bg-steel-800 rounded transition-colors"
                            title="Approve"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => updateStatus(request.id, "denied")}
                            className="p-2 text-steel-400 hover:text-red-400 hover:bg-steel-800 rounded transition-colors"
                            title="Deny"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deleteRequest(request.id)}
                        className="p-2 text-steel-400 hover:text-red-400 hover:bg-steel-800 rounded transition-colors"
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
