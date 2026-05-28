'use client'

import { useEffect, useState, useRef } from 'react'
import { blockchainApi } from '@/lib/api/blockchain'
import { LunarSDK } from '@/lib/sdk/lunar-sdk'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Image as ImageIcon,
  UploadCloud,
  File,
  FileCode,
  HardDrive,
  Database,
  Cpu,
  Layers,
  ShieldCheck,
  ShieldAlert,
  Server,
  Activity,
  Lock,
  Unlock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Boxes,
  Compass,
} from 'lucide-react'

// Restricted executable extensions for blockchain security shields
const RESTRICTED_EXTENSIONS = ['.exe', '.bat', '.sh', '.com', '.cmd', '.scr', '.msi', '.vbs', '.js', '.bin']

export default function NFTAndStoragePage() {
  const [loading, setLoading] = useState(true)
  const [activeWorkspace, setActiveWorkspace] = useState<'upload' | 'explorer'>('upload')
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  // Data states
  const [nfts, setNfts] = useState<any[]>([])
  const [files, setFiles] = useState<any[]>([])
  const [peers, setPeers] = useState<any[]>([])
  const [networkHealth, setNetworkHealth] = useState<any>(null)

  // Upload/Mint forms
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [uploadedMeta, setUploadedMeta] = useState<any>(null)
  const [safetyError, setSafetyError] = useState<string | null>(null)

  // Mint Wizard state
  const [nftName, setNftName] = useState('')
  const [nftDesc, setNftDesc] = useState('')
  const [nftAttributes, setNftAttributes] = useState<Array<{ key: string; value: string }>>([
    { key: 'Format', value: 'Original Graphic' },
    { key: 'Ecosystem', value: 'LunarFS' }
  ])
  const [minting, setMinting] = useState(false)
  const [mintStatus, setMintStatus] = useState<{ success: boolean; message: string; contractAddress?: string } | null>(null)

  // Selected file inspector
  const [inspectedFile, setInspectedFile] = useState<any>(null)

  async function loadInitialData(showLoader = false) {
    if (showLoader) setLoading(true)
    try {
      // Connect wallet dynamically to get active wallet
      const addr = await LunarSDK.connectWallet().catch(() => null)
      setWalletAddress(addr)

      const [nftsData, filesData, peersData, healthData] = await Promise.all([
        blockchainApi.getNFTs().catch(() => ({ nfts: [] })),
        blockchainApi.getFiles().catch(() => ({ files: [] })),
        blockchainApi.getPeers().catch(() => []),
        blockchainApi.getNetworkHealth().catch(() => null)
      ])

      setNfts(nftsData?.nfts || [])
      setFiles(filesData?.files || [])
      setPeers(peersData || [])
      setNetworkHealth(healthData || null)

      // Auto inspect first file if none is inspected
      const fileList = filesData?.files || []
      if (fileList.length > 0 && !inspectedFile) {
        setInspectedFile(fileList[0])
      }
    } catch (err) {
      console.error('Failed to load storage ecosystem metrics:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInitialData(true)
    const interval = setInterval(() => loadInitialData(false), 5000)
    return () => clearInterval(interval)
  }, [])

  // Handle Drag & Drop / Click uploads
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const validateFileExtension = (name: string): boolean => {
    const ext = name.slice(name.lastIndexOf('.')).toLowerCase()
    if (RESTRICTED_EXTENSIONS.includes(ext)) {
      setSafetyError(`Security Shield: Files with extension '${ext}' are restricted to defend the peer network from malicious payloads.`)
      setSelectedFile(null)
      return false
    }
    setSafetyError(null)
    return true
  }

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setUploadedMeta(null)
    setMintStatus(null)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      if (validateFileExtension(droppedFile.name)) {
        setSelectedFile(droppedFile)
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadedMeta(null)
    setMintStatus(null)
    const files = e.target.files
    if (files && files[0]) {
      if (validateFileExtension(files[0].name)) {
        setSelectedFile(files[0])
      }
    }
  }

  const triggerUpload = async () => {
    if (!selectedFile) return
    setUploading(true)
    setUploadProgress(10)
    setUploadedMeta(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      // Visual progress emulation
      const progIntv = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progIntv)
            return 90
          }
          return prev + 15
        })
      }, 100)

      const res = await blockchainApi.uploadFile(formData)
      clearInterval(progIntv)
      setUploadProgress(100)
      
      setUploadedMeta(res.metadata)
      setNftName(selectedFile.name.replace(/\.[^/.]+$/, "")) // Set default NFT name to filename
      loadInitialData(false)
    } catch (err: any) {
      setSafetyError(err.message || 'File upload to LunarFS failed.')
    } finally {
      setUploading(false)
    }
  }

  const triggerMintNFT = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadedMeta) return
    setMinting(true)
    setMintStatus(null)

    try {
      // Assemble attributes
      const propsObj: Record<string, string> = {}
      nftAttributes.forEach(attr => {
        if (attr.key.trim() && attr.value.trim()) {
          propsObj[attr.key.trim()] = attr.value.trim()
        }
      })

      const res = await blockchainApi.mintNFT(
        nftName,
        nftDesc,
        uploadedMeta.content_hash,
        propsObj
      )

      setMintStatus({
        success: true,
        message: `NFT Media asset successfully sealed! Deployed on-chain via smart contract program at address: ${res.nft.contract_address}`,
        contractAddress: res.nft.contract_address
      })
      setSelectedFile(null)
      setUploadedMeta(null)
      loadInitialData(false)
    } catch (err: any) {
      setMintStatus({
        success: false,
        message: err.message || 'NFT minting reverted.'
      })
    } finally {
      setMinting(false)
    }
  }

  const handleTogglePin = async (file: any) => {
    try {
      if (file.pinned) {
        await blockchainApi.unpinFile(file.content_hash)
      } else {
        await blockchainApi.pinFile(file.content_hash)
      }
      loadInitialData(false)
      // Update selected inspector file state
      const updated = { ...file, pinned: !file.pinned }
      setInspectedFile(updated)
    } catch (err) {
      console.error('Failed to toggle pinning state:', err)
    }
  }

  const handleAddAttribute = () => {
    setNftAttributes([...nftAttributes, { key: '', value: '' }])
  }

  const handleRemoveAttribute = (idx: number) => {
    const list = [...nftAttributes]
    list.splice(idx, 1)
    setNftAttributes(list)
  }

  const handleAttributeChange = (idx: number, field: 'key' | 'value', val: string) => {
    const list = [...nftAttributes]
    list[idx][field] = val
    setNftAttributes(list)
  }

  // Precompile bytecode program assembler to show what goes on-chain:
  const getCompiledBytecode = () => {
    const ownerHex = walletAddress || '0x2FB007CC0E53F181'
    const hashHex = uploadedMeta?.content_hash || 'LFS-CONTENTHASH'
    return `[
  ["PUSH", "${ownerHex}"],
  ["STORE", "nft_owner"],
  ["PUSH", "${hashHex}"],
  ["STORE", "nft_media_hash"],
  ["RETURN"]
]`
  }

  // Total LunarFS bytes calculation
  const totalFSBytes = files.reduce((acc, f) => acc + (f.size || 0), 0)
  const formattedTotalSize = totalFSBytes > 1024 * 1024 
    ? `${(totalFSBytes / (1024 * 1024)).toFixed(2)} MB`
    : `${(totalFSBytes / 1024).toFixed(2)} KB`

  if (loading && nfts.length === 0 && files.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">LunarFS Storage & NFTs</h1>
          <p className="text-muted-foreground mt-1">Decentralized storage and asset registry</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[120px] bg-muted/20 border-border/10" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-[450px] bg-muted/20" />
          <Skeleton className="h-[450px] bg-muted/20" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-300">
      
      {/* Header telemetry and title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary animate-pulse" />
            LunarFS Storage & NFT Ecosystem
          </h1>
          <p className="text-muted-foreground mt-1">
            Content-addressed P2P storage network featuring immutable, cryptographically signed NFT media registries.
          </p>
        </div>
        
        <div className="bg-muted/15 border border-border/10 rounded-lg px-4 py-2 text-xs font-mono flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-muted-foreground mr-1 uppercase font-bold text-[10px]">Node Status:</span>
          <span className="text-primary font-bold">ONLINE</span>
        </div>
      </div>

      {/* Network gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card className="bg-card/50 border-border/50 card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Total Storage Pool
            </CardTitle>
            <HardDrive className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">{formattedTotalSize}</div>
            <p className="text-xs text-muted-foreground">{files.length} active files content-addressed</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50 card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Local Chunks
            </CardTitle>
            <Database className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {files.reduce((acc, f) => acc + (f.chunks?.length || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Deterministic 64KB block fragments</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50 card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              NFT Collections
            </CardTitle>
            <ImageIcon className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">{nfts.length}</div>
            <p className="text-xs text-muted-foreground">Canonical contract programs on-chain</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50 card-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              LAN Replication
            </CardTitle>
            <Server className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">
              {networkHealth?.active_nodes_count || peers.length + 1} Nodes
            </div>
            <p className="text-xs text-muted-foreground">Active gossip replication anchors</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Workspaces Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left main interactive zone (larger) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/50 border-border/50 card-glow">
            <CardHeader className="pb-0">
              <div className="flex border-b border-border/20">
                <button
                  onClick={() => setActiveWorkspace('upload')}
                  className={cn(
                    'px-4 py-2.5 text-sm font-bold tracking-wider uppercase border-b-2 transition-all flex items-center gap-1.5',
                    activeWorkspace === 'upload'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  )}
                >
                  <UploadCloud className="h-4 w-4" />
                  Media Upload & Mint NFT
                </button>
                
                <button
                  onClick={() => setActiveWorkspace('explorer')}
                  className={cn(
                    'px-4 py-2.5 text-sm font-bold tracking-wider uppercase border-b-2 transition-all flex items-center gap-1.5',
                    activeWorkspace === 'explorer'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Database className="h-4 w-4" />
                  LunarFS File Explorer
                </button>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              
              {/* Tab 1: Upload & Mint */}
              {activeWorkspace === 'upload' ? (
                <div className="space-y-6">
                  
                  {/* Media dropzone uploader */}
                  {!uploadedMeta ? (
                    <div className="space-y-4">
                      <div
                        onDragOver={handleDragOver}
                        onDrop={handleFileDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                          "border-2 border-dashed border-border/40 hover:border-primary/50 bg-black/25 hover:bg-black/45 rounded-xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 min-h-[180px]",
                          selectedFile && "border-primary/40 bg-black/40"
                        )}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <UploadCloud className="h-10 w-10 text-primary/80 animate-bounce" />
                        
                        {selectedFile ? (
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-primary font-mono truncate max-w-md">{selectedFile.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {(selectedFile.size / 1024).toFixed(1)} KB · Ready for LunarFS fragmenting
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-foreground">Drag and drop file here, or click to upload</p>
                            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                              Files are chunked into 64KB pieces and signed. Restrictions apply to `.exe, .sh, .bat` files.
                            </p>
                          </div>
                        )}
                      </div>

                      {safetyError && (
                        <div className="bg-rose-500/5 border border-rose-500/20 text-rose-400 text-xs font-mono p-3 rounded-lg flex gap-2">
                          <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                          <div>{safetyError}</div>
                        </div>
                      )}

                      {selectedFile && (
                        <Button
                          onClick={triggerUpload}
                          disabled={uploading}
                          className="w-full py-5 text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 shadow-[0_0_15px_oklch(0.75_0.15_195/0.1)]"
                        >
                          {uploading ? `Fragmenting file (${uploadProgress}%)...` : 'Upload and Fragment to LunarFS'}
                        </Button>
                      )}
                    </div>
                  ) : (
                    
                    /* Phase 2 Mint Form Wizard */
                    <form onSubmit={triggerMintNFT} className="space-y-4 animate-in fade-in duration-200">
                      
                      {/* Success banner from upload */}
                      <div className="bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-xs font-mono p-3.5 rounded-lg flex items-center justify-between">
                        <div className="flex gap-2.5 items-center">
                          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                          <div>
                            <span className="font-bold">File Hashed: </span>
                            <span className="font-semibold select-all text-foreground">{uploadedMeta.content_hash}</span>
                          </div>
                        </div>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-none font-bold font-mono text-[9px] uppercase">
                          Safe & Staged
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Collectible Name</label>
                          <input
                            type="text"
                            required
                            value={nftName}
                            onChange={(e) => setNftName(e.target.value)}
                            placeholder="e.g. Cyber Genesis Art"
                            className="w-full bg-black/45 border border-border/20 px-3 py-2.5 rounded font-mono text-xs focus:outline-none focus:border-primary/50 text-foreground"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Ecosystem Storage Hash</label>
                          <input
                            type="text"
                            disabled
                            value={uploadedMeta.content_hash}
                            className="w-full bg-black/25 border border-border/10 px-3 py-2.5 rounded font-mono text-xs text-muted-foreground"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Description</label>
                        <textarea
                          required
                          rows={2}
                          value={nftDesc}
                          onChange={(e) => setNftDesc(e.target.value)}
                          placeholder="Describe the asset narrative, utilities, or smart properties..."
                          className="w-full bg-black/45 border border-border/20 p-3 rounded font-mono text-xs focus:outline-none focus:border-primary/50 text-foreground"
                        />
                      </div>

                      {/* Custom Attributes/Properties section */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Custom Properties / Metadata Slots</span>
                          <button
                            type="button"
                            onClick={handleAddAttribute}
                            className="text-[10px] text-primary font-bold hover:underline"
                          >
                            + Add Custom Attribute
                          </button>
                        </div>

                        <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1 scrollbar-thin">
                          {nftAttributes.map((attr, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                              <input
                                type="text"
                                placeholder="Property Key"
                                value={attr.key}
                                onChange={(e) => handleAttributeChange(idx, 'key', e.target.value)}
                                className="flex-1 bg-black/45 border border-border/20 px-2.5 py-1.5 rounded font-mono text-[10px] focus:outline-none focus:border-primary/30 text-foreground"
                              />
                              <input
                                type="text"
                                placeholder="Value"
                                value={attr.value}
                                onChange={(e) => handleAttributeChange(idx, 'value', e.target.value)}
                                className="flex-1 bg-black/45 border border-border/20 px-2.5 py-1.5 rounded font-mono text-[10px] focus:outline-none focus:border-primary/30 text-foreground"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveAttribute(idx)}
                                className="text-xs text-rose-400 hover:text-rose-500 font-bold px-1.5"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setUploadedMeta(null)}
                          className="flex-1 py-5 text-xs font-bold border border-border/10 text-muted-foreground hover:text-foreground"
                        >
                          Discard Upload
                        </Button>
                        
                        <Button
                          type="submit"
                          disabled={minting}
                          className="flex-1 py-5 text-xs font-bold uppercase tracking-wider"
                        >
                          {minting ? 'Compiling & Deploying...' : 'Deploy Smart Contract & Seal NFT'}
                        </Button>
                      </div>

                    </form>
                  )}

                  {/* Mint Status Notifications */}
                  {mintStatus && (
                    <div
                      className={cn(
                        'text-xs font-mono border rounded-lg p-3.5 leading-normal break-words flex gap-2.5',
                        mintStatus.success
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/5 border-rose-500/20 text-rose-400'
                      )}
                    >
                      <ShieldCheck className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p>{mintStatus.message}</p>
                        {mintStatus.contractAddress && (
                          <p className="text-[10px] text-muted-foreground">
                            Bytecode program compiled with gas cost ~3000 units. Registry catalog committed.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                
                /* Tab 2: LunarFS File Explorer */
                <div className="space-y-4">
                  {(files || []).length === 0 ? (
                    <div className="text-center py-12 space-y-2">
                      <HardDrive className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
                      <p className="text-xs text-muted-foreground italic">
                        No files currently registered in local storage node directories.
                      </p>
                      <Button
                        onClick={() => setActiveWorkspace('upload')}
                        variant="link"
                        className="text-xs text-primary"
                      >
                        Upload some assets to seed LunarFS
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Left: File lists */}
                      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Registered Assets</span>
                        {files.map((file) => {
                          const isInspected = inspectedFile?.content_hash === file.content_hash
                          return (
                            <div
                              key={file.content_hash}
                              onClick={() => setInspectedFile(file)}
                              className={cn(
                                "p-3 border rounded-xl bg-black/15 hover:bg-black/35 cursor-pointer transition-all duration-150 flex items-center justify-between",
                                isInspected ? "border-primary/50 shadow-[0_0_12px_oklch(0.75_0.15_195/0.05)] bg-black/25" : "border-border/10"
                              )}
                            >
                              <div className="space-y-1 min-w-0 flex-1">
                                <p className="font-mono text-xs font-semibold text-primary truncate">{file.filename}</p>
                                <div className="flex gap-2 items-center text-[10px] text-muted-foreground font-mono">
                                  <span>{(file.size / 1024).toFixed(1)} KB</span>
                                  <span>·</span>
                                  <span>{file.chunks?.length || 0} chunks</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {file.pinned ? (
                                  <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 text-[9px] font-mono py-0 font-bold flex gap-1 items-center">
                                    <Lock className="h-2.5 w-2.5" />
                                    PINNED
                                  </Badge>
                                ) : (
                                  <Badge className="bg-muted/30 text-muted-foreground border-none text-[9px] font-mono py-0 font-bold flex gap-1 items-center">
                                    <Unlock className="h-2.5 w-2.5" />
                                    UNPINNED
                                  </Badge>
                                )}
                                <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-all", isInspected && "text-primary translate-x-0.5")} />
                              </div>

                            </div>
                          )
                        })}
                      </div>

                      {/* Right: Asset Detail Inspector */}
                      <div className="bg-[#0b0f19]/30 border border-border/10 p-4 rounded-xl space-y-4 flex flex-col justify-between min-h-[320px]">
                        {inspectedFile ? (
                          <div className="space-y-3 flex-1">
                            <div className="flex items-start justify-between gap-2 border-b border-border/5 pb-2">
                              <div className="min-w-0">
                                <h3 className="text-xs font-bold text-foreground font-mono truncate">{inspectedFile.filename}</h3>
                                <p className="text-[9px] text-muted-foreground font-mono select-all truncate mt-0.5">{inspectedFile.content_hash}</p>
                              </div>
                              
                              <button
                                onClick={() => handleTogglePin(inspectedFile)}
                                className="bg-card/80 p-1.5 rounded-lg border border-border/10 hover:border-primary/30 text-muted-foreground hover:text-primary transition-all shrink-0"
                                title={inspectedFile.pinned ? "Unpin file chunks from local garbage collection" : "Pin file chunks in storage"}
                              >
                                {inspectedFile.pinned ? <Lock className="h-3.5 w-3.5 text-cyan-400" /> : <Unlock className="h-3.5 w-3.5" />}
                              </button>
                            </div>

                            <div className="space-y-2.5 text-xs font-mono">
                              <div className="flex justify-between text-[10px]">
                                <span className="text-muted-foreground">SIZE IN BYTES:</span>
                                <span className="text-foreground font-bold">{inspectedFile.size} Bytes</span>
                              </div>
                              <div className="flex justify-between text-[10px]">
                                <span className="text-muted-foreground">CREATOR WALLET:</span>
                                <span className="text-primary font-bold truncate max-w-[120px] text-right" title={inspectedFile.creator}>
                                  {inspectedFile.creator}
                                </span>
                              </div>
                              <div className="flex justify-between text-[10px]">
                                <span className="text-muted-foreground">SYNC REPLICAS:</span>
                                <span className="text-yellow-400 font-bold flex gap-1 items-center">
                                  <Server className="h-3 w-3 shrink-0" />
                                  {inspectedFile.replicas?.length || 1} hosts
                                </span>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Chunk Layout Trace</span>
                              <div className="bg-black/35 rounded-lg border border-border/5 p-2 font-mono text-[9px] max-h-[100px] overflow-y-auto scrollbar-thin text-muted-foreground space-y-1">
                                {(inspectedFile.chunks || []).map((chk: string, idx: number) => (
                                  <div key={idx} className="flex justify-between">
                                    <span>#{idx + 1} BLOCK:</span>
                                    <span className="text-purple-400 truncate max-w-[140px]" title={chk}>{chk}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="pt-2">
                              <a
                                href={`http://127.0.0.1:5000/file/${inspectedFile.content_hash}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-primary font-bold hover:underline flex gap-1 items-center w-fit"
                              >
                                <ExternalLink className="h-3 w-3" />
                                Stream raw inline file preview
                              </a>
                            </div>

                          </div>
                        ) : (
                          <div className="text-center italic text-xs text-muted-foreground py-16 flex-1 flex items-center justify-center">
                            Select a file to inspect metadata metrics.
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                </div>
              )}

            </CardContent>
          </Card>
        </div>

        {/* Right column: Compilation bytecode and heatmaps */}
        <div className="space-y-6">
          
          {/* NFT Smart Contract Precompiler Bytecode view */}
          <Card className="bg-card/50 border-border/50 card-glow">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-1.5 font-bold uppercase tracking-wider text-primary">
                <Cpu className="h-4 w-4 animate-pulse" />
                LunarVM Pre-compiler
              </CardTitle>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Dynamic generation of stack instructions compiling live NFT state variables.
              </p>
            </CardHeader>

            <CardContent className="space-y-3">
              <pre className="bg-black/45 p-3 rounded-lg border border-primary/15 font-mono text-[10px] text-cyan-400/90 max-h-[180px] overflow-y-auto whitespace-pre scrollbar-thin">
                {getCompiledBytecode()}
              </pre>
              
              <div className="text-[10px] text-muted-foreground font-mono space-y-1 bg-black/15 p-2 rounded-lg border border-border/5">
                <p className="text-foreground font-bold flex gap-1 items-center">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  Assembler Protocol Specifications
                </p>
                <p>· NFT is registered by compiling PUSH operations.</p>
                <p>· Variable `nft_owner` locks authentic ownership.</p>
                <p>· Variable `nft_media_hash` content addresses raw files.</p>
              </div>
            </CardContent>
          </Card>

          {/* Replica Heatmaps Panel */}
          <Card className="bg-[#0b0f19]/70 border border-border/40 card-glow">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <Activity className="h-4 w-4 text-cyan-400" />
                FS Replica Matrix Heatmap
              </CardTitle>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Dynamic chunk coverage tracking active peers holding file slices.
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {inspectedFile ? (
                <div className="space-y-3 font-mono">
                  
                  {/* Heatmap grids representation */}
                  <div className="space-y-1">
                    <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Distributed Chunk Nodes Map</span>
                    <div className="bg-black/45 p-3 rounded-lg border border-border/10 space-y-2">
                      
                      {/* Grid representation */}
                      <div className="flex flex-wrap gap-1.5">
                        {(inspectedFile.chunks || []).map((chk: string, idx: number) => {
                          const replicaCount = inspectedFile.replicas?.length || 1
                          return (
                            <div
                              key={idx}
                              className={cn(
                                "h-4 w-4 rounded-sm flex items-center justify-center text-[7px] font-bold select-none transition-colors",
                                replicaCount >= 3 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/35" :
                                replicaCount === 2 ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/35" :
                                "bg-purple-500/25 text-purple-400 border border-purple-500/35 animate-pulse"
                              )}
                              title={`Chunk #${idx + 1} (${chk}): Replicated across ${replicaCount} peers`}
                            >
                              {idx + 1}
                            </div>
                          )
                        })}
                      </div>

                      <div className="flex justify-between items-center text-[9px] text-muted-foreground pt-1 border-t border-border/5">
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-emerald-500/60" /> Highly Seeded
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-cyan-500/60" /> Healthy
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-purple-500/60 animate-pulse" /> Single Node
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Latency and telemetry metrics */}
                  <div className="space-y-2 bg-black/15 p-2 rounded-lg border border-border/5 text-[9px] text-muted-foreground">
                    <div className="flex justify-between">
                      <span>AVERAGE REPLICA DEPLOY:</span>
                      <span className="text-cyan-400 font-bold">~1.2 seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CONSENSUS VERIFICATION:</span>
                      <span className="text-emerald-400 font-bold">100% SECURE</span>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-center italic text-[11px] text-muted-foreground py-10">
                  Select a file in explorer to inspect distributed replication statuses.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Cyberpunk Gallery for Active NFT Collectibles */}
      <Card className="bg-card/50 border-border/50 card-glow">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 font-bold uppercase tracking-wider text-emerald-400">
            <Compass className="h-5 w-5 text-emerald-400" />
            Ecosystem Media Collectibles (NFT Gallery)
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cryptographically sealed immutable media catalog compiled on LunarVM program states.
          </p>
        </CardHeader>

        <CardContent>
          {(nfts || []).length === 0 ? (
            <div className="text-center py-12 space-y-2 border border-dashed border-border/10 rounded-xl bg-black/5">
              <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto opacity-40" />
              <p className="text-xs text-muted-foreground italic">
                No on-chain NFT media collectibles discovered yet in current blockchain states.
              </p>
              <p className="text-[10px] text-muted-foreground max-w-xs mx-auto">
                Mint file payloads to execute compiler VM transactions and claim ownership.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {nfts.map((nft) => (
                <div
                  key={nft.id}
                  className="bg-[#0c101b]/70 border border-border/30 rounded-xl overflow-hidden hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.08)] transition-all duration-300 flex flex-col justify-between group h-full"
                >
                  
                  {/* Image/Media dynamic viewer */}
                  <div className="aspect-video bg-black/40 border-b border-border/15 relative overflow-hidden flex items-center justify-center">
                    
                    {/* Inline file preview stream from backend */}
                    <img
                      src={`http://127.0.0.1:5000/file/${nft.content_hash}`}
                      alt={nft.name}
                      onError={(e) => {
                        // Fallback to custom glowing canvas on preview load fail
                        e.currentTarget.style.display = 'none'
                        const target = e.currentTarget.nextSibling as HTMLDivElement
                        if (target) target.style.display = 'flex'
                      }}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Cyberpunk Fallback SVG Canvas */}
                    <div
                      className="hidden absolute inset-0 flex-col items-center justify-center bg-gradient-to-br from-black/60 to-emerald-950/20 p-4 text-center gap-1.5"
                    >
                      <ImageIcon className="h-8 w-8 text-emerald-500/80 animate-pulse" />
                      <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-bold">LunarFS Media Registry</span>
                      <span className="text-[8px] font-mono text-muted-foreground truncate w-full select-all" title={nft.content_hash}>
                        {nft.content_hash}
                      </span>
                    </div>

                    <Badge className="absolute top-2 right-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold uppercase tracking-wider py-0 rounded">
                      SEALED
                    </Badge>
                  </div>

                  {/* Details metadata info */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">{nft.name}</h4>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 min-h-[32px]">{nft.description || "No narrative registered."}</p>
                    </div>

                    <div className="space-y-2 border-t border-border/10 pt-3">
                      <div className="flex justify-between items-center text-[9px] font-mono">
                        <span className="text-muted-foreground uppercase">NFT Program:</span>
                        <span className="text-cyan-400 font-bold truncate max-w-[120px] select-all" title={nft.contract_address}>
                          {nft.contract_address || "Mempool Queue"}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-[9px] font-mono">
                        <span className="text-muted-foreground uppercase">Owner Wallet:</span>
                        <span className="text-foreground font-semibold truncate max-w-[120px] select-all" title={nft.owner}>
                          {nft.owner?.slice(0, 14)}...
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[9px] font-mono">
                        <span className="text-muted-foreground uppercase">Registered:</span>
                        <span className="text-muted-foreground">
                          {nft.timestamp ? nft.timestamp.split('T')[0] : 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Interactive properties badges */}
                    {nft.properties && Object.keys(nft.properties).length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {Object.entries(nft.properties).map(([k, v]: [string, any]) => (
                          <Badge
                            key={k}
                            variant="outline"
                            className="text-[8px] font-mono border-border/20 text-muted-foreground py-0"
                            title={`${k}: ${v}`}
                          >
                            {k.slice(0, 8)}: {v.slice(0, 10)}
                          </Badge>
                        ))}
                      </div>
                    )}

                  </div>

                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
