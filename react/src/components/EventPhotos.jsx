// ─────────────────────────────────────────────────────────────────────────────
// EventPhotos.jsx  —  FIXED VERSION
//
// Bugs fixed:
//  1. Upload URL was `/event-photos-list"` (trailing quote) → `/insert-event-photo`
//  2. Gallery fetch was `/event-photos` → `/event-photos-list`
//  3. Delete was `/event-photos/:id` → `/delete-event-photo/:id`
//  4. Gallery img src doubled the "events/" prefix  → `uploads/${p.filename}`
//  5. Added session_id + uploaded_by to meta form and FormData
//  6. Filter now uses `/event-names-list` API instead of deriving locally
//  7. Wired up bulk-delete via `/delete-event-photos-bulk`
//
// Dependencies:
//   npm install browser-image-compression axios
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useCallback, useEffect } from "react";
import imageCompression from "browser-image-compression";
import axios from "axios";

// ── CONFIG ────────────────────────────────────────────────────────────────────
const API_BASE = "http://147.93.104.16:7000";
const COMPRESS_OPTIONS = {
  maxSizeMB:        0.3,
  maxWidthOrHeight: 1280,
  useWebWorker:     true,
  fileType:         "image/webp",
  initialQuality:   0.80,
};

// ── STYLES ────────────────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: "100vh",
    background: "var(--wh, #f4f7ff)",
    fontFamily: "'Inter', sans-serif",
    paddingBottom: 60,
  },
  hero: {
    background: "linear-gradient(135deg, #111418 0%, #1a1f25 60%, #232a33 100%)",
    padding: "40px 20px 36px",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
    borderBottom: "3px solid #EBD197",
  },
  heroTitle: {
    fontFamily: "'Merriweather', serif",
    fontSize: "clamp(22px, 5vw, 38px)",
    color: "#fff",
    fontWeight: 900,
    marginBottom: 8,
  },
  heroSub: { color: "rgba(255,255,255,.6)", fontSize: 14, lineHeight: 1.7 },
  inner:   { maxWidth: 1100, margin: "0 auto", padding: "0 20px" },
  tabs: {
    display: "flex",
    gap: 8,
    margin: "28px 0 24px",
    borderBottom: "2px solid var(--br, #dce8ff)",
    paddingBottom: 0,
  },
  tab: (active) => ({
    padding: "9px 20px",
    borderRadius: "9px 9px 0 0",
    border: "none",
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
    transition: "all .22s",
    marginBottom: -2,
    background:   active ? "var(--bm, #2550c8)" : "transparent",
    color:        active ? "#fff" : "var(--mt, #5a6a90)",
    borderBottom: active ? "2px solid var(--bm, #2550c8)" : "2px solid transparent",
  }),
  dropzone: (drag) => ({
    border: `2px dashed ${drag ? "var(--bm, #2550c8)" : "var(--br, #dce8ff)"}`,
    borderRadius: 16,
    padding: "36px 20px",
    textAlign: "center",
    background: drag ? "var(--bp, #e8eeff)" : "var(--sf, #f4f7ff)",
    cursor: "pointer",
    transition: "all .25s",
    marginBottom: 20,
  }),
  dropIcon: { fontSize: 44, marginBottom: 10, display: "block" },
  dropText: { color: "var(--mt, #5a6a90)", fontSize: 14, lineHeight: 1.7 },
  browseBtn: {
    display: "inline-block",
    marginTop: 12,
    background: "var(--bm, #2550c8)",
    color: "#fff",
    border: "none",
    padding: "9px 22px",
    borderRadius: 9,
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    transition: "all .2s",
  },
  metaForm: {
    background: "var(--cb, #fff)",
    border: "1px solid var(--br, #dce8ff)",
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
  },
  metaTitle: {
    fontFamily: "'Merriweather', serif",
    fontSize: 15,
    fontWeight: 700,
    color: "var(--tx, #0d1a3a)",
    marginBottom: 14,
  },
  row:      { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 },
  fg:       { display: "flex", flexDirection: "column", gap: 4 },
  label:    { fontSize: 10, fontWeight: 700, color: "var(--bm, #2550c8)", letterSpacing: ".5px", textTransform: "uppercase" },
  input: {
    padding: "9px 11px",
    border: "2px solid var(--br, #dce8ff)",
    borderRadius: 9,
    fontSize: 13,
    fontFamily: "'Inter', sans-serif",
    color: "var(--tx, #0d1a3a)",
    background: "var(--sf, #f4f7ff)",
    outline: "none",
  },
  textarea: {
    padding: "9px 11px",
    border: "2px solid var(--br, #dce8ff)",
    borderRadius: 9,
    fontSize: 13,
    fontFamily: "'Inter', sans-serif",
    color: "var(--tx, #0d1a3a)",
    background: "var(--sf, #f4f7ff)",
    outline: "none",
    resize: "vertical",
    minHeight: 72,
    width: "100%",
    boxSizing: "border-box",
  },
  previewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: 10,
    marginBottom: 20,
  },
  previewCard: (status) => ({
    position: "relative",
    borderRadius: 10,
    overflow: "hidden",
    border: `2px solid ${
      status === "done"      ? "#22c55e" :
      status === "error"     ? "#ef4444" :
      status === "uploading" ? "var(--bm, #2550c8)" :
      "var(--br, #dce8ff)"
    }`,
    background: "var(--sf, #f4f7ff)",
    transition: "border-color .25s",
    aspectRatio: "1",
  }),
  previewImg:     { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  previewRemove: {
    position: "absolute", top: 4, right: 4,
    width: 22, height: 22, borderRadius: "50%",
    background: "rgba(239,68,68,.9)", color: "#fff",
    border: "none", fontSize: 11, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, zIndex: 2,
  },
  previewInfo: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    background: "linear-gradient(transparent, rgba(0,0,0,.7))",
    padding: "16px 6px 6px", fontSize: 9, color: "#fff",
    fontWeight: 600, textAlign: "center",
  },
  progressBar: (pct) => ({
    position: "absolute", bottom: 0, left: 0,
    height: 3, width: `${pct}%`,
    background: "var(--bm, #2550c8)", transition: "width .3s",
  }),
  statusBadge: () => ({ position: "absolute", top: 4, left: 4, fontSize: 14, lineHeight: 1 }),
  uploadBtn: (dis) => ({
    width: "100%", padding: "13px", borderRadius: 12, border: "none",
    background: dis ? "var(--br, #dce8ff)" : "linear-gradient(135deg, var(--b, #1a3a9e), var(--bm, #2550c8))",
    color: dis ? "var(--mt, #5a6a90)" : "#fff",
    fontSize: 15, fontWeight: 700, cursor: dis ? "not-allowed" : "pointer",
    fontFamily: "'Inter', sans-serif", transition: "all .3s",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
  }),
  statsBar: { display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" },
  statPill: () => ({
    display: "flex", alignItems: "center", gap: 6,
    background: "var(--cb, #fff)", border: "1px solid var(--br, #dce8ff)",
    borderRadius: 100, padding: "5px 13px", fontSize: 12, fontWeight: 600,
    color: "var(--tx, #0d1a3a)",
  }),
  statDot: (color) => ({ width: 7, height: 7, borderRadius: "50%", background: color }),
  galleryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 },
  galleryCard: {
    borderRadius: 14, overflow: "hidden",
    background: "var(--cb, #fff)", border: "1px solid var(--br, #dce8ff)",
    boxShadow: "0 3px 12px rgba(10,31,92,.07)",
    transition: "transform .25s, box-shadow .25s", cursor: "pointer",
  },
  galleryImg:       { width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" },
  galleryMeta:      { padding: "10px 12px", borderTop: "1px solid var(--br, #dce8ff)" },
  galleryEventName: { fontFamily: "'Merriweather', serif", fontSize: 12, fontWeight: 700, color: "var(--tx, #0d1a3a)", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  galleryDate:      { fontSize: 10, color: "var(--mt, #5a6a90)" },
  galleryDeleteBtn: {
    marginTop: 6, width: "100%", padding: "5px 0",
    border: "1px solid #fecaca", borderRadius: 7,
    background: "#fef2f2", color: "#ef4444",
    fontSize: 11, fontWeight: 700, cursor: "pointer",
    fontFamily: "'Inter', sans-serif", transition: "all .2s",
  },
  bulkDeleteBtn: (disabled) => ({
    padding: "7px 14px", border: "1px solid #fecaca", borderRadius: 9,
    background: disabled ? "#fafafa" : "#fef2f2",
    color: disabled ? "#ccc" : "#ef4444",
    fontSize: 12, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "'Inter', sans-serif", transition: "all .2s",
  }),
  lightboxBg: {
    position: "fixed", inset: 0, zIndex: 9000,
    background: "rgba(0,0,0,.92)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
  },
  lightboxImg: { maxWidth: "90vw", maxHeight: "85vh", borderRadius: 12, objectFit: "contain", boxShadow: "0 32px 80px rgba(0,0,0,.6)" },
  lightboxClose: {
    position: "absolute", top: 16, right: 20,
    background: "rgba(255,255,255,.12)", border: "none", color: "#fff",
    fontSize: 22, width: 40, height: 40, borderRadius: "50%", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  lightboxCaption: {
    position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)",
    background: "rgba(0,0,0,.6)", color: "#fff",
    padding: "7px 16px", borderRadius: 100, fontSize: 13, fontWeight: 600,
    backdropFilter: "blur(8px)", whiteSpace: "nowrap",
  },
  toast: (type) => ({
    position: "fixed", bottom: 24, right: 24, zIndex: 9999,
    padding: "12px 20px", borderRadius: 12, fontWeight: 700, fontSize: 13,
    fontFamily: "'Inter', sans-serif", boxShadow: "0 8px 32px rgba(0,0,0,.2)",
    background: type === "success" ? "#22c55e" : type === "error" ? "#ef4444" : "#2550c8",
    color: "#fff", display: "flex", alignItems: "center", gap: 8,
    animation: "slideUp .3s ease",
  }),
  spinner: {
    width: 18, height: 18,
    border: "2.5px solid rgba(255,255,255,.3)", borderTopColor: "#fff",
    borderRadius: "50%", animation: "spin .7s linear infinite", flexShrink: 0,
  },
  emptyState: { textAlign: "center", padding: "48px 20px", color: "var(--mt, #5a6a90)" },
  filterRow: { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" },
  filterSelect: {
    padding: "7px 12px", border: "1.5px solid var(--br, #dce8ff)", borderRadius: 9,
    fontSize: 12, fontFamily: "'Inter', sans-serif", outline: "none",
    color: "var(--tx, #0d1a3a)", background: "var(--cb, #fff)", cursor: "pointer",
  },
};

const injectKeyframes = () => {
  if (document.getElementById("ep-kf")) return;
  const s = document.createElement("style");
  s.id = "ep-kf";
  s.textContent = `
    @keyframes spin    { to { transform: rotate(360deg); } }
    @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
    @keyframes ncEnterEP { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
    @keyframes skelShimmerEP { 0%,100%{background-position:200% 0} 50%{background-position:-200% 0} }
    .ep-gallery-card:hover  { transform: translateY(-4px) !important; box-shadow: 0 10px 32px rgba(10,31,92,.14) !important; }
    .ep-gallery-del:hover   { background: #fee2e2 !important; }
    .ep-browse:hover        { background: var(--b, #1a3a9e) !important; transform: translateY(-1px); }
    .ep-upload-btn:hover:not([disabled]) { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(37,80,200,.35); }
    .ep-preview-card:hover .ep-overlay  { opacity: 1 !important; }
    input[type=text]:focus, input[type=date]:focus, input[type=number]:focus, textarea:focus { border-color: var(--bm, #2550c8) !important; }
  `;
  document.head.appendChild(s);
};

// ─────────────────────────────────────────────────────────────────────────────
export default function EventPhotos() {
  const [tab,            setTab]            = useState("upload");
  const [files,          setFiles]          = useState([]);
  const [uploading,      setUploading]      = useState(false);
  const [drag,           setDrag]           = useState(false);
  const [gallery,        setGallery]        = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [lightbox,       setLightbox]       = useState(null);
  const [toast,          setToast]          = useState(null);
  const [filterEvent,    setFilterEvent]    = useState("all");
  const [eventNames,     setEventNames]     = useState([]);   // from /event-names-list
  const [meta, setMeta] = useState({
    event_name:  "",
    event_date:  "",
    description: "",
    campus_id:   "16",
    session_id:  "1",
    uploaded_by: "",
  });

  const inputRef = useRef(null);

  useEffect(() => {
    injectKeyframes();
  }, []);

  useEffect(() => {
    if (tab === "gallery") {
      loadGallery();
      loadEventNames();
    }
  }, [tab]);

  // ── Compress ────────────────────────────────────────────────────────────────
  const compressFile = async (rawFile, id) => {
    try {
      const origKB     = Math.round(rawFile.size / 1024);
      const compressed = await imageCompression(rawFile, COMPRESS_OPTIONS);
      const compKB     = Math.round(compressed.size / 1024);
      setFiles(prev => prev.map(f =>
        f.id === id ? { ...f, compressed, origKB, compKB, status: "ready" } : f
      ));
    } catch {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: "error" } : f));
    }
  };

  // ── Add files ───────────────────────────────────────────────────────────────
  const addFiles = useCallback((rawFiles) => {
    const valid = Array.from(rawFiles).filter(f => f.type.startsWith("image/"));
    if (!valid.length) return;
    const newEntries = valid.map(f => ({
      id:         Math.random().toString(36).slice(2),
      file:       f,
      preview:    URL.createObjectURL(f),
      compressed: null,
      origKB:     0,
      compKB:     0,
      status:     "compressing",
      progress:   0,
      name:       f.name,
    }));
    setFiles(prev => [...prev, ...newEntries]);
    newEntries.forEach(e => compressFile(e.file, e.id));
  }, []);

  const onInputChange = e  => addFiles(e.target.files);
  const onDrop        = e  => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); };
  const onDragOver    = e  => { e.preventDefault(); setDrag(true); };
  const onDragLeave   = () => setDrag(false);
  const removeFile    = (id) => setFiles(prev => prev.filter(f => f.id !== id));

  // ── Upload  →  FIX 1: correct endpoint /insert-event-photo ─────────────────
  const handleUpload = async () => {
    if (!meta.event_name.trim()) { showToast("Event name zaroori hai!", "error"); return; }
    const readyFiles = files.filter(f => f.status === "ready");
    if (!readyFiles.length) { showToast("Koi compressed image ready nahi hai", "error"); return; }

    setUploading(true);

    for (const f of readyFiles) {
      setFiles(prev => prev.map(x => x.id === f.id ? { ...x, status: "uploading", progress: 0 } : x));

      const form = new FormData();
      // FIX 1: field name must be "photo" (matches upload.single("photo") in backend)
      form.append("photo",       f.compressed, `${Date.now()}_${f.name.replace(/\.[^.]+$/, ".webp")}`);
      form.append("event_name",  meta.event_name.trim());
      form.append("event_date",  meta.event_date  || "");
      form.append("description", meta.description || "");
      form.append("campus_id",   meta.campus_id   || "1");
      // FIX 5: include session_id + uploaded_by
      form.append("session_id",  meta.session_id  || "1");
      form.append("uploaded_by", meta.uploaded_by || "");

      try {
        // ✅ FIX 1: was `/event-photos-list"` (had trailing quote!) → correct endpoint
        await axios.post(`${API_BASE}/insert-event-photo`, form, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            const pct = Math.round((e.loaded * 100) / e.total);
            setFiles(prev => prev.map(x => x.id === f.id ? { ...x, progress: pct } : x));
          },
        });
        setFiles(prev => prev.map(x => x.id === f.id ? { ...x, status: "done", progress: 100 } : x));
      } catch (err) {
        console.error("[Upload error]", err);
        setFiles(prev => prev.map(x => x.id === f.id ? { ...x, status: "error" } : x));
      }
    }

    setUploading(false);
    showToast("Photos upload ho gayi! ✓", "success");
    setTimeout(() => setFiles(prev => prev.filter(f => f.status !== "done")), 2000);
  };

  // ── Load gallery  →  FIX 2: correct endpoint /event-photos-list ────────────
  const loadGallery = async () => {
    setGalleryLoading(true);
    try {
      // ✅ FIX 2: was `/event-photos` → correct endpoint
      const { data } = await axios.get(`${API_BASE}/event-photos-list`, {
        params: {
          campus_id:  meta.campus_id  || 1,
          session_id: meta.session_id || undefined,
          limit:      100,
        },
      });
      setGallery(data.photos || []);
    } catch (err) {
      console.error("[Gallery load error]", err);
      showToast("Gallery load nahi hui", "error");
    }
    setGalleryLoading(false);
  };

  // ── Load event names for filter  →  FIX 6: use /event-names-list ──────────
  const loadEventNames = async () => {
    try {
      // ✅ FIX 6: dedicated endpoint for distinct event names
      const { data } = await axios.get(`${API_BASE}/event-names-list`, {
        params: { campus_id: meta.campus_id || 1 },
      });
      setEventNames(data.events || []);
    } catch (err) {
      console.error("[EventNames error]", err);
    }
  };

  // ── Delete single photo  →  FIX 3: correct endpoint /delete-event-photo/:id
  const deletePhoto = async (id) => {
    if (!window.confirm("Yeh photo delete karein?")) return;
    try {
      // ✅ FIX 3: was `/event-photos/${id}` → correct endpoint
      await axios.delete(`${API_BASE}/delete-event-photo/${id}`);
      setGallery(prev => prev.filter(p => p.id !== id));
      showToast("Delete ho gaya ✓", "success");
    } catch (err) {
      console.error("[Delete error]", err);
      showToast("Delete nahi hua", "error");
    }
  };

  // ── FIX 7: Bulk delete — wired to /delete-event-photos-bulk ────────────────
  const bulkDeleteEvent = async (eventName) => {
    if (!window.confirm(`"${eventName}" ki saari photos delete karein?`)) return;
    try {
      const { data } = await axios.delete(`${API_BASE}/delete-event-photos-bulk`, {
        data: { event_name: eventName, campus_id: meta.campus_id || 1 },
      });
      setGallery(prev => prev.filter(p => p.event_name !== eventName));
      setEventNames(prev => prev.filter(e => e.event_name !== eventName));
      if (filterEvent === eventName) setFilterEvent("all");
      showToast(data.message || "Bulk delete ho gaya ✓", "success");
    } catch (err) {
      console.error("[Bulk delete error]", err);
      showToast("Bulk delete nahi hua", "error");
    }
  };

  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  // stats
  const compressing = files.filter(f => f.status === "compressing").length;
  const ready       = files.filter(f => f.status === "ready").length;
  const done        = files.filter(f => f.status === "done").length;
  const errored     = files.filter(f => f.status === "error").length;
  const totalSaved  = files.reduce((a, f) => a + Math.max(0, f.origKB - f.compKB), 0);

  // gallery filter
  const filteredGallery = filterEvent === "all"
    ? gallery
    : gallery.filter(p => p.event_name === filterEvent);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={S.page}>
      {/* Mobile overrides + theme alignment */}
      <style>{`
        @media (max-width: 600px) {
          .ep-row { grid-template-columns: 1fr !important; }
          .ep-tabs { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .ep-tab { flex: 0 0 auto; padding: 9px 14px !important; font-size: 12px !important; }
        }
        .ep-tab--active {
          background: #111418 !important;
          color: #EBD197 !important;
          border-bottom-color: #EBD197 !important;
        }
        .ep-browse-btn { background: #111418 !important; color: #EBD197 !important; }
        .ep-browse-btn:hover { background: #1a1f25 !important; }
      `}</style>

      {/* Hero */}
      <div style={S.hero}>
        {[{w:500,h:500,top:-180,right:-160},{w:350,h:350,bottom:-120,left:-100}].map((c,i)=>(
          <div key={i} style={{position:"absolute",width:c.w,height:c.h,top:c.top,right:c.right,bottom:c.bottom,left:c.left,borderRadius:"50%",border:"1px solid rgba(255,255,255,.07)",pointerEvents:"none"}}/>
        ))}
        <div style={{position:"relative",zIndex:1}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(245,200,66,.15)",border:"1px solid rgba(245,200,66,.3)",color:"#f5c842",padding:"5px 16px",borderRadius:100,fontSize:11,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase",marginBottom:14}}>
            📸 Event Photos Management
          </div>
          <h1 style={S.heroTitle}>Events ka Visual Archive</h1>
          <p style={S.heroSub}>Photos upload karein, compress hongi automatically,<br/>aur gallery mein khubsurti se dikh jayengi</p>
        </div>
      </div>

      <div style={S.inner}>
        {/* Tabs */}
        <div className="ep-tabs" style={S.tabs}>
          {[["upload","⬆️ Upload Photos"],["gallery","🖼️ Gallery"]].map(([k,l])=>(
            <button
              key={k}
              className={`ep-tab ${tab===k ? 'ep-tab--active' : ''}`}
              style={S.tab(tab===k)}
              onClick={()=>setTab(k)}
            >{l}</button>
          ))}
        </div>

        {/* ── UPLOAD TAB ── */}
        {tab === "upload" && (
          <div>
            {/* Meta Form */}
            <div style={S.metaForm}>
              <div style={S.metaTitle}>📋 Event Details</div>
              <div className="ep-row" style={S.row}>
                <div style={S.fg}>
                  <label style={S.label}>Event Name *</label>
                  <input
                    style={S.input}
                    placeholder="e.g. Annual Day 2025"
                    value={meta.event_name}
                    onChange={e => setMeta(p=>({...p, event_name: e.target.value}))}
                  />
                </div>
                <div style={S.fg}>
                  <label style={S.label}>Event Date</label>
                  <input
                    type="date"
                    style={S.input}
                    value={meta.event_date}
                    onChange={e => setMeta(p=>({...p, event_date: e.target.value}))}
                  />
                </div>
              </div>
              {/* FIX 5: session_id + uploaded_by fields */}
              <div className="ep-row" style={{...S.row, marginBottom: 12}}>
                <div style={S.fg}>
                  <label style={S.label}>Session ID</label>
                  <input
                    type="number"
                    style={S.input}
                    placeholder="e.g. 1"
                    value={meta.session_id}
                    onChange={e => setMeta(p=>({...p, session_id: e.target.value}))}
                  />
                </div>
                <div style={S.fg}>
                  <label style={S.label}>Campus ID</label>
                  <input
                    type="number"
                    style={S.input}
                    placeholder="e.g. 1"
                    value={meta.campus_id}
                    onChange={e => setMeta(p=>({...p, campus_id: e.target.value}))}
                  />
                </div>
              </div>
              <div className="ep-row" style={{...S.row, marginBottom: 12}}>
                <div style={S.fg}>
                  <label style={S.label}>Uploaded By</label>
                  <input
                    style={S.input}
                    placeholder="e.g. admin"
                    value={meta.uploaded_by}
                    onChange={e => setMeta(p=>({...p, uploaded_by: e.target.value}))}
                  />
                </div>
              </div>
              <div style={S.fg}>
                <label style={S.label}>Description (optional)</label>
                <textarea
                  style={S.textarea}
                  placeholder="Is event ke baare mein kuch likhein..."
                  value={meta.description}
                  onChange={e => setMeta(p=>({...p, description: e.target.value}))}
                />
              </div>
            </div>

            {/* Dropzone */}
            <div
              style={S.dropzone(drag)}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
            >
              <span style={S.dropIcon}>🖼️</span>
              <div style={S.dropText}>
                <strong style={{color:"var(--tx,#0d1a3a)"}}>Drag & Drop karo</strong> ya browse karo<br/>
                <span style={{fontSize:12}}>JPG, PNG, WEBP, GIF — Browser mein compress hogi (max 300 KB → WebP)</span>
              </div>
              <button
                className="ep-browse"
                style={S.browseBtn}
                onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}
              >
                📁 Browse Files
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                style={{display:"none"}}
                onChange={onInputChange}
              />
            </div>

            {/* Stats */}
            {files.length > 0 && (
              <div style={S.statsBar}>
                <div style={S.statPill()}><span style={S.statDot("var(--bm)")}/>Total: {files.length}</div>
                {compressing>0 && <div style={S.statPill()}><span style={S.statDot("#f59e0b")}/>Compressing: {compressing}</div>}
                {ready>0       && <div style={S.statPill()}><span style={S.statDot("#3b82f6")}/>Ready: {ready}</div>}
                {done>0        && <div style={S.statPill()}><span style={S.statDot("#22c55e")}/>Done: {done}</div>}
                {errored>0     && <div style={S.statPill()}><span style={S.statDot("#ef4444")}/>Error: {errored}</div>}
                {totalSaved>0  && <div style={S.statPill()}><span style={S.statDot("#8b5cf6")}/>💾 Saved: {totalSaved} KB</div>}
              </div>
            )}

            {/* Preview Grid */}
            {files.length > 0 && (
              <div style={S.previewGrid}>
                {files.map((f, idx) => (
                  <div
                    key={f.id}
                    className="ep-preview-card"
                    style={{
                      ...S.previewCard(f.status),
                      animation: `ncEnterEP .35s ease ${idx * 0.04}s both`,
                    }}
                  >
                    <img src={f.preview} alt={f.name} style={S.previewImg}/>

                    <div className="ep-overlay" style={{position:"absolute",inset:0,background:"rgba(0,0,0,.45)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,opacity:0,transition:"opacity .2s"}}>
                      <span style={{fontSize:12,color:"#fff",fontWeight:600,textAlign:"center",padding:"0 6px"}}>{f.name.slice(0,18)}</span>
                    </div>

                    <div style={S.statusBadge()}>
                      {f.status==="compressing" && "⏳"}
                      {f.status==="ready"        && "✅"}
                      {f.status==="uploading"    && "⬆️"}
                      {f.status==="done"         && "🎉"}
                      {f.status==="error"        && "❌"}
                    </div>

                    {f.status !== "uploading" && f.status !== "done" && (
                      <button style={S.previewRemove} onClick={()=>removeFile(f.id)}>✕</button>
                    )}

                    <div style={S.previewInfo}>
                      {f.origKB > 0
                        ? `${f.origKB}KB → ${f.compKB}KB`
                        : f.status === "compressing" ? "Compressing..." : ""
                      }
                    </div>

                    {f.status === "uploading" && <div style={S.progressBar(f.progress)}/>}
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <button
              className="ep-upload-btn"
              disabled={uploading || ready === 0 || compressing > 0}
              style={S.uploadBtn(uploading || ready === 0 || compressing > 0)}
              onClick={handleUpload}
            >
              {uploading
                ? <><div style={S.spinner}/> Uploading {files.filter(f=>f.status==="uploading").length} photos...</>
                : compressing > 0
                ? <><div style={S.spinner}/> Compressing {compressing} images...</>
                : ready > 0
                ? `⬆️ Upload ${ready} Photo${ready>1?"s":""} to Server`
                : files.length === 0
                ? "📁 Pehle photos select karo"
                : "Sab photos process ho rahi hain..."
              }
            </button>
          </div>
        )}

        {/* ── GALLERY TAB ── */}
        {tab === "gallery" && (
          <div>
            {/* Filter row */}
            <div style={S.filterRow}>
              <span style={{fontSize:13,color:"var(--mt)",fontWeight:600}}>Filter:</span>
              {/* FIX 6: options from /event-names-list with photo_count */}
              <select style={S.filterSelect} value={filterEvent} onChange={e=>setFilterEvent(e.target.value)}>
                <option value="all">All Events ({gallery.length})</option>
                {eventNames.map(e => (
                  <option key={e.event_name} value={e.event_name}>
                    {e.event_name} ({e.photo_count})
                  </option>
                ))}
              </select>

              {/* FIX 7: Bulk delete button for selected event */}
              {filterEvent !== "all" && (
                <button
                  style={S.bulkDeleteBtn(false)}
                  onClick={() => bulkDeleteEvent(filterEvent)}
                >
                  🗑️ Delete All "{filterEvent}"
                </button>
              )}

              <div style={{marginLeft:"auto",display:"flex",gap:8}}>
                <button onClick={()=>{loadGallery();loadEventNames();}} style={{...S.browseBtn,padding:"7px 14px",fontSize:12}}>
                  🔄 Refresh
                </button>
              </div>
            </div>

            {galleryLoading ? (
              <div style={S.galleryGrid}>
                {Array.from({length:8}).map((_,i)=>(
                  <div key={i} style={{...S.galleryCard,animation:`ncEnterEP .35s ease ${i*.04}s both`}}>
                    <div style={{width:"100%",aspectRatio:"4/3",background:"linear-gradient(90deg,var(--br,#dce8ff) 25%,var(--sf,#f4f7ff) 50%,var(--br,#dce8ff) 75%)",backgroundSize:"200% 100%",animation:"skelShimmerEP 1.4s infinite"}}/>
                    <div style={{padding:"10px 12px"}}>
                      <div style={{height:11,background:"var(--br)",borderRadius:5,width:"70%",marginBottom:6}}/>
                      <div style={{height:9,background:"var(--br)",borderRadius:5,width:"45%"}}/>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredGallery.length === 0 ? (
              <div style={S.emptyState}>
                <div style={{fontSize:52,marginBottom:12}}>📭</div>
                <div style={{fontSize:16,fontWeight:700,color:"var(--tx)",marginBottom:6}}>Koi photo nahi mili</div>
                <div style={{fontSize:13}}>Upload tab se photos add karein</div>
              </div>
            ) : (
              <div style={S.galleryGrid}>
                {filteredGallery.map((p, i) => (
                  <div
                    key={p.id}
                    className="ep-gallery-card"
                    style={{...S.galleryCard, animation:`ncEnterEP .35s ease ${i*.04}s both`}}
                  >
                    <img
                      // ✅ FIX 4: filename already contains "events/" prefix
                      // was: `${API_BASE}/uploads/events/${p.filename}` → doubled path
                      src={`${API_BASE}/uploads/${p.filename}`}
                      alt={p.event_name}
                      style={S.galleryImg}
                      onClick={() => setLightbox({
                        url: `${API_BASE}/uploads/${p.filename}`,
                        caption: `${p.event_name}${p.event_date ? " · " + p.event_date : ""}`,
                      })}
                      loading="lazy"
                    />
                    <div style={S.galleryMeta}>
                      <div style={S.galleryEventName}>{p.event_name}</div>
                      <div style={S.galleryDate}>
                        {p.event_date
                          ? new Date(p.event_date).toLocaleDateString("en-PK",{day:"numeric",month:"short",year:"numeric"})
                          : "—"
                        }
                        {" · "}{Math.round(p.file_size_kb || 0)} KB
                      </div>
                      <button
                        className="ep-gallery-del"
                        style={S.galleryDeleteBtn}
                        onClick={() => deletePhoto(p.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div style={S.lightboxBg} onClick={()=>setLightbox(null)}>
          <button style={S.lightboxClose} onClick={()=>setLightbox(null)}>✕</button>
          <img src={lightbox.url} alt="fullsize" style={S.lightboxImg} onClick={e=>e.stopPropagation()}/>
          {lightbox.caption && <div style={S.lightboxCaption}>{lightbox.caption}</div>}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={S.toast(toast.type)}>
          {toast.type==="success"?"✅":toast.type==="error"?"❌":"ℹ️"} {toast.msg}
        </div>
      )}
    </div>
  );
}