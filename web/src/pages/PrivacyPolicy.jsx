import { useEffect, useState } from 'react';
import { LockKeyhole } from 'lucide-react';
import { API_URL } from '../config/api';

export default function PrivacyPolicy() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/content/privacy`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load Privacy Policy');
        }

        setContent(data);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load Privacy Policy');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-[#666666]">Loading Privacy Policy...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="flex items-center gap-3 mb-4">
        <LockKeyhole className="w-7 h-7 text-[#d4af88]" />
        <h1 className="text-lg md:text-xl font-serif font-bold text-[#1a1a1a]">{content?.title}</h1>
      </div>
      <p className="text-sm text-[#666666] mb-6">Last updated: {content?.lastUpdated || 'N/A'}</p>
      <p className="text-[#2d2d2d] leading-relaxed mb-8">{content?.intro}</p>

      <div className="space-y-6">
        {content?.sections?.map((section, index) => (
          <section key={`${section.heading}-${index}`} className="bg-white border border-[#e8e8e8] p-6">
            <h4 className="text-sm font-semibold text-[#1a1a1a] mb-3">{section.heading}</h4>
            <p className="text-[#444444] leading-relaxed">{section.content}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
