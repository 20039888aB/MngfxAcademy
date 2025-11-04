import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';

import { useRequireAuth } from '@/hooks/useRequireAuth';

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type Resource = {
  id: number;
  title: string;
  description: string;
  resource_type: 'document' | 'video';
  file?: string;
  video_url?: string;
  created_at: string;
};

const ResourcesPage = () => {
  const status = useRequireAuth();
  const { data: session } = useSession();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Resource | null>(null);

  const token = session?.djangoTokens?.access;

  const fetchResources = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/api/resources/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Unable to load resources');
      }
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchResources();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, token]);

  const handleDocumentUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;
    const formData = new FormData(event.currentTarget);
    formData.append('resource_type', 'document');
    setUploading(true);
    try {
      const response = await fetch(`${apiBase}/api/resources/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      event.currentTarget.reset();
      await fetchResources();
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleVideoAdd = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;
    const formData = new FormData(event.currentTarget);
    const payload = {
      resource_type: 'video',
      title: String(formData.get('title') || ''),
      description: String(formData.get('description') || ''),
      video_url: String(formData.get('video_url') || ''),
    };
    setUploading(true);
    try {
      const response = await fetch(`${apiBase}/api/resources/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Unable to save video');
      }
      event.currentTarget.reset();
      await fetchResources();
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    setUploading(true);
    try {
      const response = await fetch(`${apiBase}/api/resources/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Deletion failed');
      }
      await fetchResources();
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>Loading library…</span>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return null;
  }

  const videoResources = useMemo(() => resources.filter((item) => item.resource_type === 'video'), [resources]);
  const documentResources = useMemo(
    () => resources.filter((item) => item.resource_type === 'document'),
    [resources]
  );

  const embedUrl = (url?: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  return (
    <>
      <Head>
        <title>Resource Library | MngFX Academy</title>
      </Head>
      <section className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <h1 className="section-title">Resource Library</h1>
        <p className="section-subtitle" style={{ marginBottom: '2.5rem' }}>
          Upload PDFs, cheat sheets, and bookmark market breakdown videos for your cohort. All files are private to your
          account.
        </p>

        <div className="grid" style={{ gap: '2rem' }}>
          <div className="card">
            <h2 style={{ marginTop: 0 }}>Upload document</h2>
            <form onSubmit={handleDocumentUpload} style={{ display: 'grid', gap: '0.75rem' }}>
              <input name="title" placeholder="Title" required className="auth-input" style={{ width: '100%' }} />
              <textarea
                name="description"
                placeholder="Description"
                className="auth-input"
                style={{ width: '100%', minHeight: '90px' }}
              />
              <input name="file" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" required />
              <button className="btn-primary" type="submit" disabled={uploading}>
                {uploading ? 'Uploading…' : 'Upload document'}
              </button>
            </form>
          </div>

          <div className="card">
            <h2 style={{ marginTop: 0 }}>Add video</h2>
            <form onSubmit={handleVideoAdd} style={{ display: 'grid', gap: '0.75rem' }}>
              <input name="title" placeholder="Title" required className="auth-input" style={{ width: '100%' }} />
              <textarea
                name="description"
                placeholder="Description"
                className="auth-input"
                style={{ width: '100%', minHeight: '90px' }}
              />
              <input
                name="video_url"
                placeholder="Video URL (YouTube, Vimeo, Loom, etc.)"
                required
                className="auth-input"
                style={{ width: '100%' }}
              />
              <button className="btn-primary" type="submit" disabled={uploading}>
                {uploading ? 'Saving…' : 'Save video'}
              </button>
            </form>
          </div>
        </div>

        <div style={{ marginTop: '3rem' }}>
          <h2 className="section-title">Your documents</h2>
          {loading ? (
            <p>Loading…</p>
          ) : documentResources.length === 0 ? (
            <p style={{ color: '#64748b' }}>No documents yet. Upload a PDF or trading guide to get started.</p>
          ) : (
            <div className="grid" style={{ gap: '1rem' }}>
              {documentResources.map((doc) => (
                <div key={doc.id} className="card" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ marginTop: 0, marginBottom: '0.35rem' }}>{doc.title}</h3>
                    <p style={{ color: '#64748b', marginBottom: '0.75rem' }}>{doc.description}</p>
                    {doc.file && (
                      <a href={`${apiBase}${doc.file}`} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>
                        View / download
                      </a>
                    )}
                  </div>
                  <button className="btn-primary" style={{ padding: '0.4rem 0.75rem' }} onClick={() => handleDelete(doc.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: '3rem' }}>
          <h2 className="section-title">Video playbook</h2>
          {loading ? (
            <p>Loading…</p>
          ) : videoResources.length === 0 ? (
            <p style={{ color: '#64748b' }}>Add a link to your favourite breakdown, Weekly outlook, or mentorship session.</p>
          ) : (
            <div className="grid" style={{ gap: '1rem' }}>
              {videoResources.map((video) => (
                <div key={video.id} className="card" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ marginTop: 0 }}>{video.title}</h3>
                    <p style={{ color: '#64748b', marginBottom: '0.75rem' }}>{video.description}</p>
                    {video.video_url && (
                      <button
                        type="button"
                        className="btn-primary"
                        style={{ padding: '0.4rem 0.75rem' }}
                        onClick={() => setSelectedVideo(video)}
                      >
                        Watch
                      </button>
                    )}
                  </div>
                  <button className="btn-primary" style={{ padding: '0.4rem 0.75rem' }} onClick={() => handleDelete(video.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedVideo && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
          }}
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="card"
            style={{ width: '90%', maxWidth: '960px', padding: '1.5rem', position: 'relative' }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedVideo(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                border: 'none',
                background: 'rgba(15,23,42,0.6)',
                color: '#fff',
                borderRadius: '999px',
                padding: '0.35rem 0.75rem',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
            <h2 style={{ marginTop: 0 }}>{selectedVideo.title}</h2>
            <p style={{ color: '#64748b' }}>{selectedVideo.description}</p>
            <div style={{ marginTop: '1rem', position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={embedUrl(selectedVideo.video_url)}
                title={selectedVideo.title}
                allowFullScreen
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: '16px',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

ResourcesPage.disableLayout = false;

export default ResourcesPage;

