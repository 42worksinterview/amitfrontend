import { useEffect, useState } from "react";
import api from "./api";

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  // SAME input for create and edit
  const [form, setForm] = useState({ title: "", description: "" });

  // show messages
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // determines if form is in edit mode
  const [editingId, setEditingId] = useState(null);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2500);
  };

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 2500);
  };

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/notes");
      setNotes(res.data);
    } catch (err) {
      showError("Failed to fetch notes");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async () => {
    if (editingId) {
      // UPDATE
      try {
        await api.put(`/notes/${editingId}`, form);
        showMessage("Note updated successfully!");
        setEditingId(null);
        setForm({ title: "", description: "" });
        fetchNotes();
      } catch (err) {
        showError("Failed to update note");
      }
    } else {
      // CREATE
      try {
        await api.post("/notes", form);
        showMessage("Note created successfully!");
        setForm({ title: "", description: "" });
        fetchNotes();
      } catch (err) {
        showError("Failed to create note");
      }
    }
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setForm({
      title: note.title,
      description: note.description,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: "", description: "" });
  };

  const deleteNote = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      showMessage("Note deleted");
      fetchNotes();
    } catch {
      showError("Delete failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Notes</h1>

      {loading && <p>Loading...</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Create/Edit Form */}
      <div>
        <input
          placeholder="title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <button onClick={handleSubmit}>
          {editingId ? "Save Changes" : "Create Note"}
        </button>

        {editingId && (
          <button onClick={cancelEdit} style={{ marginLeft: 10 }}>
            Cancel
          </button>
        )}
      </div>

      <ul>
        {notes.map((n) => (
          <li key={n.id} style={{ marginBottom: 20 }}>
            <strong>{n.title}</strong>
            <p>{n.description}</p>
            <button onClick={() => startEdit(n)}>Edit</button>
            <button onClick={() => deleteNote(n.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
