"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FolderOpen, FileText, ChevronRight } from "lucide-react";
import type { PortalProject } from "@/lib/types";

interface ProjectWithDocs extends Omit<PortalProject, "customer"> {
  portal_documents: { id: string }[];
  customer?: { id: string; name: string };
  portal_customers?: { id: string; name: string };
}

export default function PortalDashboard() {
  const [projects, setProjects] = useState<ProjectWithDocs[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Get current portal user info
      const meResponse = await fetch("/api/portal/me");
      if (!meResponse.ok) return;
      const portalUser = await meResponse.json();

      if (portalUser.is_admin) {
        setIsAdmin(true);
        setCustomerName("Admin");

        // Fetch ALL projects across all customers
        const allProjectsResponse = await fetch("/api/portal/projects");
        if (allProjectsResponse.ok) {
          const data = await allProjectsResponse.json();
          setProjects(data);
        }
      } else {
        setCustomerName(portalUser.customer?.name || "");

        // Get projects for this customer
        const projectsResponse = await fetch(
          `/api/portal/customers/${portalUser.customer_id}/projects`
        );
        if (projectsResponse.ok) {
          const data = await projectsResponse.json();
          setProjects(data);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-steel-800 rounded animate-pulse" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 bg-steel-900 border border-steel-700 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-steel-100">
          {isAdmin ? "All Customer Projects" : `Welcome back${customerName ? `, ${customerName}` : ""}`}
        </h1>
        <p className="text-steel-400 mt-2">
          {isAdmin
            ? "Viewing all projects across all customers."
            : "View your equipment projects and documentation below."}
        </p>
      </motion.div>

      {projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <FolderOpen className="h-16 w-16 text-steel-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-steel-300 mb-2">
            No Projects Yet
          </h2>
          <p className="text-steel-500">
            Your equipment projects and documentation will appear here.
          </p>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/customer-portal/projects/${project.id}`}
                className="group block bg-steel-900 border border-steel-700 hover:border-accent-500/50 rounded-xl p-6 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-accent-500/10 rounded-lg">
                    <FolderOpen className="h-6 w-6 text-accent-400" />
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      project.status === "active"
                        ? "bg-green-500/10 text-green-400"
                        : project.status === "completed"
                          ? "bg-steel-700 text-steel-400"
                          : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-steel-100 group-hover:text-accent-400 transition-colors mb-1">
                  {project.name}
                </h3>

                {isAdmin && (project.portal_customers?.name || project.customer?.name) && (
                  <p className="text-xs text-accent-400 mb-1">
                    {project.portal_customers?.name || project.customer?.name}
                  </p>
                )}

                {project.description && (
                  <p className="text-steel-400 text-sm line-clamp-2 mb-4">
                    {project.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-steel-800">
                  <div className="flex items-center text-steel-500 text-sm">
                    <FileText className="h-4 w-4 mr-1" />
                    {project.portal_documents?.length || 0} document
                    {(project.portal_documents?.length || 0) !== 1 ? "s" : ""}
                  </div>
                  <ChevronRight className="h-4 w-4 text-steel-500 group-hover:text-accent-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
