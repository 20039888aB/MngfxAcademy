import Head from 'next/head';
import imageCompression from 'browser-image-compression';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { useRequireAuth } from '@/hooks/useRequireAuth';

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type ProfileResponse = {
  email: string;
  nickname: string;
  bio: string;
  avatar?: string | null;
};

const ProfilePage = () => {
  const status = useRequireAuth();
  const { data: session, update } = useSession();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formState, setFormState] = useState({ nickname: '', bio: '' });
  const [avatarFeedback, setAvatarFeedback] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const token = session?.djangoTokens?.access;

  const fetchProfile = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/api/auth/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Unable to load profile');
      }
      const data = (await response.json()) as ProfileResponse;
      setProfile(data);
      setFormState({ nickname: data.nickname || '', bio: data.bio || '' });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, token]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      const response = await fetch(`${apiBase}/api/auth/profile/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });
      if (!response.ok) {
        throw new Error('Unable to save profile');
      }
      await fetchProfile();
      await update();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!token || !event.target.files?.length) return;
    let file = event.target.files[0];
    const data = new FormData();
    setAvatarFeedback(null);
    setAvatarUploading(true);
    try {
      if (file.size > 10 * 1024 * 1024) {
        file = await imageCompression(file, {
          maxSizeMB: 8,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        });
      }
      data.append('avatar', file);
      const response = await fetch(`${apiBase}/api/auth/profile/`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      if (!response.ok) {
        throw new Error('Unable to upload avatar');
      }
      await fetchProfile();
      await update();
      setAvatarFeedback('Avatar updated successfully.');
    } catch (error) {
      console.error(error);
      setAvatarFeedback('Failed to upload avatar. Try a different image.');
    } finally {
      setAvatarUploading(false);
      event.target.value = '';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>Loading profile…</span>
      </div>
    );
  }

  if (status !== 'authenticated' || !profile) {
    return null;
  }

  const avatarSrc = profile.avatar ? `${apiBase}${profile.avatar}` : null;

  return (
    <>
      <Head>
        <title>Your profile | MngFX Academy</title>
      </Head>
      <section className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', maxWidth: '960px' }}>
        <h1 className="section-title">Account</h1>
        <p className="section-subtitle">Update your trading persona, avatar and preferences.</p>

        <div className="card" style={{ display: 'grid', gap: '2rem' }}>
          <div style={{ display: 'grid', justifyItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: 'rgba(148,163,184,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: '0 24px 40px rgba(15, 23, 42, 0.18)',
              }}
            >
              {avatarSrc ? (
                <img src={avatarSrc} alt="Avatar" width={140} height={140} style={{ objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '2rem', color: '#64748b' }}>
                  {session?.user?.name?.slice(0, 2).toUpperCase() || 'FX'}
                </span>
              )}
            </div>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ margin: 0 }}>{session?.user?.name || profile.nickname || profile.email}</h2>
              {profile.nickname && (
                <p style={{ marginTop: '0.25rem', color: '#64748b' }}>Alias: {profile.nickname}</p>
              )}
            </div>
            <div style={{ display: 'grid', gap: '0.5rem', textAlign: 'center' }}>
              <label
                htmlFor="avatar-upload"
                className="btn-primary"
                style={{ cursor: 'pointer', padding: '0.5rem 1.25rem', display: 'inline-block' }}
              >
                {avatarUploading ? 'Uploading…' : 'Upload new avatar'}
              </label>
              <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarUpload} hidden />
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                PNG / JPG up to 10MB. Larger files are auto-compressed before upload.
              </p>
              {avatarFeedback && <p style={{ fontSize: '0.85rem', color: '#38bdf8' }}>{avatarFeedback}</p>}
            </div>
          </div>

          <form onSubmit={handleSave} style={{ display: 'grid', gap: '1rem' }}>
            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Email</label>
                <input value={profile.email} disabled className="auth-input" style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Nickname</label>
                <input
                  name="nickname"
                  value={formState.nickname}
                  onChange={handleChange}
                  placeholder="Trader alias"
                  className="auth-input"
                  style={{ width: '100%' }}
                  required
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Bio</label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={handleChange}
                placeholder="Share your trading focus, favourite pairs or session"
                className="auth-input"
                style={{ width: '100%', minHeight: '120px' }}
              />
            </div>
            <button className="btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

ProfilePage.disableLayout = false;

export default ProfilePage;

