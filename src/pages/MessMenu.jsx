import { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const HOSTELS = [ "Ambika Girls Hostel","Parvati Girls Hostel", "Satpura Girls Hostel", "Manimahesh Girls Hostel", "Kailash Boys Hostel", "Himadri Boys Hostel", "Neelkanth Boys Hostel","Dhauladhar Boys Hostel", "Himgiri Boys Hostel" ];
const DAYS    = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const MEALS   = ["breakfast", "lunch", "snacks", "dinner"];

const MEAL_ICONS = {
  breakfast: "🌅",
  lunch:     "☀️",
  snacks:    "🍎",
  dinner:    "🌙",
};

const MEAL_COLORS = {
  breakfast: { bg: "#FFF7ED", border: "#FED7AA", label: "#EA580C" },
  lunch:     { bg: "#FEFCE8", border: "#FDE68A", label: "#CA8A04" },
  snacks:    { bg: "#F0FDF4", border: "#BBF7D0", label: "#16A34A" },
  dinner:    { bg: "#EFF6FF", border: "#BFDBFE", label: "#2563EB" },
};

function getTodayName() {
  return DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
}

export default function MessMenu() {
  const [selectedHostel, setSelectedHostel] = useState(HOSTELS[0]);
  const [menus, setMenus]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeDay, setActiveDay] = useState(getTodayName());
  const [editMode, setEditMode]   = useState(false);
  const [editWeek, setEditWeek]   = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState(null);

  // Get logged-in user from localStorage
  const user  = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  // Check if user is mess incharge or admin
  const isIncharge = user?.role === "mess_incharge" || user?.role === "admin";

  useEffect(() => { fetchMenus(); }, [selectedHostel]);

  async function fetchMenus() {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/mess?hostel=${encodeURIComponent(selectedHostel)}`);
      setMenus(res.data);
      if (res.data[0]?.week) setEditWeek(res.data[0].week);
      else setEditWeek({});
    } catch { showToast("Failed to load menu", "error"); }
    finally { setLoading(false); }
  }

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleMealChange(day, meal, value) {
    setEditWeek(prev => ({
      ...prev,
      [day]: { ...prev[day], [meal]: value }
    }));
  }

  async function handleSaveMenu() {
    setSaving(true);
    try {
      await axios.post(`${API}/api/mess`,
        { hostel: selectedHostel, week: editWeek },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("Menu updated successfully!");
      setEditMode(false);
      fetchMenus();
    } catch { showToast("Failed to save menu", "error"); }
    finally { setSaving(false); }
  }

  async function handleImageUpload() {
    if (!imageFile) return;
    setSaving(true);
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("hostel", selectedHostel);
    try {
      await axios.post(`${API}/api/mess/upload-image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      showToast("Image uploaded successfully!");
      setImageFile(null);
      setImagePreview(null);
      fetchMenus();
    } catch { showToast("Failed to upload image", "error"); }
    finally { setSaving(false); }
  }

  function handleImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  const currentMenu = menus[0];
  const todayData   = currentMenu?.week?.[activeDay];

  return (
    <div style={styles.page}>

      {/* Toast */}
      {toast && (
        <div style={{ ...styles.toast, background: toast.type === "error" ? "#EF4444" : "#22C55E" }}>
          {toast.msg}
        </div>
      )}

      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Mess <span style={{ color: "#F59E0B" }}>Menu</span>
        </h1>
        <p style={styles.heroSub}>
          Check your hostel's weekly mess menu.
          {isIncharge && <span style={styles.inchargeBadge}>🛡️ Mess Incharge</span>}
        </p>

        {/* Role indicator */}
        <div style={styles.roleIndicator}>
          <span style={isIncharge ? styles.roleChipIncharge : styles.roleChipStudent}>
            {isIncharge ? "🛡️ Incharge View" : "👤 Student View"}
          </span>
          {!user && (
            <span style={styles.loginHint}>
              <a href="/login" style={{ color: "#F59E0B" }}>Log in</a> as mess incharge to edit
            </span>
          )}
        </div>
      </div>

      {/* Hostel Tabs */}
      <div style={styles.hostelTabs}>
        {HOSTELS.map(h => (
          <button
            key={h}
            onClick={() => setSelectedHostel(h)}
            style={{ ...styles.hostelTab, ...(selectedHostel === h ? styles.hostelTabActive : {}) }}
          >
            {h}
          </button>
        ))}
      </div>

      {/* Incharge Controls — only visible to incharge/admin */}
      {isIncharge && (
        <div style={styles.inchargeBar}>
          <button onClick={() => setEditMode(!editMode)} style={styles.btnOutline}>
            {editMode ? "✕ Cancel Edit" : "✏️ Edit Weekly Menu"}
          </button>
          <label style={styles.btnOutline}>
            📷 Upload Menu Image
            <input type="file" accept="image/*" onChange={handleImageSelect} style={{ display: "none" }} />
          </label>
          {imageFile && (
            <button onClick={handleImageUpload} style={styles.btnPrimary} disabled={saving}>
              {saving ? "Uploading..." : "⬆️ Save Image"}
            </button>
          )}
        </div>
      )}

      {/* Image Preview before upload */}
      {imagePreview && (
        <div style={styles.imagePreviewWrap}>
          <p style={styles.imageLabel}>Preview:</p>
          <img src={imagePreview} alt="preview" style={styles.previewImg} />
        </div>
      )}

      {loading ? (
        <div style={styles.loader}>Loading menu...</div>
      ) : (
        <>
          {/* Uploaded Menu Image */}
          {currentMenu?.menuImage && !editMode && (
            <div style={styles.menuImageWrap}>
              <p style={styles.imageLabel}>📌 Menu Image</p>
              <img src={currentMenu.menuImage} alt="Mess Menu" style={styles.menuImage} />
            </div>
          )}

          {/* Day Tabs */}
          <div style={styles.dayTabs}>
            {DAYS.map(day => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                style={{ ...styles.dayTab, ...(activeDay === day ? styles.dayTabActive : {}) }}
              >
                {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                {day === getTodayName() && <span style={styles.todayDot} />}
              </button>
            ))}
          </div>

          {/* Edit Mode — incharge only */}
          {editMode && isIncharge ? (
            <div style={styles.editSection}>
              <h3 style={styles.editDayTitle}>
                ✏️ Editing: {activeDay.charAt(0).toUpperCase() + activeDay.slice(1)}
              </h3>
              <div style={styles.mealGrid}>
                {MEALS.map(meal => (
                  <div key={meal} style={{ ...styles.mealCard, background: MEAL_COLORS[meal].bg, border: `1.5px solid ${MEAL_COLORS[meal].border}` }}>
                    <div style={{ ...styles.mealLabel, color: MEAL_COLORS[meal].label }}>
                      {MEAL_ICONS[meal]} {meal.toUpperCase()}
                    </div>
                    <textarea
                      value={editWeek[activeDay]?.[meal] || ""}
                      onChange={e => handleMealChange(activeDay, meal, e.target.value)}
                      placeholder={`Enter ${meal} items...`}
                      style={styles.mealTextarea}
                      rows={3}
                    />
                  </div>
                ))}
              </div>
              <button onClick={handleSaveMenu} style={styles.btnPrimary} disabled={saving}>
                {saving ? "Saving..." : "💾 Save Menu"}
              </button>
            </div>
          ) : (
            /* Student view — read only */
            <div style={styles.mealGrid}>
              {MEALS.map(meal => (
                <div
                  key={meal}
                  style={{
                    ...styles.mealCard,
                    background: MEAL_COLORS[meal].bg,
                    border: `1.5px solid ${MEAL_COLORS[meal].border}`,
                  }}
                >
                  <div style={{ ...styles.mealLabel, color: MEAL_COLORS[meal].label }}>
                    {MEAL_ICONS[meal]} {meal.toUpperCase()}
                  </div>
                  <p style={styles.mealText}>
                    {todayData?.[meal] || <span style={{ color: "#9CA3AF", fontStyle: "italic" }}>Not updated yet</span>}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "24px 16px 60px",
    fontFamily: "'Segoe UI', sans-serif",
    position: "relative",
  },
  hero: {
    textAlign: "center",
    padding: "40px 0 24px",
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: 800,
    margin: 0,
    color: "#111827",
  },
  heroSub: {
    color: "#6B7280",
    marginTop: 8,
    fontSize: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  inchargeBadge: {
    background: "#EEF2FF",
    color: "#F59E0B",
    padding: "2px 10px",
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600,
  },
  roleIndicator: {
    marginTop: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  roleChipStudent: {
    background: "#F3F4F6",
    color: "#374151",
    padding: "8px 20px",
    borderRadius: 50,
    fontWeight: 600,
    fontSize: 14,
  },
  roleChipIncharge: {
    background: "#EEF2FF",
    color: "#F59E0B",
    padding: "8px 20px",
    borderRadius: 50,
    fontWeight: 600,
    fontSize: 14,
    border: "1.5px solid #F59E0B",
  },
  loginHint: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  hostelTabs: {
    display: "flex",
    justifyContent: "center",
    gap: 8,
    margin: "20px 0",
    flexWrap: "wrap",
  },
  hostelTab: {
    border: "1.5px solid #E5E7EB",
    background: "#fff",
    padding: "8px 20px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 500,
    color: "#6B7280",
    fontSize: 14,
    transition: "all 0.2s",
  },
  hostelTabActive: {
    background: "#EEF2FF",
    borderColor: "#F59E0B",
    color: "#F59E0B",
    fontWeight: 700,
  },
  inchargeBar: {
    display: "flex",
    gap: 10,
    justifyContent: "flex-end",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  dayTabs: {
    display: "flex",
    gap: 6,
    marginBottom: 20,
    overflowX: "auto",
    paddingBottom: 4,
  },
  dayTab: {
    border: "1.5px solid #E5E7EB",
    background: "#fff",
    padding: "8px 16px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 500,
    color: "#6B7280",
    fontSize: 13,
    whiteSpace: "nowrap",
    position: "relative",
    transition: "all 0.2s",
  },
  dayTabActive: {
    background: "#F59E0B",
    borderColor: "#F59E0B",
    color: "#fff",
    fontWeight: 700,
  },
  todayDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    background: "#22C55E",
    borderRadius: "50%",
  },
  mealGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16,
    marginBottom: 24,
  },
  mealCard: {
    borderRadius: 12,
    padding: "16px 18px",
    transition: "transform 0.2s",
  },
  mealLabel: {
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 10,
  },
  mealText: {
    margin: 0,
    fontSize: 15,
    color: "#374151",
    lineHeight: 1.5,
  },
  mealTextarea: {
    width: "100%",
    border: "1px solid #D1D5DB",
    borderRadius: 8,
    padding: "8px 10px",
    fontSize: 14,
    fontFamily: "inherit",
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
  },
  editSection: {
    marginBottom: 24,
  },
  editDayTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 14,
    color: "#374151",
  },
  btnPrimary: {
    background: "#F59E0B",
    color: "#fff",
    border: "none",
    padding: "10px 22px",
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  btnOutline: {
    background: "#fff",
    color: "#374151",
    border: "1.5px solid #D1D5DB",
    padding: "10px 18px",
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  },
  loader: {
    textAlign: "center",
    padding: 60,
    color: "#9CA3AF",
    fontSize: 16,
  },
  toast: {
    position: "fixed",
    top: 20,
    right: 20,
    color: "#fff",
    padding: "12px 20px",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 14,
    zIndex: 9999,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  imagePreviewWrap: {
    textAlign: "center",
    marginBottom: 16,
  },
  previewImg: {
    maxWidth: "100%",
    maxHeight: 300,
    borderRadius: 12,
    border: "2px dashed #F59E0B",
  },
  menuImageWrap: {
    textAlign: "center",
    marginBottom: 24,
  },
  menuImage: {
    maxWidth: "100%",
    borderRadius: 12,
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  imageLabel: {
    fontWeight: 600,
    color: "#6B7280",
    marginBottom: 8,
  },
};
