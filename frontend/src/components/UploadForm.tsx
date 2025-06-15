import { useState } from 'react';
import api from '../api';

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [vidURL, setVidURL] = useState<string>('');
  const [error, setError] = useState<string>('');

  async function handleSubmit(e : React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!file || !vidURL) {
      setError('Please provide both a JSON file and a vidURL.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('video_url', vidURL);

    try {
      const response = await api.post('/tutorials/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload successful:', response.data);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='center flex flex-col gap-4'>
      <div>
        <label>Video Transcript File (JSON):</label>
        <input
          type="file"
          accept=".json"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>
      <div>
        <label>Video URL (Google Drive):</label>
        <input
          type="text"
          value={vidURL}
          onChange={(e) => setVidURL(e.target.value)}
        />
      </div>
      <button type="submit">
        Upload
      </button>
      <span>{error}</span>
    </form>
  );
};