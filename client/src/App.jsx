import { useMemo, useState } from "react";

const initialUsers = [
  {
    id: 1,
    name: "Ava Martinez",
    email: "ava@company.com",
    role: "Admin",
    status: "Active"
  },
  {
    id: 2,
    name: "Liam Turner",
    email: "liam@company.com",
    role: "Manager",
    status: "Active"
  },
  {
    id: 3,
    name: "Noah Smith",
    email: "noah@company.com",
    role: "User",
    status: "Invited"
  },
  {
    id: 4,
    name: "Sophia Lee",
    email: "sophia@company.com",
    role: "User",
    status: "Suspended"
  }
];

const roles = ["Admin", "Manager", "User"];
const statuses = ["Active", "Invited", "Suspended"];

export default function App() {
  const [users, setUsers] = useState(initialUsers);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "User",
    status: "Active"
  });

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === "Active").length;
    const invited = users.filter((u) => u.status === "Invited").length;
    return { total, active, invited };
  }, [users]);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === "All" || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  function resetForm() {
    setForm({ name: "", email: "", role: "User", status: "Active" });
    setEditingId(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;

    if (editingId) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingId ? { ...u, ...form } : u))
      );
    } else {
      const nextId = Math.max(0, ...users.map((u) => u.id)) + 1;
      setUsers((prev) => [...prev, { id: nextId, ...form }]);
    }

    resetForm();
  }

  function handleEdit(user) {
    setEditingId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
  }

  function handleDelete(id) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (editingId === id) resetForm();
  }

  return (
    <div className="page">
      <div className="bg-orb orb-one" />
      <div className="bg-orb orb-two" />
      <div className="bg-orb orb-three" />

      <header className="hero">
        <div>
          <span className="chip">User Management</span>
          <h1>Control your team, faster.</h1>
          <p>
            Manage users, roles, and access with a clean workflow. Built for
            modern MERN stacks, optimized for real teams.
          </p>
        </div>
        <div className="hero-card">
          <div className="hero-metric">
            <span>Total users</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="hero-metric">
            <span>Active</span>
            <strong>{stats.active}</strong>
          </div>
          <div className="hero-metric">
            <span>Invited</span>
            <strong>{stats.invited}</strong>
          </div>
        </div>
      </header>

      <section className="controls">
        <div className="search">
          <input
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filters">
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="All">All roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <button className="ghost" onClick={() => setSearch("")}>Clear</button>
        </div>
      </section>

      <main className="grid">
        <section className="panel">
          <h2>{editingId ? "Edit user" : "Add a new user"}</h2>
          <form onSubmit={handleSubmit} className="form user-form">
            <label className="field">
              Full name
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Jordan Lee"
              />
            </label>
            <label className="field">
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="e.g. jordan@company.com"
              />
            </label>
            <div className="row">
              <label className="field">
                Role
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Status
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="actions">
              <button type="submit" className="primary">
                {editingId ? "Save changes" : "Create user"}
              </button>
              {editingId ? (
                <button type="button" className="ghost" onClick={resetForm}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Team members</h2>
            <span className="count">{filtered.length} users</span>
          </div>
          <div className="table">
            {filtered.map((user) => (
              <article key={user.id} className="user-row">
                <div>
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                </div>
                <div className="tags">
                  <span className={`tag ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                  <span className={`tag ${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </div>
                <div className="row-actions">
                  <button className="ghost" onClick={() => handleEdit(user)}>
                    Edit
                  </button>
                  <button className="danger" onClick={() => handleDelete(user.id)}>
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
