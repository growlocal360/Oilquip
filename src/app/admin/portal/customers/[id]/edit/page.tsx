"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Plus,
  Pencil,
  Trash2,
  Users,
  FolderOpen,
  UserPlus,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { PortalCustomer, PortalUser, PortalProject } from "@/lib/types";

interface ProjectWithDocs extends PortalProject {
  portal_documents: { id: string }[];
}

export default function EditCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Customer fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [address, setAddress] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  // Related data
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [projects, setProjects] = useState<ProjectWithDocs[]>([]);

  // Add user form
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [addingUser, setAddingUser] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const { data: customer } = await supabase
        .from("portal_customers")
        .select("*")
        .eq("id", id)
        .single();

      if (customer) {
        setName(customer.name);
        setSlug(customer.slug);
        setContactEmail(customer.contact_email || "");
        setContactPhone(customer.contact_phone || "");
        setAddress(customer.address || "");
        setLogoUrl(customer.logo_url || null);
        setLogoPreview(customer.logo_url || null);
        setNotes(customer.notes || "");
      }

      const { data: usersData } = await supabase
        .from("portal_users")
        .select("*")
        .eq("customer_id", id)
        .order("name", { ascending: true });

      setUsers(usersData || []);

      const { data: projectsData } = await supabase
        .from("portal_projects")
        .select("*, portal_documents(id)")
        .eq("customer_id", id)
        .order("created_at", { ascending: false });

      setProjects((projectsData as ProjectWithDocs[]) || []);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    setSaving(true);

    const supabase = createClient();
    let finalLogoUrl = logoUrl;

    if (logoFile) {
      const ext = logoFile.name.split(".").pop();
      const fileName = `logos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("portal")
        .upload(fileName, logoFile);

      if (uploadError) {
        alert("Failed to upload logo: " + uploadError.message);
        setSaving(false);
        return;
      }

      const { data: publicUrl } = supabase.storage
        .from("portal")
        .getPublicUrl(fileName);
      finalLogoUrl = publicUrl.publicUrl;
    }

    const response = await fetch(`/api/portal/customers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        slug,
        contact_email: contactEmail || null,
        contact_phone: contactPhone || null,
        address: address || null,
        logo_url: finalLogoUrl,
        notes: notes || null,
      }),
    });

    if (response.ok) {
      alert("Customer updated successfully");
    } else {
      const error = await response.json();
      alert(error.error || "Failed to update customer");
    }

    setSaving(false);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    setAddingUser(true);

    const response = await fetch(`/api/portal/customers/${id}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newUserName,
        email: newUserEmail,
      }),
    });

    if (response.ok) {
      const newUser = await response.json();
      setUsers([...users, newUser]);
      setNewUserName("");
      setNewUserEmail("");
      setShowAddUser(false);
    } else {
      const error = await response.json();
      alert(error.error || "Failed to add user");
    }

    setAddingUser(false);
  };

  const toggleUserActive = async (user: PortalUser) => {
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

  const deleteUser = async (userId: string) => {
    if (!confirm("Remove this user from the portal?")) return;

    const response = await fetch(`/api/portal/users/${userId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setUsers(users.filter((u) => u.id !== userId));
    }
  };

  const deleteProject = async (projectId: string) => {
    if (
      !confirm(
        "Delete this project and all its documents? This cannot be undone."
      )
    )
      return;

    const response = await fetch(`/api/portal/projects/${projectId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setProjects(projects.filter((p) => p.id !== projectId));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-steel-800 rounded" />
        <div className="h-64 bg-steel-900 rounded-xl" />
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-steel-100">Edit Customer</h1>
          <p className="text-steel-400 mt-1">{name}</p>
        </div>
      </div>

      {/* Customer Details Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <label className="block text-sm font-medium text-steel-300 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <label className="block text-sm font-medium text-steel-300 mb-2">
                URL Slug *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-steel-300 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label className="block text-sm font-medium text-steel-300 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-steel-300 mb-2">
                Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors resize-none"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label className="block text-sm font-medium text-steel-300 mb-2">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-steel-800 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors resize-none"
              />
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-steel-900 border border-steel-700 rounded-xl p-6"
            >
              <label className="block text-sm font-medium text-steel-300 mb-3">
                Company Logo
              </label>
              {logoPreview ? (
                <div className="relative mb-3">
                  <Image
                    src={logoPreview}
                    alt="Logo preview"
                    width={200}
                    height={200}
                    className="w-full h-32 object-contain bg-steel-800 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setLogoFile(null);
                      setLogoPreview(null);
                      setLogoUrl(null);
                    }}
                    className="absolute top-2 right-2 p-1 bg-steel-900/80 text-steel-400 hover:text-red-400 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 bg-steel-800 border-2 border-dashed border-steel-600 hover:border-accent-500/50 rounded-lg cursor-pointer transition-colors mb-3">
                  <Upload className="h-8 w-8 text-steel-500 mb-2" />
                  <span className="text-sm text-steel-400">Upload logo</span>
                  <span className="text-xs text-steel-500 mt-1">JPG, PNG, SVG, WebP</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.svg,.webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setLogoFile(file);
                      setLogoPreview(URL.createObjectURL(file));
                    }}
                    className="hidden"
                  />
                </label>
              )}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              type="submit"
              disabled={saving || !name || !slug}
              className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-safety-600 to-safety-500 hover:from-safety-500 hover:to-safety-400 disabled:from-steel-700 disabled:to-steel-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-safety-500/25 disabled:shadow-none"
            >
              <Save className="h-5 w-5" />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </motion.button>
          </div>
        </div>
      </form>

      {/* Portal Users Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-12"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Users className="h-5 w-5 text-accent-400" />
            <h2 className="text-xl font-semibold text-steel-100">
              Portal Users
            </h2>
            <span className="text-steel-500 text-sm">({users.length})</span>
          </div>
          <button
            onClick={() => setShowAddUser(!showAddUser)}
            className="inline-flex items-center px-3 py-1.5 text-sm text-accent-400 hover:text-accent-300 border border-accent-500/30 hover:border-accent-500/50 rounded-lg transition-colors"
          >
            {showAddUser ? (
              <>
                <X className="h-4 w-4 mr-1" /> Cancel
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-1" /> Add User
              </>
            )}
          </button>
        </div>

        {/* Add User Form */}
        {showAddUser && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            onSubmit={handleAddUser}
            className="bg-steel-800 border border-steel-700 rounded-lg p-4 mb-4"
          >
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-steel-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 bg-steel-900 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors text-sm"
                  placeholder="John Smith"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-steel-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-steel-900 border border-steel-700 focus:border-accent-500 rounded-lg text-steel-100 placeholder-steel-500 outline-none transition-colors text-sm"
                  placeholder="john@company.com"
                  required
                />
              </div>
            </div>
            <p className="text-steel-500 text-xs mb-3">
              The user must have a Supabase Auth account with this email to log
              in. You can create one in the Supabase dashboard.
            </p>
            <button
              type="submit"
              disabled={addingUser || !newUserName || !newUserEmail}
              className="px-4 py-2 bg-accent-500 hover:bg-accent-400 disabled:bg-steel-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {addingUser ? "Adding..." : "Add User"}
            </button>
          </motion.form>
        )}

        <div className="bg-steel-900 border border-steel-700 rounded-xl overflow-hidden">
          {users.length === 0 ? (
            <div className="p-6 text-center text-steel-500 text-sm">
              No users added yet. Add a user to give them portal access.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-steel-700 bg-steel-800/50">
                  <th className="text-left px-6 py-3 text-sm font-semibold text-steel-300">
                    Name
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-steel-300">
                    Email
                  </th>
                  <th className="text-center px-6 py-3 text-sm font-semibold text-steel-300">
                    Status
                  </th>
                  <th className="text-right px-6 py-3 text-sm font-semibold text-steel-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-steel-800 hover:bg-steel-800/30 transition-colors"
                  >
                    <td className="px-6 py-3 text-steel-100 text-sm">
                      {user.name}
                    </td>
                    <td className="px-6 py-3 text-steel-400 text-sm">
                      {user.email}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => toggleUserActive(user)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.active
                            ? "bg-green-500/10 text-green-400"
                            : "bg-steel-700 text-steel-400"
                        }`}
                      >
                        {user.active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="p-1 text-steel-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

      {/* Projects Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FolderOpen className="h-5 w-5 text-accent-400" />
            <h2 className="text-xl font-semibold text-steel-100">Projects</h2>
            <span className="text-steel-500 text-sm">
              ({projects.length})
            </span>
          </div>
          <Link
            href={`/admin/portal/customers/${id}/projects/new`}
            className="inline-flex items-center px-3 py-1.5 text-sm text-accent-400 hover:text-accent-300 border border-accent-500/30 hover:border-accent-500/50 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Project
          </Link>
        </div>

        <div className="bg-steel-900 border border-steel-700 rounded-xl overflow-hidden">
          {projects.length === 0 ? (
            <div className="p-6 text-center text-steel-500 text-sm">
              No projects yet.{" "}
              <Link
                href={`/admin/portal/customers/${id}/projects/new`}
                className="text-accent-400 hover:text-accent-300"
              >
                Add the first project
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-steel-700 bg-steel-800/50">
                  <th className="text-left px-6 py-3 text-sm font-semibold text-steel-300">
                    Project
                  </th>
                  <th className="text-center px-6 py-3 text-sm font-semibold text-steel-300">
                    Status
                  </th>
                  <th className="text-center px-6 py-3 text-sm font-semibold text-steel-300">
                    Documents
                  </th>
                  <th className="text-right px-6 py-3 text-sm font-semibold text-steel-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-steel-800 hover:bg-steel-800/30 transition-colors"
                  >
                    <td className="px-6 py-3">
                      <p className="text-steel-100 font-medium text-sm">
                        {project.name}
                      </p>
                      {project.description && (
                        <p className="text-steel-500 text-xs truncate max-w-xs">
                          {project.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          project.status === "active"
                            ? "bg-green-500/10 text-green-400"
                            : project.status === "completed"
                              ? "bg-steel-700 text-steel-400"
                              : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center text-steel-400 text-sm">
                      {project.portal_documents?.length || 0}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/admin/portal/customers/${id}/projects/${project.id}/edit`}
                          className="p-1 text-steel-400 hover:text-accent-400 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="p-1 text-steel-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
}
