'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Upload, Loader, ArrowLeft, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Video } from 'lucide-react'
import { Footer } from '@/components/footer'
import { HERO_VIDEO_URL } from '@/lib/hero-video'

const MAX_SIZE = 60 * 1024 * 1024

export default function UploadVideoPage() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [progress, setProgress] = useState(0)
  const [currentVideoUrl, setCurrentVideoUrl] = useState(HERO_VIDEO_URL)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/staff/bookings', { method: 'GET' }).then((res) => {
      if (res.status === 401) {
        router.push('/staff/login')
      }
    })
  }, [router])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (!selected) return

    if (!selected.type.startsWith('video/')) {
      setStatus('error')
      setMessage('Please select a video file (MP4, WebM, etc.)')
      return
    }

    if (selected.size > MAX_SIZE) {
      setStatus('error')
      setMessage(`File is ${(selected.size / 1024 / 1024).toFixed(1)}MB. Maximum size is 60MB.`)
      return
    }

    setFile(selected)
    setStatus('idle')
    setMessage('')
    setProgress(0)
  }

  async function handleUpload() {
    if (!file) return

    setStatus('uploading')
    setProgress(10)
    setMessage('')

    try {
      const res = await fetch('/api/staff/upload-video', {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      })

      setProgress(80)

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setMessage(data.error || 'Upload failed')
        return
      }

      setProgress(100)
      setStatus('success')
      setMessage('Video uploaded successfully. It is now live on your homepage.')
      setCurrentVideoUrl(`${data.url}?v=${Date.now()}`)
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      setStatus('error')
      setMessage('Network error during upload. Please try again.')
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.currentTarget.classList.add('border-primary', 'bg-primary/5')
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    e.currentTarget.classList.remove('border-primary', 'bg-primary/5')
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.currentTarget.classList.remove('border-primary', 'bg-primary/5')
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) {
      const fakeEvent = {
        target: { files: [dropped] },
      } as unknown as React.ChangeEvent<HTMLInputElement>
      handleFileChange(fakeEvent)
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <a
            href="/staff/dashboard"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to dashboard
          </a>

          <div className="bg-card border border-border rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-secondary px-6 py-8 text-center">
              <Video className="mx-auto mb-2 text-white" size={32} />
              <h1 className="text-2xl font-serif font-bold text-white">
                Hero Video Manager
              </h1>
              <p className="text-white/80 text-sm mt-1">
                Upload the background video for your homepage hero section
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-foreground">
                  Currently live video
                </h2>
                <video
                  src={currentVideoUrl}
                  muted
                  playsInline
                  controls
                  className="w-full rounded-lg border border-border bg-black aspect-video object-contain"
                />
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              >
                <Upload className="mx-auto mb-3 text-muted-foreground" size={36} />
                <p className="text-foreground font-medium">
                  Click to select or drag and drop a video file
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                  MP4 recommended. Max 60MB.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={status === 'uploading'}
                />
              </div>

              {file && (
                <div className="p-4 bg-muted/50 border border-border rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <Video className="text-primary shrink-0" size={20} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(1)}MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null)
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                    className="text-muted-foreground hover:text-foreground text-sm shrink-0 ml-3"
                    disabled={status === 'uploading'}
                  >
                    Remove
                  </button>
                </div>
              )}

              {status === 'uploading' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader className="animate-spin" size={16} />
                    Uploading {progress}%...
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {status === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      {message}
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      The video is stored in Supabase Storage and will not revert.
                    </p>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                  <p className="text-sm font-medium text-red-900">{message}</p>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!file || status === 'uploading'}
                className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {status === 'uploading' ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Upload and set as hero video
                  </>
                )}
              </button>

              <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border">
                <p className="font-semibold text-foreground">Looping</p>
                <p>
                  The video loops automatically. When it finishes playing, it
                  restarts immediately. No configuration needed.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  )
}
