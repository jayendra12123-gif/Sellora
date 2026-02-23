import { useEffect, useState } from 'react';
import { adminGet, adminPut } from '../api';

const emptyForm = {
  key: '',
  title: '',
  lastUpdated: '',
  intro: '',
  sectionsJson: '[]',
};

export default function AdminContent() {
  const [content, setContent] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const loadContent = async () => {
    try {
      const data = await adminGet('/admin/content');
      setContent(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load content');
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const onSelect = (entry) => {
    setForm({
      key: entry.key,
      title: entry.title || '',
      lastUpdated: entry.lastUpdated || '',
      intro: entry.intro || '',
      sectionsJson: JSON.stringify(entry.sections || [], null, 2),
    });
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let sections = [];
    try {
      sections = JSON.parse(form.sectionsJson || '[]');
    } catch (err) {
      setError('Sections must be valid JSON');
      return;
    }

    try {
      await adminPut(`/admin/content/${form.key}`, {
        slug: form.key,
        title: form.title,
        lastUpdated: form.lastUpdated,
        intro: form.intro,
        sections,
      });
      await loadContent();
    } catch (err) {
      setError(err.message || 'Failed to save content');
    }
  };

  return (
    <div className="grid" style={{ gap: 20 }}>
      <div className="content-grid">
        <div className="card">
          <div style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 12 }}>Content Keys</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {content.map((entry) => (
              <button
                key={entry.key}
                onClick={() => onSelect(entry)}
                className="button secondary"
                style={{ textAlign: 'left' }}
              >
                <div style={{ fontWeight: 600 }}>{entry.key}</div>
                <div style={{ fontSize: '0.8rem', color: '#6b6b6b' }}>{entry.title || entry.slug}</div>
              </button>
            ))}
            {!content.length && <div style={{ color: '#6b6b6b' }}>No content found</div>}
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 12 }}>Edit Content</div>
          {error && <div style={{ color: '#c0392b', marginBottom: 12 }}>{error}</div>}
          <form onSubmit={onSubmit} className="grid" style={{ gap: 12 }}>
            <input
              name="key"
              value={form.key}
              onChange={onChange}
              placeholder="Key"
              className="input"
              required
            />
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="Title"
              className="input"
            />
            <input
              name="lastUpdated"
              value={form.lastUpdated}
              onChange={onChange}
              placeholder="Last Updated"
              className="input"
            />
            <textarea
              name="intro"
              value={form.intro}
              onChange={onChange}
              placeholder="Intro"
              className="textarea"
            />
            <textarea
              name="sectionsJson"
              value={form.sectionsJson}
              onChange={onChange}
              placeholder="Sections JSON"
              className="textarea"
              style={{ minHeight: 200, fontFamily: 'monospace', fontSize: '0.85rem' }}
            />
            <button type="submit" className="button">
              Save Content
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
