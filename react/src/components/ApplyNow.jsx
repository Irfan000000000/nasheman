import { useState, useEffect, useCallback } from "react";

// ── CONFIG ─────────────────────────────────────────────────────
const API        = "http://147.93.104.16:7000";
const CAMPUS_ID  = 16;
const SESSION_ID = 1;

// ── Helpers ────────────────────────────────────────────────────
const STATUS_META = {
  pending:  { label: "Pending",  color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", icon: "⏳" },
  reviewed: { label: "Reviewed", color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", icon: "👁️" },
  accepted: { label: "Accepted", color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0", icon: "✅" },
  rejected: { label: "Rejected", color: "#ef4444", bg: "#fef2f2", border: "#fecaca", icon: "❌" },
};

const fmtDate = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-PK", { day: "2-digit", month: "short", year: "numeric" }) +
    " " + dt.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" });
};

// ── Stat Card ─────────────────────────────────────────────────
function StatCard({ label, value, icon, color, active, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: active ? color : "#fff",
      border: `2px solid ${active ? color : "#e5e7eb"}`,
      borderRadius: 14, padding: "18px 20px",
      cursor: "pointer", transition: "all .2s",
      boxShadow: active ? `0 8px 24px ${color}33` : "0 2px 8px rgba(0,0,0,.06)",
      display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 130,
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: 10, fontSize: 20,
        background: active ? "rgba(255,255,255,.2)" : `${color}15`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color: active ? "#fff" : "#0d1a3a", lineHeight: 1 }}>
          {value ?? "—"}
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, color: active ? "rgba(255,255,255,.8)" : "#9ca3af",
          textTransform: "uppercase", letterSpacing: ".8px", marginTop: 3 }}>
          {label}
        </div>
      </div>
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────
function Badge({ status }) {
  const m = STATUS_META[status] || STATUS_META.pending;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
      background: m.bg, color: m.color, border: `1px solid ${m.border}`,
    }}>
      {m.icon} {m.label}
    </span>
  );
}

