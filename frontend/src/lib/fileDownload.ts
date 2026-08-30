import { supabase } from '@/lib/supabase'

export interface DownloadFileInfo {
  fileName: string
  fileSize?: number
  fileType?: string
  fileUrl?: string
  filePath?: string
  fileData?: string
}

/**
 * Downloads a file uploaded by students or stored in Supabase Storage.
 * Handles Blob conversion, Supabase auth, signed URLs, and triggers native file download
 * without downloading HTML error pages or running into cross-origin restrictions.
 */
export async function downloadStudentFile(fileObj: DownloadFileInfo): Promise<void> {
  if (!fileObj) throw new Error('Informasi berkas tidak ditemukan.')

  const fileName = fileObj.fileName || 'berkas_siswa.pdf'

  // Case 1: Mock / Dummy data with '#' and no real storage path
  if ((!fileObj.fileUrl || fileObj.fileUrl === '#') && !fileObj.filePath && !fileObj.fileData) {
    alert(`Berkas "${fileName}" merupakan data simulasi contoh (mock preview) dan belum tersimpan di Supabase Storage.`)
    return
  }

  // Case 2: Base64 data URL
  if (fileObj.fileData && fileObj.fileData.startsWith('data:')) {
    const a = document.createElement('a')
    a.href = fileObj.fileData
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    return
  }

  // Determine storage path
  let path = fileObj.filePath
  if (!path && fileObj.fileUrl && fileObj.fileUrl.includes('/materials/')) {
    path = decodeURIComponent(fileObj.fileUrl.split('/materials/')[1].split('?')[0])
  }

  let blob: Blob | null = null

  // Method 1: Use Supabase Storage download SDK (Authenticated via Supabase client)
  if (supabase && path) {
    try {
      const { data, error } = await supabase.storage.from('materials').download(path)
      if (!error && data) {
        blob = data
      } else if (error) {
        console.warn('[downloadStudentFile] Supabase SDK download failed, trying signed URL:', error)
      }
    } catch (e) {
      console.warn('[downloadStudentFile] Supabase SDK download exception:', e)
    }
  }

  // Method 2: Use Supabase Signed URL (if bucket is private or direct fetch needed)
  if (!blob && supabase && path) {
    try {
      const { data: signedData, error: signError } = await supabase.storage
        .from('materials')
        .createSignedUrl(path, 120, { download: fileName })
      if (!signError && signedData?.signedUrl) {
        const res = await fetch(signedData.signedUrl)
        if (res.ok) {
          const contentType = res.headers.get('content-type') || ''
          if (!contentType.includes('text/html')) {
            blob = await res.blob()
          }
        }
      }
    } catch (e) {
      console.warn('[downloadStudentFile] Signed URL fetch exception:', e)
    }
  }

  // Method 3: Direct fetch via public URL
  if (!blob && fileObj.fileUrl && fileObj.fileUrl !== '#' && fileObj.fileUrl.startsWith('http')) {
    try {
      const res = await fetch(fileObj.fileUrl)
      if (res.ok) {
        const contentType = res.headers.get('content-type') || ''
        if (!contentType.includes('text/html')) {
          blob = await res.blob()
        }
      }
    } catch (e) {
      console.warn('[downloadStudentFile] Direct fetch failed (CORS or network):', e)
    }
  }

  if (blob) {
    // Prevent downloading HTML error pages masked as PDF
    if (blob.type.includes('html')) {
      const text = await blob.text()
      if (text.includes('<!doctype html>') || text.includes('<html') || text.includes('Error') || text.includes('Unauthorized')) {
        throw new Error('Gagal mengunduh: Server mengembalikan respons HTML alih-alih berkas PDF. Pastikan bucket "materials" di Supabase sudah aktif dan memiliki izin baca (Storage Policy).')
      }
    }

    const objectUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = objectUrl
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(objectUrl), 2000)
    return
  }

  // Fallback: If Blob cannot be retrieved due to browser cross-origin policy, open URL directly
  if (fileObj.fileUrl && fileObj.fileUrl !== '#' && fileObj.fileUrl.startsWith('http')) {
    window.open(fileObj.fileUrl, '_blank')
    return
  }

  throw new Error('Berkas tidak dapat diunduh dari Supabase Storage. Pastikan berkas sudah terunggah dan izin akses bucket telah dikonfigurasi.')
}

/**
 * Opens / Views student file in a new browser tab
 */
export async function viewStudentFile(fileObj: DownloadFileInfo): Promise<void> {
  if (!fileObj) throw new Error('Informasi berkas tidak ditemukan.')

  const fileName = fileObj.fileName || 'berkas_siswa.pdf'

  if ((!fileObj.fileUrl || fileObj.fileUrl === '#') && !fileObj.filePath && !fileObj.fileData) {
    alert(`Berkas "${fileName}" merupakan data simulasi contoh (mock preview) dan belum tersimpan di Supabase Storage.`)
    return
  }

  if (fileObj.fileData) {
    const win = window.open()
    if (win) {
      win.document.write(`
        <!DOCTYPE html>
        <html>
          <head><title>${fileName}</title></head>
          <body style="margin:0; background-color:#1E1E1E; display:flex; justify-content:center; align-items:center; height:100vh;">
            <iframe src="${fileObj.fileData}" frameborder="0" style="width:100%; height:100%; border:none;" allowfullscreen></iframe>
          </body>
        </html>
      `)
    }
    return
  }

  let path = fileObj.filePath
  if (!path && fileObj.fileUrl && fileObj.fileUrl.includes('/materials/')) {
    path = decodeURIComponent(fileObj.fileUrl.split('/materials/')[1].split('?')[0])
  }

  if (supabase && path) {
    try {
      const { data: signedData } = await supabase.storage
        .from('materials')
        .createSignedUrl(path, 3600)
      if (signedData?.signedUrl) {
        window.open(signedData.signedUrl, '_blank')
        return
      }
    } catch (e) {
      console.warn('Failed to get signed URL for viewing:', e)
    }
  }

  if (fileObj.fileUrl && fileObj.fileUrl !== '#' && fileObj.fileUrl.startsWith('http')) {
    window.open(fileObj.fileUrl, '_blank')
    return
  }

  alert('Tidak dapat membuka berkas. Berkas mungkin belum diunggah dengan benar.')
}
