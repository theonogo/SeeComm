import { useState } from 'react';
import api from '../api';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom';

import { Loader2Icon } from "lucide-react"
import { AxiosError } from 'axios';
import { useTutorialsContext } from '@/utils/TutorialsContext';

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [vidURL, setVidURL] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const navigate = useNavigate()
  const { refetch } = useTutorialsContext()

  async function handleSubmit(e : React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true)

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
      setError('')
      setLoading(false);
      refetch()
      navigate(`/tutorial/${response.data.id}/`)
    } catch (error) {
      if(error instanceof AxiosError && error.response?.data?.detail){
        setError(error.response.data.detail)
      } else {
        setError('Upload failed')
      }
      console.error('Upload failed:', error);
    }

    setLoading(true);
  };

  function handleReset(){
    setLoading(false)
    setError('')
    setFile(null)
    setVidURL('')
  }

  return (
    <form onSubmit={handleSubmit} className='center flex flex-col mt-6 max-w-2xl ml-8 gap-4'>
      <div className='max-w-md'>
        <Label htmlFor='vidFile'>Video Transcript File (JSON):</Label>
        <Input
          id='vidFile'
          type="file"
          accept=".json"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>
      <div className='max-w-md'>
        <Label htmlFor='vidUrl'>Video URL:</Label>
        <Input
          id='vidUrl'
          type="text"
          value={vidURL}
          placeholder="Google Drive link"
          onChange={(e) => setVidURL(e.target.value)}
        />
      </div>
      <div className='flex mt-2 gap-3'>
        {!loading ? 
        <Button type="submit">
          Upload
        </Button> : 
        <Button disabled>
          <Loader2Icon className="animate-spin" />
          Processing
        </Button>
        }
        
        <Button type="reset" variant={"outline"} onClick={() => handleReset()}>
          Cancel
        </Button>
        <span className='block self-center text-destructive font-semibold'>{error}</span>
      </div>
    </form>
  );
};