"use client";

import React, { useState } from "react";
import { db, Project, Task } from "@/db";

interface ProjectsTasksViewProps {
  role?: "admin" | "team" | "client";
  activeMember?: string;
  onMemberChange?: (member: string) => void;
}

export const ProjectsTasksView: React.FC<ProjectsTasksViewProps> = ({
  role = "admin",
  activeMember = "Kai (Brand Lead)",
  onMemberChange,
}) => {
  const [allProjects] = useState<Project[]>(db.getProjects());
  const [allTasks, setAllTasks] = useState<Task[]>(db.getTasks());
  const [selectedFilterAssignee, setSelectedFilterAssignee] = useState<string>(
    role === "team" ? activeMember : "all"
  );

  const handleUpdateStatus = (taskId: string, newStatus: Task["status"]) => {
    db.updateTaskStatus(taskId, newStatus);
    setAllTasks(db.getTasks());
  };

  // Scoping logic:
  // If role is team, strictly scope to active member
  const currentAssignee = role === "team" ? activeMember : selectedFilterAssignee;

  const filteredTasks = allTasks.filter((t) => {
    if (currentAssignee === "all") return true;
    return t.assignee.toLowerCase().includes(currentAssignee.split(" ")[0].toLowerCase());
  });

  const filteredProjects = allProjects.filter((p) => {
    if (role === "admin" || currentAssignee === "all") return true;
    // Scoped projects based on team member assignment
    if (currentAssignee.includes("Kai")) return p.title.includes("Tidewater");
    if (currentAssignee.includes("Ren")) return p.title.includes("Tidewater");
    if (currentAssignee.includes("Sora")) return p.title.includes("Meridian");
    return true;
  });

  const taskStatuses = [
    { id: "todo", label: "To Do", count: filteredTasks.filter((t) => t.status === "todo").length },
    { id: "in_progress", label: "In Progress", count: filteredTasks.filter((t) => t.status === "in_progress").length },
    { id: "review", label: "QA / Review", count: filteredTasks.filter((t) => t.status === "review").length },
    { id: "done", label: "Completed", count: filteredTasks.filter((t) => t.status === "done").length },
  ] as const;

  return (
    <div className="p-4 sm:p-8 max-w-[88rem] mx-auto text-[#0F1B2A] space-y-6">
      {/* Top Header with Role Indicator */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                role === "admin" ? "bg-amber-500" : "bg-blue-500"
              } animate-pulse`}
            />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-gray-500">
              {role === "admin" ? "Studio Command • All Team Workloads" : "Delivery Floor • My Sprint Tasks"}
            </span>
          </div>
          <h1 className="font-monument text-2xl sm:text-3xl font-black text-[#0F1B2A] tracking-tight mt-1">
            {role === "admin" ? "AGENCY PROJECTS & TASK BOARD" : `SPRINT BOARD · ${activeMember.toUpperCase()}`}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {role === "admin"
              ? "Full operational visibility across every active client deliverable, budget, and team task."
              : "Showing sprint assignments and active projects specifically scoped to your team member account."}
          </p>
        </div>

        {/* Member Switcher (For Team Role testing) / Filter (For Admin) */}
        {role === "team" ? (
          <div className="flex items-center gap-2 bg-white border border-gray-300 p-1.5 rounded-lg">
            <span className="text-[0.7rem] font-mono font-bold text-gray-500 uppercase px-1">
              Active Member:
            </span>
            <select
              value={activeMember}
              onChange={(e) => onMemberChange && onMemberChange(e.target.value)}
              className="font-mono text-xs border border-gray-300 rounded px-2 py-1 bg-gray-50 font-bold text-gray-900 focus:border-black focus:outline-none"
            >
              <option value="Kai (Brand Lead)">Kai (Brand Lead)</option>
              <option value="Ren (Frontend)">Ren (Frontend)</option>
              <option value="Sora (UX)">Sora (UX)</option>
            </select>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5 bg-gray-100 p-1 rounded-lg border border-gray-300 text-xs font-mono">
            <span className="text-[0.65rem] text-gray-500 uppercase px-2 font-bold">Assignee:</span>
            <button
              type="button"
              onClick={() => setSelectedFilterAssignee("all")}
              className={`px-2.5 py-1 rounded font-bold uppercase ${
                selectedFilterAssignee === "all" ? "bg-black text-[#FFE600]" : "text-gray-600 hover:text-black"
              }`}
            >
              All ({allTasks.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilterAssignee("Kai")}
              className={`px-2.5 py-1 rounded font-bold uppercase ${
                selectedFilterAssignee === "Kai" ? "bg-black text-[#FFE600]" : "text-gray-600 hover:text-black"
              }`}
            >
              Kai ({allTasks.filter((t) => t.assignee.includes("Kai")).length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilterAssignee("Ren")}
              className={`px-2.5 py-1 rounded font-bold uppercase ${
                selectedFilterAssignee === "Ren" ? "bg-black text-[#FFE600]" : "text-gray-600 hover:text-black"
              }`}
            >
              Ren ({allTasks.filter((t) => t.assignee.includes("Ren")).length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilterAssignee("Sora")}
              className={`px-2.5 py-1 rounded font-bold uppercase ${
                selectedFilterAssignee === "Sora" ? "bg-black text-[#FFE600]" : "text-gray-600 hover:text-black"
              }`}
            >
              Sora ({allTasks.filter((t) => t.assignee.includes("Sora")).length})
            </button>
          </div>
        )}
      </div>

      {/* Role Scoping Notice */}
      {role === "team" && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r text-xs font-mono text-blue-900 flex items-center justify-between">
          <span>
            🔒 <strong>Team Floor Scope:</strong> You have delivery-level access. You can view and update your assigned tasks and project deliverables. Confidential client financial ledgers, studio margins, and CRM lead pipelines are restricted.
          </span>
          <span className="text-[0.65rem] text-blue-700 bg-blue-100 px-2 py-0.5 rounded font-bold">
            Team Scoped
          </span>
        </div>
      )}

      {/* Projects Delivery Pulse Cards */}
      <div>
        <h2 className="font-bold text-sm text-black mb-3 uppercase font-mono tracking-wider flex items-center justify-between">
          <span>{role === "team" ? "My Assigned Projects" : "All Client Projects"}</span>
          <span className="text-xs text-gray-500 font-normal">
            {filteredProjects.length} active delivery pod{filteredProjects.length === 1 ? "" : "s"}
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {filteredProjects.map((proj) => (
            <div key={proj.id} className="border border-gray-300 bg-white p-5 rounded-lg shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Phase: {proj.phase}
                </span>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {proj.riskLevel}
                </span>
              </div>

              <h3 className="font-bold text-base text-black">{proj.title}</h3>
              <span className="text-xs text-gray-500 block mt-0.5 font-mono">Client: {proj.clientName}</span>

              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-gray-500">Milestone Progress</span>
                  <span className="font-bold text-black">{proj.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#FFE600] h-full" style={{ width: `${proj.progress}%` }} />
                </div>
                <div className="flex items-center justify-between text-[0.68rem] text-gray-400 font-mono mt-2">
                  <span>Target: {proj.targetDate}</span>
                  {role === "admin" && (
                    <span className="text-gray-700 font-bold">
                      Budget: ${proj.budget.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Kanban Tasks Board */}
      <div>
        <h2 className="font-bold text-sm text-black mb-3 uppercase font-mono tracking-wider flex items-center justify-between">
          <span>{role === "team" ? "My Active Sprint Tasks" : "Master Delivery Task Board"}</span>
          <span className="text-xs text-gray-500 font-normal">
            {filteredTasks.length} task{filteredTasks.length === 1 ? "" : "s"} shown
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {taskStatuses.map((statusCol) => {
            const colTasks = filteredTasks.filter((t) => t.status === statusCol.id);
            return (
              <div key={statusCol.id} className="bg-gray-100 p-4 rounded-lg border border-gray-300 min-h-[22rem]">
                <div className="flex items-center justify-between border-b pb-2 mb-3">
                  <span className="font-bold text-xs uppercase tracking-wider text-black">
                    {statusCol.label}
                  </span>
                  <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 rounded border text-gray-700">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {colTasks.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-6 font-mono">No tasks in this lane</p>
                  ) : (
                    colTasks.map((t) => (
                      <div key={t.id} className="bg-white border border-gray-300 p-3.5 rounded shadow-2xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[0.65rem] font-mono text-gray-500 truncate max-w-[120px]">
                            {t.projectTitle}
                          </span>
                          <span
                            className={`text-[0.62rem] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                              t.priority === "urgent"
                                ? "bg-rose-100 text-rose-800"
                                : t.priority === "high"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {t.priority}
                          </span>
                        </div>

                        <h4 className="font-medium text-xs text-black leading-snug">{t.title}</h4>

                        <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[0.68rem] text-gray-500 font-mono">
                          <span>👤 {t.assignee}</span>
                          <span>Due: {t.dueDate}</span>
                        </div>

                        {/* Status Transition Control */}
                        <div className="mt-2 pt-2 border-t border-gray-50 flex items-center justify-between">
                          <span className="text-[0.62rem] text-gray-400">Move lane:</span>
                          <select
                            value={t.status}
                            onChange={(e) => handleUpdateStatus(t.id, e.target.value as Task["status"])}
                            className="text-[0.65rem] font-medium border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50 text-black cursor-pointer focus:outline-none"
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="review">QA / Review</option>
                            <option value="done">Completed</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
