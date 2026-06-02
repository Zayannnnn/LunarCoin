'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { DOWNLOADS } from '@/lib/config/downloads'

export function DownloadButtonsGroup() {
  const { toast } = useToast()
  const [downloading, setDownloading] = useState<'mac' | 'windows' | null>(null)

  const handleDownload = async (platform: 'mac' | 'windows') => {
    const url = DOWNLOADS[platform]
    if (!url) {
      toast({
        title: "Download failed",
        description: "Installer not available yet.",
        variant: "destructive"
      })
      return
    }

    try {
      setDownloading(platform)
      // Check file availability with a standard fetch check
      const response = await fetch(url, { method: 'HEAD' }).catch(() => null)
      if (response && response.status === 404) {
        toast({
          title: "Download failed",
          description: "Installer not available yet.",
          variant: "destructive"
        })
        return
      }
      
      // Open direct file download
      window.location.href = url
    } catch {
      // Fallback: trigger download directly
      window.location.href = url
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card className="bg-card/45 border-border/25 flex flex-col justify-between p-4 card-glow-hover">
        <div className="mb-3">
          <h3 className="font-bold text-sm flex items-center gap-2 text-foreground font-mono">
            <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M0 3.449L9.75 2.1v9.45H0V3.449zM0 12.45h9.75v9.45L0 20.551v-8.1zM10.95 1.95L24 0v11.55H10.95V1.95zM10.95 12.45H24v9.6l-13.05-1.8v-7.8z"/>
            </svg>
            Windows OS
          </h3>
          <p className="text-[11px] text-muted-foreground mt-1">Portable Setup Installer</p>
        </div>
        <Button
          size="sm"
          className="w-full text-xs font-semibold shadow-md shadow-primary/5 cursor-pointer"
          onClick={() => handleDownload('windows')}
          disabled={downloading !== null}
        >
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Download (.exe)
        </Button>
      </Card>

      <Card className="bg-card/45 border-border/25 flex flex-col justify-between p-4 card-glow-hover">
        <div className="mb-3">
          <h3 className="font-bold text-sm flex items-center gap-2 text-foreground font-mono">
            <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.84-.98 2.94 1.07.08 2.16-.52 2.81-1.33z"/>
            </svg>
            macOS
          </h3>
          <p className="text-[11px] text-muted-foreground mt-1">Apple Silicon & Intel ZIP</p>
        </div>
        <Button
          size="sm"
          className="w-full text-xs font-semibold shadow-md shadow-primary/5 cursor-pointer"
          onClick={() => handleDownload('mac')}
          disabled={downloading !== null}
        >
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Download (.zip)
        </Button>
      </Card>
    </div>
  )
}
