import { useEffect, useState } from "react";
import { adminDelete, adminGet, adminPost, adminPut } from "../api";

const emptyForm = {
  slug: "",
  name: "",
  icon: "",
  description: "",
  productIds: "",
};

export default function AdminCollections() {
  const [collections, setCollections] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingSlug, setEditingSlug] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

  const loadCollections = async () => {
    try {
      const data = await adminGet("/admin/collections");
      setCollections(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load collections");
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const parseProductIds = (value) =>
    value
      .split(",")
      .map((id) => Number.parseInt(id.trim(), 10))
      .filter((id) => Number.isInteger(id));

  const productIdList = parseProductIds(form.productIds);

  const onEdit = (collection) => {
    setEditingSlug(collection.slug);
    setForm({
      slug: collection.slug,
      name: collection.name || "",
      icon: collection.icon || "",
      description: collection.description || "",
      productIds: (collection.productIds || []).join(", "),
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingSlug(null);
    setForm(emptyForm);
  };

  const openNewCollection = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      slug: form.slug,
      name: form.name,
      icon: form.icon,
      description: form.description,
      productIds: parseProductIds(form.productIds),
    };

    try {
      if (editingSlug) {
        await adminPut(`/admin/collections/${editingSlug}`, payload);
      } else {
        await adminPost("/admin/collections", payload);
      }
      await loadCollections();
      closeModal();
    } catch (err) {
      setError(err.message || "Failed to save collection");
    }
  };

  const onDelete = async (slug) => {
    if (!window.confirm("Delete this collection?")) return;
    try {
      await adminDelete(`/admin/collections/${slug}`);
      await loadCollections();
    } catch (err) {
      setError(err.message || "Failed to delete collection");
    }
  };

  return (
    <div className="grid" style={{ gap: 20 }}>
      <div className="card">
        <div className="section-header collections-header">
          <div style={{ fontSize: "1.05rem", fontWeight: 600 }}>
            Collections
          </div>
          <div className="collections-actions">
            <button className="button" onClick={openNewCollection}>
              Add Collection
            </button>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Slug</th>
                <th>Name</th>
                <th>Products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((collection) => (
                <tr key={collection.slug}>
                  <td>{collection.slug}</td>
                  <td>{collection.name}</td>
                  <td>{collection.productIds?.length || 0}</td>
                  <td>
                    <button
                      className="button secondary"
                      onClick={() => onEdit(collection)}
                    >
                      Edit
                    </button>{" "}
                    <button
                      className="button danger"
                      onClick={() => onDelete(collection.slug)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!collections.length && (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      padding: 20,
                      textAlign: "center",
                      color: "#6b6b6b",
                    }}
                  >
                    No collections found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className="modal-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="collection-header">
              <div>
                <div className="collection-title">
                  {editingSlug ? "Edit Collection" : "Add Collection"}
                </div>
                <div className="collection-subtitle">
                  Curate groups of products for the storefront and homepage
                  showcases.
                </div>
              </div>
              <div className="collection-summary">
                <div className="pill">{productIdList.length} products</div>
                <div className="pill soft">Slug required</div>
              </div>
            </div>
            {error && (
              <div style={{ color: "#c0392b", marginBottom: 12 }}>{error}</div>
            )}
            <form onSubmit={onSubmit} className="collection-form">
              <div className="input-group">
                <label className="input-label">Slug</label>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={onChange}
                  placeholder="best-sellers"
                  required
                  className="input"
                  disabled={!!editingSlug}
                />
                <div className="input-hint">
                  Lowercase, hyphenated identifier used in URLs.
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Best Sellers"
                  required
                  className="input"
                />
                <div className="input-hint">
                  This appears on the storefront.
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Icon (optional)</label>
                <input
                  name="icon"
                  value={form.icon}
                  onChange={onChange}
                  placeholder="sparkles"
                  className="input"
                />
                <div className="input-hint">
                  Use a short icon name if supported in the UI.
                </div>
              </div>
              <div className="input-group span-2">
                <label className="input-label">Product IDs</label>
                <input
                  name="productIds"
                  value={form.productIds}
                  onChange={onChange}
                  placeholder="12, 15, 20, 33"
                  className="input"
                />
                <div className="input-hint">
                  Comma-separated product IDs to feature.
                </div>
              </div>
              <div className="input-group span-2">
                <label className="input-label">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  placeholder="Short description for collection detail views."
                  className="textarea"
                />
              </div>
              <div className="collection-actions">
                <button type="submit" className="button">
                  {editingSlug ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="button secondary"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