// ── Detail Modal ──────────────────────────────────────────────
function DetailModal({ record, onClose, onStatusChange }) {
  const [saving, setSaving] = useState(false);

  if (!record) return null;

  const changeStatus = async (newStatus) => {
    setSaving(true);
    await onStatusChange(record.id, newStatus);
    setSaving(false);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(6,15,46,.65)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 20, width: "100%", maxWidth: 540,
        boxShadow: "0 40px 100px rgba(0,0,0,.35)", overflow: "hidden",
        animation: "slideUp .25s ease",
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg,#060f2e,#0a1f5c)",
          padding: "22px 28px", display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ color: "#f5c842", fontSize: 10, fontWeight: 700, letterSpacing: 3,
              textTransform: "uppercase", marginBottom: 4 }}>Application #{record.id}</div>
            <div style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>{record.student_name}</div>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,.12)", border: "none", borderRadius: 8,
            color: "#fff", width: 34, height: 34, cursor: "pointer", fontSize: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>×</button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 28px" }}>
          {[
            { label: "Parent / Guardian", value: record.parent_name, icon: "👤" },
            { label: "WhatsApp Number",   value: record.whatsapp_number, icon: "📱" },
            { label: "Disability Type",   value: record.disability_type, icon: "🩺" },
            { label: "Submitted On",      value: fmtDate(record.created_at), icon: "📅" },
          ].map(row => (
            <div key={row.label} style={{
              display: "flex", alignItems: "flex-start", gap: 12,
              padding: "12px 0", borderBottom: "1px solid #f3f4f6",
            }}>
              <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{row.icon}</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af",
                  textTransform: "uppercase", letterSpacing: ".8px", marginBottom: 2 }}>
                  {row.label}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#0d1a3a" }}>{row.value || "—"}</div>
              </div>
            </div>
          ))}

          {record.additional_notes && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af",
                textTransform: "uppercase", letterSpacing: ".8px", marginBottom: 6 }}>
                📝 Additional Notes
              </div>
              <div style={{
                background: "#f8faff", borderRadius: 8, padding: "10px 12px",
                fontSize: 13, color: "#374151", lineHeight: 1.6,
              }}>{record.additional_notes}</div>
            </div>
          )}

          {/* Current Status */}
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Current Status:</span>
            <Badge status={record.status} />
          </div>

          {/* Status buttons */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af",
              textTransform: "uppercase", letterSpacing: ".8px", marginBottom: 10 }}>
              Change Status
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Object.entries(STATUS_META).map(([key, m]) => (
                <button key={key} disabled={saving || record.status === key}
                  onClick={() => changeStatus(key)}
                  style={{
                    padding: "7px 14px", borderRadius: 8, border: `1.5px solid ${m.border}`,
                    background: record.status === key ? m.bg : "#fff",
                    color: m.color, fontWeight: 700, fontSize: 12, cursor: "pointer",
                    opacity: record.status === key ? 1 : 0.7,
                    transition: "all .15s",
                  }}
                  onMouseEnter={e => { if(record.status !== key) e.currentTarget.style.background = m.bg; }}
                  onMouseLeave={e => { if(record.status !== key) e.currentTarget.style.background = "#fff"; }}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* WhatsApp button */}
          <a href={`https://wa.me/92${record.whatsapp_number?.slice(1)}`}
            target="_blank" rel="noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              marginTop: 20, padding: "11px 0",
              background: "linear-gradient(135deg,#25d366,#128c7e)",
              color: "#fff", borderRadius: 10, fontWeight: 700, fontSize: 13,
              textDecoration: "none",
            }}>
            💬 Open WhatsApp Chat
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Component ───────────────────────────────────────
export default function ApplyNow() {
  const [records,   setRecords]   = useState([]);
  const [stats,     setStats]     = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState(""); // status filter
  const [page,      setPage]      = useState(1);
  const [totalPages,setTotalPages]= useState(1);
  const [total,     setTotal]     = useState(0);
  const [selected,  setSelected]  = useState(null); // detail modal
  const [toast,     setToast]     = useState(null);

  const LIMIT = 10;

  // ── Fetch Stats ────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const res  = await fetch(`${API}/apply-now-stats?campus_id=${CAMPUS_ID}&session_id=${SESSION_ID}`);
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch { /* silent */ }
  }, []);

  // ── Fetch Records ──────────────────────────────────────────────
  const fetchRecords = useCallback(async (p = 1, s = search, f = filter) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        campus_id:  CAMPUS_ID,
        session_id: SESSION_ID,
        page: p, limit: LIMIT,
        ...(s && { search: s }),
        ...(f && { status: f }),
      });
      const res  = await fetch(`${API}/apply-now-list?${params}`);
      const data = await res.json();
      if (data.success) {
        setRecords(data.data);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setPage(data.currentPage);
      }
    } catch { /* silent */ }
    setLoading(false);
  }, [search, filter]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchRecords(1, search, filter); }, [filter]); // eslint-disable-line

  // search debounce
  useEffect(() => {
    const t = setTimeout(() => fetchRecords(1, search, filter), 400);
    return () => clearTimeout(t);
  }, [search]); // eslint-disable-line

  // ── Status Change ──────────────────────────────────────────────
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res  = await fetch(`${API}/apply-now-status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        // Update local state
        setRecords(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
        if (selected?.id === id) setSelected(prev => ({ ...prev, status: newStatus }));
        fetchStats();
        showToast(`✅ Status changed to "${newStatus}"`);
      }
    } catch {
      showToast("❌ Status update failed", "error");
    }
  };

  // ── Delete ─────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm(`Application #${id} delete karna chahte hain?`)) return;
    try {
      const res  = await fetch(`${API}/apply-now-delete/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setRecords(prev => prev.filter(r => r.id !== id));
        if (selected?.id === id) setSelected(null);
        fetchStats();
        setTotal(t => t - 1);
        showToast("🗑️ Record deleted");
      }
    } catch {
      showToast("❌ Delete failed", "error");
    }
  };

  const showToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Inline status dropdown ─────────────────────────────────────
  const StatusDropdown = ({ record }) => (
    <select
      value={record.status}
      onChange={e => handleStatusChange(record.id, e.target.value)}
      onClick={e => e.stopPropagation()}
      style={{
        padding: "5px 8px", borderRadius: 8, fontSize: 11, fontWeight: 700,
        border: `1.5px solid ${STATUS_META[record.status]?.border || "#e5e7eb"}`,
        background: STATUS_META[record.status]?.bg || "#fff",
        color: STATUS_META[record.status]?.color || "#374151",
        cursor: "pointer", outline: "none",
      }}
    >
      {Object.entries(STATUS_META).map(([k, m]) => (
        <option key={k} value={k}>{m.icon} {m.label}</option>
      ))}
    </select>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box }

        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to { transform:rotate(360deg) } }

        body { font-family:'DM Sans',sans-serif; background:#f1f4fb }

        .adm-table { width:100%; border-collapse:collapse }
        .adm-table th {
          background:#f8faff; color:#6b7280; font-size:10px; font-weight:700;
          text-transform:uppercase; letter-spacing:1px;
          padding:12px 16px; text-align:left; border-bottom:2px solid #e5e7eb;
          white-space:nowrap;
        }
        .adm-table td {
          padding:14px 16px; border-bottom:1px solid #f3f4f6;
          font-size:13.5px; color:#0d1a3a; vertical-align:middle;
        }
        .adm-table tr { cursor:pointer; transition:background .15s }
        .adm-table tr:hover td { background:#f8faff }

        .adm-input {
          padding:10px 14px; border:1.5px solid #e5e7eb; border-radius:10px;
          font-size:13px; font-family:'DM Sans',sans-serif; color:#0d1a3a;
          background:#fff; outline:none; transition:border-color .2s, box-shadow .2s;
        }
        .adm-input:focus { border-color:#0a1f5c; box-shadow:0 0 0 3px rgba(10,31,92,.08) }
        .adm-input::placeholder { color:#c0c7d4 }

        .page-btn {
          width:34px; height:34px; border-radius:8px; border:1.5px solid #e5e7eb;
          background:#fff; color:#374151; font-size:13px; font-weight:700;
          cursor:pointer; display:flex; align-items:center; justify-content:center;
          transition:all .15s;
        }
        .page-btn:hover:not(:disabled) { border-color:#0a1f5c; color:#0a1f5c }
        .page-btn.active { background:#0a1f5c; border-color:#0a1f5c; color:#fff }
        .page-btn:disabled { opacity:.35; cursor:not-allowed }

        .del-btn {
          padding:6px 10px; border-radius:7px; border:1.5px solid #fecaca;
          background:#fff; color:#ef4444; font-size:11px; font-weight:700;
          cursor:pointer; transition:all .15s;
        }
        .del-btn:hover { background:#fef2f2 }

        .spinner {
          width:32px; height:32px; border:3px solid #e5e7eb;
          border-top-color:#0a1f5c; border-radius:50%;
          animation:spin 1s linear infinite; margin:48px auto;
        }

        .toast {
          position:fixed; bottom:28px; right:28px; z-index:9999;
          padding:13px 20px; border-radius:12px; font-size:13px; font-weight:600;
          box-shadow:0 12px 40px rgba(0,0,0,.18);
          animation:fadeUp .3s ease;
          max-width:360px;
        }

        @media(max-width:900px) {
          .stat-row { flex-wrap:wrap !important }
          .stat-row > div { min-width:calc(50% - 8px) !important }
          .hide-sm { display:none !important }
        }
        @media(max-width:600px) {
          .stat-row > div { min-width:100% !important }
          .adm-table th:nth-child(n+4), .adm-table td:nth-child(n+4) { display:none }
        }
      `}</style>

      {/* ── Toast ── */}
      {toast && (
        <div className="toast" style={
          toast.type === "error"
            ? { background:"#fef2f2", color:"#991b1b", border:"1px solid #fecaca" }
            : { background:"#f0fdf4", color:"#166534", border:"1px solid #bbf7d0" }
        }>
          {toast.text}
        </div>
      )}

      {/* ── Detail Modal ── */}
      <DetailModal
        record={selected}
        onClose={() => setSelected(null)}
        onStatusChange={handleStatusChange}
      />

      <div style={{ minHeight:"100vh", background:"#f1f4fb", fontFamily:"'DM Sans',sans-serif" }}>

        {/* ── Top Nav ── */}
        <div style={{
          background:"rgb(235, 209, 151)",
          padding:"0 32px", height:62,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          boxShadow:"0 4px 20px rgba(0,0,0,.2)",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            
            <div>
              <div style={{ color:"black", fontWeight:700, fontSize:14 }}>Nasheman School</div>
              <div style={{ color:"black", fontSize:9.5, letterSpacing:"1.5px", textTransform:"uppercase" }}>
                Apply Now List
              </div>
            </div>
          </div>
          <button onClick={() => { fetchRecords(page); fetchStats(); }} style={{
            display:"flex", alignItems:"center", gap:6,
            background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.15)",
            color:"black", padding:"7px 14px", borderRadius:8,
            fontSize:12, fontWeight:600, cursor:"pointer",
          }}>
            🔄 Refresh
          </button>
        </div>

        <div style={{ padding:"28px 32px", maxWidth:1400, margin:"0 auto" }}>

          {/* ── Stats Row ── */}
          <div className="stat-row" style={{ display:"flex", gap:12, marginBottom:28, animation:"fadeUp .5s ease" }}>
            {[
              { key:"",         label:"Total",    icon:"📋", color:"rgb(235, 209, 151)", val: stats?.total    },
              { key:"pending",  label:"Pending",  icon:"⏳", color:"#f59e0b", val: stats?.pending  },
              { key:"reviewed", label:"Reviewed", icon:"👁️", color:"#3b82f6", val: stats?.reviewed },
              { key:"accepted", label:"Accepted", icon:"✅", color:"#10b981", val: stats?.accepted },
              { key:"rejected", label:"Rejected", icon:"❌", color:"#ef4444", val: stats?.rejected },
            ].map(s => (
              <StatCard key={s.key} label={s.label} value={s.val} icon={s.icon} color={s.color}
                active={filter === s.key}
                onClick={() => { setFilter(f => f === s.key ? "" : s.key); setPage(1); }}
              />
            ))}
          </div>

          {/* ── Table Card ── */}
          <div style={{
            background:"#fff", borderRadius:16,
            boxShadow:"0 4px 24px rgba(0,0,0,.07)",
            animation:"fadeUp .5s ease .1s both", overflow:"hidden",
          }}>

            {/* Toolbar */}
            <div style={{
              padding:"18px 24px", borderBottom:"1px solid #f3f4f6",
              display:"flex", alignItems:"center", gap:12, flexWrap:"wrap",
            }}>
              <input
                className="adm-input"
                placeholder="🔍  Search by name or phone..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                style={{ flex:1, minWidth:200 }}
              />

              <select className="adm-input" value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}>
                <option value="">All Status</option>
                {Object.entries(STATUS_META).map(([k, m]) => (
                  <option key={k} value={k}>{m.icon} {m.label}</option>
                ))}
              </select>

              <div style={{ fontSize:12, color:"#9ca3af", fontWeight:600, whiteSpace:"nowrap" }}>
                {total} record{total !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="spinner" />
            ) : records.length === 0 ? (
              <div style={{ textAlign:"center", padding:"56px 20px", color:"#9ca3af" }}>
                <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
                <div style={{ fontWeight:600, fontSize:15 }}>No records found</div>
                <div style={{ fontSize:12, marginTop:4 }}>Try adjusting filters</div>
              </div>
            ) : (
              <div style={{ overflowX:"auto" }}>
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>#ID</th>
                      <th>Student</th>
                      <th>Parent</th>
                      <th className="hide-sm">WhatsApp</th>
                      <th className="hide-sm">Disability</th>
                      <th>Status</th>
                      <th className="hide-sm">Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map(r => (
                      <tr key={r.id} onClick={() => setSelected(r)}>
                        <td>
                          <span style={{
                            background:"#f1f4fb", color:"#0a1f5c",
                            padding:"3px 8px", borderRadius:6, fontSize:12, fontWeight:700,
                          }}>#{r.id}</span>
                        </td>
                        <td>
                          <div style={{ fontWeight:600, color:"#0d1a3a" }}>{r.student_name}</div>
                          <div style={{ fontSize:11.5, color:"#9ca3af", marginTop:1 }}>{r.disability_type}</div>
                        </td>
                        <td style={{ color:"#374151" }}>{r.parent_name}</td>
                        <td className="hide-sm">
                          <a href={`https://wa.me/92${r.whatsapp_number?.slice(1)}`}
                            target="_blank" rel="noreferrer"
                            onClick={e => e.stopPropagation()}
                            style={{ color:"#25d366", fontWeight:700, textDecoration:"none", fontSize:13 }}>
                            💬 {r.whatsapp_number}
                          </a>
                        </td>
                        <td className="hide-sm">
                          <span style={{ fontSize:12, color:"#6b7280" }}>{r.disability_type}</span>
                        </td>
                        <td onClick={e => e.stopPropagation()}>
                          <StatusDropdown record={r} />
                        </td>
                        <td className="hide-sm" style={{ fontSize:11.5, color:"#9ca3af", whiteSpace:"nowrap" }}>
                          {fmtDate(r.created_at)}
                        </td>
                        <td onClick={e => e.stopPropagation()}>
                          <button className="del-btn" onClick={() => handleDelete(r.id)}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                padding:"16px 24px", borderTop:"1px solid #f3f4f6",
                display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10,
              }}>
                <div style={{ fontSize:12, color:"#9ca3af" }}>
                  Page {page} of {totalPages} · {total} total
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  <button className="page-btn" disabled={page <= 1}
                    onClick={() => { const p = page-1; setPage(p); fetchRecords(p); }}>‹</button>
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                    const pg = i + 1;
                    return (
                      <button key={pg} className={`page-btn${pg === page ? " active" : ""}`}
                        onClick={() => { setPage(pg); fetchRecords(pg); }}>
                        {pg}
                      </button>
                    );
                  })}
                  <button className="page-btn" disabled={page >= totalPages}
                    onClick={() => { const p = page+1; setPage(p); fetchRecords(p); }}>›</button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}