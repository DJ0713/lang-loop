import React, { useEffect, useState, useCallback } from "react";
import api from "../../services/api";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("LEARNER");
  const [updating, setUpdating] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/admin/users");
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("You do not have permission to perform this action.");
      } else {
        setError(err.response?.data?.message || "Failed to load users");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, targetRole) => {
    setUpdating(true);
    setMessage("");
    setError("");
    try {
      await api.put(`/admin/users/${userId}/role`, { role: targetRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: targetRole } : u))
      );
      setMessage(`Role updated to ${targetRole} successfully.`);
      setSelectedUser(null);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("You do not have permission to perform this action.");
      } else {
        setError(err.response?.data?.message || "Failed to update role");
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete user "${username}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setMessage("");
    setError("");
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setMessage(`User "${username}" deleted successfully.`);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("You do not have permission to perform this action.");
      } else {
        setError(err.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = (u.username || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <div className="eyebrow-text" style={{ marginBottom: "6px" }}>
          <span>ACCESS CONTROL & RBAC</span>
        </div>
        <h2 style={{ fontSize: "32px", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-0.8px" }}>
          User Directory & Roles
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14.5px", marginTop: "4px" }}>
          Inspect user accounts, assign system privileges, and maintain directory integrity.
        </p>
      </div>

      {message && (
        <p role="status" className="alert-success" style={{ marginBottom: "20px" }}>
          {message}
        </p>
      )}

      {error && (
        <div style={{ marginBottom: "20px" }}>
          <p role="alert" className="alert-error">
            {error}
          </p>
          <button
            type="button"
            className="btn-secondary"
            onClick={fetchUsers}
            style={{ marginTop: "8px" }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flex: 1, minWidth: "260px" }}>
          <input
            type="text"
            placeholder="Search by username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: "380px" }}
          />
        </div>

        {/* Role Filter Tabs */}
        <div style={{ display: "flex", gap: "8px", background: "var(--surface-card)", padding: "4px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
          {["ALL", "LEARNER", "LINGUIST", "ADMIN"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              style={{
                background: roleFilter === r ? "var(--primary)" : "transparent",
                color: roleFilter === r ? "#ffffff" : "var(--text-secondary)",
                border: "none",
                padding: "6px 14px",
                borderRadius: "var(--radius-sm)",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all var(--transition-fast)",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Role Changer Modal / Box */}
      {selectedUser && (
        <div
          className="saas-card"
          style={{
            marginBottom: "24px",
            borderColor: "var(--primary)",
            background: "var(--surface-hover)",
          }}
        >
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>
            Change Role for {selectedUser.username}
          </h3>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
            Current role: <strong style={{ color: "var(--primary-light)" }}>{selectedUser.role}</strong>
          </p>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              style={{ width: "auto", minWidth: "160px" }}
            >
              <option value="LEARNER">LEARNER</option>
              <option value="LINGUIST">LINGUIST</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <button
              type="button"
              className="btn-primary"
              disabled={updating}
              onClick={() => handleRoleChange(selectedUser.id, newRole)}
            >
              {updating ? "Saving..." : "Save Role"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setSelectedUser(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      {loading ? (
        <div style={{ padding: "40px 0", color: "var(--text-muted)", textAlign: "center" }}>
          Loading users...
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-state-icon">👥</div>
          <p className="empty-state-title">No Users Found</p>
          <p className="empty-state-desc">
            No accounts match your current search or role filter.
          </p>
        </div>
      ) : (
        <div className="saas-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr
                  style={{
                    background: "var(--bg-subtle)",
                    borderBottom: "1px solid var(--border-subtle)",
                    color: "var(--text-muted)",
                    fontSize: "12px",
                    textTransform: "uppercase",
                  }}
                >
                  <th style={{ padding: "14px 20px" }}>ID</th>
                  <th style={{ padding: "14px 20px" }}>Username</th>
                  <th style={{ padding: "14px 20px" }}>Role</th>
                  <th style={{ padding: "14px 20px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    style={{
                      borderBottom: "1px solid var(--border-subtle)",
                      transition: "background var(--transition-fast)",
                    }}
                  >
                    <td style={{ padding: "14px 20px", color: "var(--text-muted)", fontSize: "13px" }}>
                      #{u.id}
                    </td>
                    <td style={{ padding: "14px 20px", fontWeight: "600", color: "var(--text-primary)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            background: "var(--surface-active)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "11px",
                            fontWeight: "700",
                            color: "var(--primary-light)",
                          }}
                        >
                          {u.username.slice(0, 2).toUpperCase()}
                        </div>
                        <span>{u.username}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span
                        className="deck-tag"
                        style={{
                          background:
                            u.role === "ADMIN"
                              ? "var(--success-bg)"
                              : u.role === "LINGUIST"
                              ? "var(--warning-bg)"
                              : "var(--surface-active)",
                          color:
                            u.role === "ADMIN"
                              ? "var(--success)"
                              : u.role === "LINGUIST"
                              ? "var(--warning)"
                              : "var(--primary-light)",
                          borderColor:
                            u.role === "ADMIN"
                              ? "var(--success-border)"
                              : u.role === "LINGUIST"
                              ? "rgba(251, 191, 36, 0.3)"
                              : "rgba(59, 130, 246, 0.3)",
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "8px" }}>
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ padding: "6px 12px", fontSize: "12px" }}
                          onClick={() => {
                            setSelectedUser(u);
                            setNewRole(u.role);
                          }}
                        >
                          Change Role
                        </button>
                        <button
                          type="button"
                          className="btn-danger"
                          style={{ padding: "6px 12px", fontSize: "12px" }}
                          onClick={() => handleDeleteUser(u.id, u.username)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
