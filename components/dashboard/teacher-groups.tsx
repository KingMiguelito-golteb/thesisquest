"use client";

import { useState, useMemo } from "react";
import {
  Users,
  CheckCircle2,
  Calendar,
  Zap,
  ChevronDown,
  ChevronUp,
  Lock,
  Plus,
  X,
  UserPlus,
  Search,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createGroupWithIds,
  createMilestone,
  addStudentToGroupById,
  getAvailableStudents,
} from "@/app/actions/manage";

interface GroupData {
  id: string;
  name: string;
  section: string;
  subject: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  totalMilestones: number;
  completedMilestones: number;
  pendingReview: number;
  upcomingDeadline: Date | null;
  members: { id: string; name: string; level: number }[];
  milestones: {
    id: string;
    title: string;
    status: string;
    order: number;
    dueDate: Date | null;
    taskCount: number;
    completedTaskCount: number;
  }[];
}

interface StudentOption {
  id: string;
  name: string;
  email: string;
  level: number;
  xp: number;
}

export function TeacherGroupsClient({
  groups,
  allStudents,
}: {
  groups: GroupData[];
  allStudents: StudentOption[];
}) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(
    groups[0]?.id || null
  );
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreateMilestone, setShowCreateMilestone] = useState<string | null>(null);
  const [showAddStudent, setShowAddStudent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Create group state
  const [newGroup, setNewGroup] = useState({
    name: "",
    section: "",
    subject: "",
  });
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [studentSearch, setStudentSearch] = useState("");

  // Create milestone state
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    dueDate: "",
    xpReward: "100",
    coinReward: "25",
  });

  // Add student state
  const [addStudentSearch, setAddStudentSearch] = useState("");
  const [availableForGroup, setAvailableForGroup] = useState<StudentOption[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Filter students for create group
  const filteredStudents = useMemo(() => {
    return allStudents.filter(
      (s) =>
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.email.toLowerCase().includes(studentSearch.toLowerCase())
    );
  }, [allStudents, studentSearch]);

  // Filter students for add to group
  const filteredAvailable = useMemo(() => {
    return availableForGroup.filter(
      (s) =>
        s.name.toLowerCase().includes(addStudentSearch.toLowerCase()) ||
        s.email.toLowerCase().includes(addStudentSearch.toLowerCase())
    );
  }, [availableForGroup, addStudentSearch]);

  function toggleStudent(id: string) {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return { color: "var(--emerald)", bg: "var(--emerald-glow)" };
      case "IN_PROGRESS":
        return { color: "var(--cyan)", bg: "var(--cyan-glow)" };
      case "LOCKED":
        return { color: "var(--text-dim)", bg: "rgba(85,85,85,0.1)" };
      default:
        return { color: "var(--text-dim)", bg: "rgba(85,85,85,0.1)" };
    }
  };

  async function handleCreateGroup() {
    if (!newGroup.name || !newGroup.section || !newGroup.subject) {
      setMessage({ type: "error", text: "All fields are required" });
      return;
    }
    if (selectedStudentIds.length === 0) {
      setMessage({ type: "error", text: "Select at least one student" });
      return;
    }
    setLoading(true);
    const result = await createGroupWithIds(
      newGroup.name,
      newGroup.section,
      newGroup.subject,
      selectedStudentIds
    );
    if (result.error) setMessage({ type: "error", text: result.error });
    else {
      setMessage({ type: "success", text: result.success! });
      setShowCreateGroup(false);
      setNewGroup({ name: "", section: "", subject: "" });
      setSelectedStudentIds([]);
      setStudentSearch("");
    }
    setLoading(false);
    setTimeout(() => setMessage(null), 4000);
  }

  async function handleCreateMilestone(groupId: string) {
    if (!newMilestone.title) {
      setMessage({ type: "error", text: "Title is required" });
      return;
    }
    setLoading(true);
    const result = await createMilestone(
      groupId,
      newMilestone.title,
      newMilestone.description,
      newMilestone.dueDate || null,
      parseInt(newMilestone.xpReward) || 100,
      parseInt(newMilestone.coinReward) || 25
    );
    if (result.error) setMessage({ type: "error", text: result.error });
    else {
      setMessage({ type: "success", text: result.success! });
      setShowCreateMilestone(null);
      setNewMilestone({
        title: "",
        description: "",
        dueDate: "",
        xpReward: "100",
        coinReward: "25",
      });
    }
    setLoading(false);
    setTimeout(() => setMessage(null), 4000);
  }

  async function openAddStudent(groupId: string) {
    setShowAddStudent(groupId);
    setLoadingStudents(true);
    setAddStudentSearch("");
    const students = await getAvailableStudents(groupId);
    setAvailableForGroup(students);
    setLoadingStudents(false);
  }

  async function handleAddStudent(studentId: string) {
    if (!showAddStudent) return;
    setLoading(true);
    const result = await addStudentToGroupById(showAddStudent, studentId);
    if (result.error) setMessage({ type: "error", text: result.error });
    else {
      setMessage({ type: "success", text: result.success! });
      // Remove from available list
      setAvailableForGroup((prev) => prev.filter((s) => s.id !== studentId));
    }
    setLoading(false);
    setTimeout(() => setMessage(null), 3000);
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-tight flex items-center gap-3">
            <Users className="w-6 h-6 text-[var(--cyan)]" />
            MY GROUPS
          </h2>
          <p className="text-[var(--text-secondary)] mt-1 text-sm">
            Monitor and manage your research groups
          </p>
        </div>
        <Button
          onClick={() => setShowCreateGroup(true)}
          className="text-[10px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider btn-cyber px-4"
          style={{
            borderRadius: "4px",
            background: "var(--cyan)",
            color: "black",
            boxShadow: "0 0 10px var(--cyan-glow)",
          }}
        >
          <Plus className="w-4 h-4 mr-1" /> NEW GROUP
        </Button>
      </div>

      {message && (
        <div
          className="p-3 border text-sm"
          style={{
            borderRadius: "4px",
            borderColor:
              message.type === "success" ? "var(--emerald)" : "var(--red)",
            background:
              message.type === "success"
                ? "var(--emerald-glow)"
                : "var(--red-glow)",
            color:
              message.type === "success" ? "var(--emerald)" : "var(--red)",
          }}
        >
          {message.text}
        </div>
      )}

      {/* ==================== CREATE GROUP MODAL ==================== */}
      {showCreateGroup && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowCreateGroup(false)}
          />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg border max-h-[90vh] overflow-y-auto"
            style={{
              borderRadius: "4px",
              borderColor: "var(--cyan)",
              background: "var(--bg-card)",
              boxShadow: "0 0 40px var(--cyan-glow)",
            }}
          >
            <div
              className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2"
              style={{ borderColor: "var(--cyan)" }}
            />
            <div
              className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2"
              style={{ borderColor: "var(--cyan)" }}
            />

            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-wide">
                  CREATE NEW GROUP
                </h3>
                <button
                  onClick={() => setShowCreateGroup(false)}
                  className="text-[var(--text-dim)] hover:text-[var(--text-primary)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[var(--text-secondary)] text-[10px] uppercase tracking-wider font-[family-name:var(--font-heading)]">
                    Group Name
                  </Label>
                  <Input
                    value={newGroup.name}
                    onChange={(e) =>
                      setNewGroup({ ...newGroup, name: e.target.value })
                    }
                    placeholder="e.g., Research Team Alpha"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-[var(--text-secondary)] text-[10px] uppercase tracking-wider font-[family-name:var(--font-heading)]">
                      Section
                    </Label>
                    <Input
                      value={newGroup.section}
                      onChange={(e) =>
                        setNewGroup({ ...newGroup, section: e.target.value })
                      }
                      placeholder="STEM 12-A"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[var(--text-secondary)] text-[10px] uppercase tracking-wider font-[family-name:var(--font-heading)]">
                      Subject
                    </Label>
                    <Input
                      value={newGroup.subject}
                      onChange={(e) =>
                        setNewGroup({ ...newGroup, subject: e.target.value })
                      }
                      placeholder="Capstone Project"
                    />
                  </div>
                </div>

                {/* Student Picker */}
                <div className="space-y-2">
                  <Label className="text-[var(--text-secondary)] text-[10px] uppercase tracking-wider font-[family-name:var(--font-heading)]">
                    Select Students ({selectedStudentIds.length} selected)
                  </Label>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-dim)]" />
                    <Input
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      placeholder="Search by name or email..."
                      className="pl-10"
                    />
                  </div>

                  {/* Selected chips */}
                  {selectedStudentIds.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedStudentIds.map((id) => {
                        const student = allStudents.find((s) => s.id === id);
                        if (!student) return null;
                        return (
                          <span
                            key={id}
                            className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider border cursor-pointer hover:bg-[var(--red-glow)] hover:border-[var(--red)] hover:text-[var(--red)] transition-all"
                            style={{
                              borderRadius: "2px",
                              color: "var(--cyan)",
                              background: "var(--cyan-glow)",
                              borderColor:
                                "color-mix(in srgb, var(--cyan) 30%, transparent)",
                            }}
                            onClick={() => toggleStudent(id)}
                          >
                            {student.name}
                            <X className="w-3 h-3" />
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Student list */}
                  <div
                    className="max-h-[200px] overflow-y-auto border border-[var(--border-dim)] divide-y divide-[var(--border-dim)]"
                    style={{ borderRadius: "4px" }}
                  >
                    {filteredStudents.length === 0 ? (
                      <div className="p-4 text-center text-xs text-[var(--text-dim)]">
                        No students found
                      </div>
                    ) : (
                      filteredStudents.map((student) => {
                        const isSelected = selectedStudentIds.includes(
                          student.id
                        );
                        return (
                          <button
                            key={student.id}
                            onClick={() => toggleStudent(student.id)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-[var(--bg-hover)] transition-colors"
                          >
                            <div
                              className="w-5 h-5 border flex items-center justify-center flex-shrink-0"
                              style={{
                                borderRadius: "2px",
                                borderColor: isSelected
                                  ? "var(--cyan)"
                                  : "var(--border-subtle)",
                                background: isSelected
                                  ? "var(--cyan)"
                                  : "transparent",
                              }}
                            >
                              {isSelected && (
                                <Check className="w-3 h-3 text-black" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-[var(--text-primary)] truncate">
                                {student.name}
                              </p>
                              <p className="text-[10px] text-[var(--text-dim)] truncate">
                                {student.email}
                              </p>
                            </div>
                            <span className="text-[9px] text-[var(--gold)] font-bold font-[family-name:var(--font-heading)]">
                              L{student.level}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleCreateGroup}
                  disabled={loading}
                  className="w-full text-[10px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider btn-cyber py-5"
                  style={{
                    borderRadius: "4px",
                    background: "var(--cyan)",
                    color: "black",
                    boxShadow: "0 0 10px var(--cyan-glow)",
                  }}
                >
                  {loading
                    ? "CREATING..."
                    : `CREATE GROUP (${selectedStudentIds.length} MEMBERS)`}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ==================== CREATE MILESTONE MODAL ==================== */}
      {showCreateMilestone && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowCreateMilestone(null)}
          />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md border p-6"
            style={{
              borderRadius: "4px",
              borderColor: "var(--magenta)",
              background: "var(--bg-card)",
              boxShadow: "0 0 40px var(--magenta-glow)",
            }}
          >
            <div
              className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2"
              style={{ borderColor: "var(--magenta)" }}
            />
            <div
              className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2"
              style={{ borderColor: "var(--magenta)" }}
            />
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-wide">
                ADD MILESTONE
              </h3>
              <button
                onClick={() => setShowCreateMilestone(null)}
                className="text-[var(--text-dim)] hover:text-[var(--text-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[var(--text-secondary)] text-[10px] uppercase tracking-wider font-[family-name:var(--font-heading)]">
                  Title
                </Label>
                <Input
                  value={newMilestone.title}
                  onChange={(e) =>
                    setNewMilestone({
                      ...newMilestone,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g., Chapter 3 - Methodology"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[var(--text-secondary)] text-[10px] uppercase tracking-wider font-[family-name:var(--font-heading)]">
                  Description
                </Label>
                <Textarea
                  value={newMilestone.description}
                  onChange={(e) =>
                    setNewMilestone({
                      ...newMilestone,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe what this milestone covers..."
                  className="min-h-[60px] bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-dim)]"
                  style={{ borderRadius: "4px" }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[var(--text-secondary)] text-[10px] uppercase tracking-wider font-[family-name:var(--font-heading)]">
                  Due Date
                </Label>
                <Input
                  type="date"
                  value={newMilestone.dueDate}
                  onChange={(e) =>
                    setNewMilestone({
                      ...newMilestone,
                      dueDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-[var(--text-secondary)] text-[10px] uppercase tracking-wider font-[family-name:var(--font-heading)]">
                    XP Reward
                  </Label>
                  <Input
                    type="number"
                    value={newMilestone.xpReward}
                    onChange={(e) =>
                      setNewMilestone({
                        ...newMilestone,
                        xpReward: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--text-secondary)] text-[10px] uppercase tracking-wider font-[family-name:var(--font-heading)]">
                    Coin Reward
                  </Label>
                  <Input
                    type="number"
                    value={newMilestone.coinReward}
                    onChange={(e) =>
                      setNewMilestone({
                        ...newMilestone,
                        coinReward: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <Button
                onClick={() => handleCreateMilestone(showCreateMilestone)}
                disabled={loading}
                className="w-full text-[10px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider btn-cyber py-5"
                style={{
                  borderRadius: "4px",
                  background: "var(--magenta)",
                  color: "white",
                  boxShadow: "0 0 10px var(--magenta-glow)",
                }}
              >
                {loading ? "CREATING..." : "CREATE MILESTONE"}
              </Button>
            </div>
          </div>
        </>
      )}

      {/* ==================== ADD STUDENT MODAL ==================== */}
      {showAddStudent && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowAddStudent(null)}
          />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm border max-h-[80vh] overflow-hidden flex flex-col"
            style={{
              borderRadius: "4px",
              borderColor: "var(--emerald)",
              background: "var(--bg-card)",
              boxShadow: "0 0 40px var(--emerald-glow)",
            }}
          >
            <div className="p-6 pb-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-wide flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-[var(--emerald)]" />
                  ADD STUDENT
                </h3>
                <button
                  onClick={() => setShowAddStudent(null)}
                  className="text-[var(--text-dim)] hover:text-[var(--text-primary)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-dim)]" />
                <Input
                  value={addStudentSearch}
                  onChange={(e) => setAddStudentSearch(e.target.value)}
                  placeholder="Search students..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {loadingStudents ? (
                <div className="p-8 text-center text-xs text-[var(--text-dim)]">
                  Loading students...
                </div>
              ) : filteredAvailable.length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--text-dim)]">
                  {addStudentSearch
                    ? "No matching students found"
                    : "All students are already in this group"}
                </div>
              ) : (
                <div
                  className="divide-y divide-[var(--border-dim)] border border-[var(--border-dim)]"
                  style={{ borderRadius: "4px" }}
                >
                  {filteredAvailable.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--bg-hover)] transition-colors"
                    >
                      <div
                        className="w-8 h-8 border flex items-center justify-center text-[9px] font-bold font-[family-name:var(--font-heading)] flex-shrink-0"
                        style={{
                          borderRadius: "4px",
                          borderColor: "var(--cyan)",
                          background: "var(--cyan-glow)",
                          color: "var(--cyan)",
                        }}
                      >
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[var(--text-primary)] truncate">
                          {student.name}
                        </p>
                        <p className="text-[10px] text-[var(--text-dim)] truncate">
                          {student.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[9px] text-[var(--gold)] font-bold font-[family-name:var(--font-heading)]">
                          L{student.level}
                        </span>
                        <Button
                          onClick={() => handleAddStudent(student.id)}
                          disabled={loading}
                          className="text-[9px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider btn-cyber px-3 py-1 h-auto"
                          style={{
                            borderRadius: "4px",
                            background: "var(--emerald)",
                            color: "black",
                            boxShadow: "0 0 8px var(--emerald-glow)",
                          }}
                        >
                          <Plus className="w-3 h-3 mr-0.5" />
                          ADD
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ==================== GROUPS LIST ==================== */}
      <div className="space-y-4">
        {groups.length === 0 && (
          <div
            className="card-cyber p-12 text-center"
            style={{ borderRadius: "4px" }}
          >
            <Users className="w-8 h-8 text-[var(--text-dim)] mx-auto mb-3" />
            <p className="text-sm text-[var(--text-dim)] font-[family-name:var(--font-heading)]">
              NO GROUPS YET
            </p>
            <p className="text-xs text-[var(--text-dim)] mt-1">
              Create a group to get started
            </p>
          </div>
        )}

        {groups.map((group) => {
          const isExpanded = expandedGroup === group.id;

          return (
            <div
              key={group.id}
              className="card-cyber overflow-hidden"
              style={{ borderRadius: "4px" }}
            >
              <button
                onClick={() =>
                  setExpandedGroup(isExpanded ? null : group.id)
                }
                className="w-full p-5 text-left hover:bg-[var(--bg-hover)] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)]">
                        {group.name}
                      </h3>
                      {group.pendingReview > 0 && (
                        <span
                          className="text-[9px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest px-2 py-0.5 border"
                          style={{
                            borderRadius: "2px",
                            color: "var(--gold)",
                            background: "var(--gold-glow)",
                            borderColor: "rgba(255,179,71,0.3)",
                          }}
                        >
                          {group.pendingReview} PENDING
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[var(--text-dim)] font-[family-name:var(--font-heading)] uppercase tracking-wider mt-0.5">
                      {group.section} • {group.subject}
                    </p>

                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[10px] font-[family-name:var(--font-heading)] uppercase tracking-wider mb-1.5">
                        <span className="text-[var(--text-dim)]">
                          {group.completedMilestones}/{group.totalMilestones}{" "}
                          milestones • {group.completedTasks}/
                          {group.totalTasks} tasks
                        </span>
                        <span className="text-[var(--cyan)]">
                          {group.progress}%
                        </span>
                      </div>
                      <div
                        className="w-full h-2 bg-[var(--bg-card)] overflow-hidden"
                        style={{ borderRadius: "2px" }}
                      >
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${group.progress}%`,
                            borderRadius: "2px",
                            background:
                              group.progress < 30
                                ? "var(--red)"
                                : group.progress < 70
                                  ? "var(--gold)"
                                  : "var(--emerald)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-[var(--text-dim)]">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-[var(--border-dim)] p-5 space-y-4">
                  {/* Members */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] text-[var(--text-dim)] font-[family-name:var(--font-heading)] uppercase tracking-widest">
                        MEMBERS ({group.members.length})
                      </p>
                      <button
                        onClick={() => openAddStudent(group.id)}
                        className="flex items-center gap-1 text-[10px] text-[var(--emerald)] hover:text-[var(--emerald)] font-[family-name:var(--font-heading)] uppercase tracking-wider"
                      >
                        <UserPlus className="w-3.5 h-3.5" /> ADD
                      </button>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {group.members.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-elevated)] border border-[var(--border-dim)]"
                          style={{ borderRadius: "4px" }}
                        >
                          <div
                            className="w-6 h-6 border flex items-center justify-center text-[9px] font-bold font-[family-name:var(--font-heading)]"
                            style={{
                              borderRadius: "2px",
                              borderColor: "var(--cyan)",
                              background: "var(--cyan-glow)",
                              color: "var(--cyan)",
                            }}
                          >
                            {m.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                          <span className="text-xs text-[var(--text-primary)]">
                            {m.name}
                          </span>
                          <span className="flex items-center gap-0.5 text-[9px] text-[var(--gold)] font-bold font-[family-name:var(--font-heading)]">
                            <Zap className="w-3 h-3" />L{m.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Milestones */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] text-[var(--text-dim)] font-[family-name:var(--font-heading)] uppercase tracking-widest">
                        MILESTONES ({group.milestones.length})
                      </p>
                      <button
                        onClick={() => setShowCreateMilestone(group.id)}
                        className="flex items-center gap-1 text-[10px] text-[var(--magenta)] hover:text-[var(--magenta)] font-[family-name:var(--font-heading)] uppercase tracking-wider"
                      >
                        <Plus className="w-3.5 h-3.5" /> ADD
                      </button>
                    </div>
                    <div className="space-y-2">
                      {group.milestones.map((m, i) => {
                        const style = getStatusStyle(m.status);
                        const progress =
                          m.taskCount > 0
                            ? Math.round(
                                (m.completedTaskCount / m.taskCount) * 100
                              )
                            : 0;
                        return (
                          <div
                            key={m.id}
                            className="flex items-center gap-3 p-3 bg-[var(--bg-elevated)] border border-[var(--border-dim)]"
                            style={{
                              borderRadius: "4px",
                              opacity: m.status === "LOCKED" ? 0.5 : 1,
                            }}
                          >
                            <div
                              className="w-7 h-7 flex items-center justify-center border text-[10px] font-bold font-[family-name:var(--font-heading)] flex-shrink-0"
                              style={{
                                borderRadius: "4px",
                                borderColor: style.color,
                                background: style.bg,
                                color: style.color,
                              }}
                            >
                              {m.status === "COMPLETED" ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              ) : m.status === "LOCKED" ? (
                                <Lock className="w-3.5 h-3.5" />
                              ) : (
                                i + 1
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-[var(--text-primary)] truncate">
                                {m.title}
                              </p>
                              {m.status !== "LOCKED" && m.taskCount > 0 && (
                                <div className="flex items-center gap-2 mt-1">
                                  <div
                                    className="flex-1 h-1 bg-[var(--bg-card)] overflow-hidden"
                                    style={{ borderRadius: "2px" }}
                                  >
                                    <div
                                      className="h-full"
                                      style={{
                                        width: `${progress}%`,
                                        borderRadius: "2px",
                                        background: style.color,
                                      }}
                                    />
                                  </div>
                                  <span
                                    className="text-[9px] font-[family-name:var(--font-heading)]"
                                    style={{ color: style.color }}
                                  >
                                    {m.completedTaskCount}/{m.taskCount}
                                  </span>
                                </div>
                              )}
                            </div>
                            {m.dueDate && (
                              <span className="flex items-center gap-1 text-[10px] text-[var(--text-dim)] flex-shrink-0">
                                <Calendar className="w-3 h-3" />
                                {new Date(m.dueDate).toLocaleDateString(
                                  "en-US",
                                  { month: "short", day: "numeric" }
                                )}
                              </span>
                            )}
                          </div>
                        );
                      })}
                      {group.milestones.length === 0 && (
                        <p className="text-xs text-[var(--text-dim)] text-center py-4">
                          No milestones yet. Add one to get started!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}