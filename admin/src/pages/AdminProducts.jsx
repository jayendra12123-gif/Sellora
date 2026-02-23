import { useEffect, useMemo, useState } from "react";
import { adminDelete, adminGet, adminPost, adminPut } from "../api";
import Loader from "../components/Loader";

const emptyForm = {
  id: "",
  title: "",
  description: "",
  price: "",
  category: "",
  rating: "",
  stock: "",
  image: "",
  saleDiscountPercent: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await adminGet("/admin/products");
      setProducts(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(
      products.map((product) => product.category).filter(Boolean),
    );
    return ["all", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    return products.filter((product) => {
      if (categoryFilter !== "all" && product.category !== categoryFilter)
        return false;
      if (!lowered) return true;
      return (
        String(product.title || "")
          .toLowerCase()
          .includes(lowered) ||
        String(product.description || "")
          .toLowerCase()
          .includes(lowered) ||
        String(product.category || "")
          .toLowerCase()
          .includes(lowered) ||
        String(product.id || "").includes(lowered)
      );
    });
  }, [products, query, categoryFilter]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onEdit = (product) => {
    setEditingId(product.id);
    setForm({
      id: product.id,
      title: product.title || "",
      description: product.description || "",
      price: product.price ?? "",
      category: product.category || "",
      rating: product.rating ?? "",
      stock: product.stock ?? "",
      image: product.image || "",
      saleDiscountPercent: product.saleDiscountPercent ?? "",
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const openNewProduct = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        rating: form.rating === "" ? undefined : Number(form.rating),
        stock: form.stock === "" ? undefined : Number(form.stock),
        saleDiscountPercent:
          form.saleDiscountPercent === ""
            ? undefined
            : Number(form.saleDiscountPercent),
      };

      if (editingId) {
        await adminPut(`/admin/products/${editingId}`, payload);
      } else {
        await adminPost("/admin/products", payload);
      }

      await loadProducts();
      closeModal();
    } catch (err) {
      setError(err.message || "Failed to save product");
    }
  };

  const onDelete = async (productId) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await adminDelete(`/admin/products/${productId}`);
      await loadProducts();
    } catch (err) {
      setError(err.message || "Failed to delete product");
    }
  };

  return (
    <div className="grid" style={{ gap: 20 }}>
      <div className="card catalog-card">
        <div
          className="section-header products-header"
          style={{ marginBottom: 12 }}
        >
          <div>
            <div className="section-kicker">Catalog View</div>
            <div className="section-title">All Products</div>
            <div className="products-actions">
              <button className="button" onClick={openNewProduct}>
                Add Product
              </button>
            </div>
          </div>

          <div className="filters">
            <select
              className="select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              className="input"
              style={{ minWidth: 220 }}
              placeholder="Search by title, id, category..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <span className="badge">{filteredProducts.length} items</span>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{product.title}</div>
                      {product.description && (
                        <div style={{ fontSize: "0.8rem", color: "#6b6b6b" }}>
                          {String(product.description).slice(0, 60)}
                          {String(product.description).length > 60 ? "..." : ""}
                        </div>
                      )}
                    </td>
                    <td>{product.category}</td>
                    <td>₹{Number(product.price || 0).toFixed(2)}</td>
                    <td>
                      <span
                        className={
                          Number(product.stock || 0) > 5
                            ? "badge"
                            : "badge danger"
                        }
                      >
                        {product.stock ?? 0}
                      </span>
                    </td>
                    <td>
                      <button
                        className="button secondary"
                        onClick={() => onEdit(product)}
                      >
                        Edit
                      </button>{" "}
                      <button
                        className="button danger"
                        onClick={() => onDelete(product.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {!filteredProducts.length && (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        padding: 20,
                        textAlign: "center",
                        color: "#6b6b6b",
                      }}
                    >
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className="modal-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <div className="section-kicker">Inventory Studio</div>
                <div className="section-title">
                  {editingId ? "Edit Product" : "Add Product"}
                </div>
              </div>
              <div className="section-meta">
                Curate pricing, stock, and merchandising
              </div>
            </div>
            {error && (
              <div style={{ color: "#c0392b", marginBottom: 12 }}>{error}</div>
            )}
            <form onSubmit={onSubmit} className="form-grid product-form">
              <input
                name="id"
                value={form.id}
                onChange={onChange}
                placeholder="ID (optional)"
                className="input"
              />
              <input
                name="title"
                value={form.title}
                onChange={onChange}
                placeholder="Title"
                required
                className="input"
              />
              <input
                name="category"
                value={form.category}
                onChange={onChange}
                placeholder="Category"
                required
                className="input"
              />
              <input
                name="price"
                value={form.price}
                onChange={onChange}
                placeholder="Price"
                type="number"
                step="0.01"
                required
                className="input"
              />
              <input
                name="rating"
                value={form.rating}
                onChange={onChange}
                placeholder="Rating"
                type="number"
                step="0.1"
                className="input"
              />
              <input
                name="stock"
                value={form.stock}
                onChange={onChange}
                placeholder="Stock"
                type="number"
                className="input"
              />
              <input
                name="image"
                value={form.image}
                onChange={onChange}
                placeholder="Image URL"
                className="input"
              />
              <input
                name="saleDiscountPercent"
                value={form.saleDiscountPercent}
                onChange={onChange}
                placeholder="Sale Discount %"
                type="number"
                className="input"
              />
              <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                placeholder="Description"
                className="textarea span-2"
              />
              <div className="form-actions" style={{ marginTop: 12 }}>
                <button
                  type="submit"
                  className="button"
                  style={{ padding: 12, width: 180 }}
                >
                  {editingId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="button secondary"
                  style={{ padding: 12, width: 180 }}
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
