"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Building2,
  Users,
  FolderOpen,
  Bell,
  UserCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { PortalCustomer, PortalUser } from "@/lib/types";

interface CustomerWithCounts extends PortalCustomer {
  portal_users: { id: string }[];
  portal_projects: { id: string }[];
}

interface UserWithCustomer extends PortalUser {
  portal_customers: { id: string; name: string } | null;
}

export default function AdminPortalPage() {
  const [activeTab, setActiveTab] = useState<"customers" | "users">(
    "customers"
  );
  const [customers, setCustomers] = useState<CustomerWithCounts[]>([]);
  const [users, setUsers] = useState<UserWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [pendingRequests, setPendingRequests] = useState(0);

  const fetchData = async () => {
    const supabase = createClient();

    const { data: customersData } = await supabase
      .from("portal_customers")
      .select("*, portal_users(id), portal_projects(id)")
      .order("name", { ascending: true });

    setCustomers((customersData as CustomerWithCounts[]) || []);

    const { data: usersData } = await supabase
      .from("portal_users")
      .select("*, portal_customers(id, name)")
      .order("name", { ascending: true });

    setUsers((usersData as UserWithCustomer[]) || []);

    const { count } = await supabase
      .from("portal_access_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    setPendingRequests(count || 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteCustomer = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this customer? All associated users, projects, and documents will also be deleted."
      )
    )
      return;

    setDeleteId(id);
    const response = await fetch(`/api/portal/customers/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setCustomers(customers.filter((c) => c.id !== id));
      setUsers(users.filter((u) => u.customer_id !== id));
    }
    setDeleteId(null);
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Remove this user from the portal?")) return;

    setDeleteId(id);
    const response = await fetch(`/api/portal/users/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setUsers(users.filter((u) => u.id !== id));
    }
    setDeleteId(null);
  };

  const toggleUserActive = async (user: UserWithCustomer) => {
    const response = await fetch(`/api/portal/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !user.active }),
    });

    if (response.ok) {
      setUsers(
        users.map((u) =>
          u.id === user.id ? { ...u, active: !u.active } : u
        )
      );
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.portal_customers?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-steel-100">
            Customer Portal
          </h1>
          <p className="text-steel-400 mt-1">
            Manage customers, users, and equipment documentation
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/portal/access-requests"
            className="relative inline-flex items-center px-4 py-2 text-steel-300 border border-steel-600 hover:border-accent-400 hover:text-accent-400 rounded-lg transition-all font-medium"
          >
            <Bell className="h-5 w-5 mr-2" />
            Access Requests
            {pendingRequests > 0 && (
              <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-safety-500 rounded-full">
                {pendingRequests}
              </span>
            )}
          </Link>
          <Link
            href="/admin/portal/customers/new"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 text-white rounded-lg font-semibold transition-all shadow-lg shadow-safety-500/25"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Customer
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-steel-900 border border-steel-700 rounded-lg p-1 mb-6">
        <button
          onClick={() => {
            setActiveTab("customers");
            setSearchQuery("");
          }}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 text-sm font-medium rounded-md transition-all ${
            activeTab === "customers"
              ? "bg-steel-800 text-steel-100"
              : "text-steel-400 hover:text-steel-300"
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Customers</span>
          <span className="text-xs text-steel-500">({customers.length})</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("users");
            setSearchQuery("");
          }}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 text-sm font-medium rounded-md transition-all ${
            activeTab === "users"
              ? "bg-steel-800 text-steel-100"
              : "text-steel-400 hover:text-steel-300"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>All Users</span>
          <span className="text-xs text-steel-500">({users.length})</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-steel-500" />
        <input
          type="text"
          placeholder={
            activeTab === "customers"
              ? "Search customers..."
              : "Search users by name, email, or company..."
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-steel-900 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
        />
      </div>

      {/* Customers Tab */}
      {activeTab === "customers" && (
        <div className="bg-steel-900 border border-steel-700 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-steel-400">Loading...</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-8 text-center">
              <Building2 className="h-12 w-12 text-steel-600 mx-auto mb-4" />
              <p className="text-steel-400 mb-4">No customers found</p>
              <Link
                href="/admin/portal/customers/new"
                className="text-accent-400 hover:text-accent-300"
              >
                Add your first customer
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-steel-700 bg-steel-800/50">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-steel-300">
                    Customer
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-steel-300">
                    Contact
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-steel-300">
                    Users
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-steel-300">
                    Projects
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-steel-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer, index) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-steel-800 hover:bg-steel-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-accent-500/10 rounded-lg">
                          <Building2 className="h-5 w-5 text-accent-400" />
                        </div>
                        <div>
                          <p className="text-steel-100 font-medium">
                            {customer.name}
                          </p>
                          {customer.address && (
                            <p className="text-steel-500 text-sm">
                              {customer.address}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-steel-400 text-sm">
                      {customer.contact_email || "—"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center space-x-1 text-steel-400 text-sm">
                        <Users className="h-4 w-4" />
                        <span>{customer.portal_users?.length || 0}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center space-x-1 text-steel-400 text-sm">
                        <FolderOpen className="h-4 w-4" />
                        <span>{customer.portal_projects?.length || 0}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/admin/portal/customers/${customer.id}/edit`}
                          className="p-2 text-steel-400 hover:text-accent-400 hover:bg-steel-800 rounded transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteCustomer(customer.id)}
                          disabled={deleteId === customer.id}
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
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="bg-steel-900 border border-steel-700 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-steel-400">Loading...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <UserCircle className="h-12 w-12 text-steel-600 mx-auto mb-4" />
              <p className="text-steel-400">
                {searchQuery
                  ? "No users match your search"
                  : "No portal users yet. Add users from a customer's edit page."}
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
                  <th className="text-center px-6 py-4 text-sm font-semibold text-steel-300">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-steel-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-steel-800 hover:bg-steel-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-accent-500/10 rounded-lg">
                          <UserCircle className="h-5 w-5 text-accent-400" />
                        </div>
                        <span className="text-steel-100 font-medium text-sm">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-steel-400 text-sm">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      {user.portal_customers ? (
                        <Link
                          href={`/admin/portal/customers/${user.portal_customers.id}/edit`}
                          className="text-accent-400 hover:text-accent-300 text-sm transition-colors"
                        >
                          {user.portal_customers.name}
                        </Link>
                      ) : (
                        <span className="text-steel-500 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleUserActive(user)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          user.active
                            ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                            : "bg-steel-700 text-steel-400 hover:bg-steel-600"
                        }`}
                      >
                        {user.active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        {user.portal_customers && (
                          <Link
                            href={`/admin/portal/customers/${user.portal_customers.id}/edit`}
                            className="p-2 text-steel-400 hover:text-accent-400 hover:bg-steel-800 rounded transition-colors"
                            title="View Company"
                          >
                            <Building2 className="h-4 w-4" />
                          </Link>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={deleteId === user.id}
                          className="p-2 text-steel-400 hover:text-red-400 hover:bg-steel-800 rounded transition-colors disabled:opacity-50"
                          title="Remove User"
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
      )}
    </div>
  );
}
