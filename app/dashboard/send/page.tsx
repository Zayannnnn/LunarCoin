'use client'

import { useEffect, useState } from 'react'
import { blockchainApi } from '@/lib/api/blockchain'
import type { Address, Transaction } from '@/lib/types/blockchain'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Check, Coins, Copy, Wallet, Send, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

function truncateAddress(address: string, chars = 8): string {
  if (!address) return '-'
  if (address.length <= chars * 2) return address
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

export default function SendCoinsPage() {
  const [wallet, setWallet] = useState<Address | null>(null)
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)
  const [copied, setCopied] = useState(false)

  // Form states
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [txError, setTxError] = useState<string | null>(null)
  const [txSuccess, setTxSuccess] = useState<any | null>(null)

  // Sent history
  const [recentSent, setRecentSent] = useState<Transaction[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  const fetchWallet = async () => {
    try {
      setLoading(true)
      const data = await blockchainApi.getWallet()
      setWallet(data || null)
      setOffline(false)
    } catch (err) {
      console.error('Failed to fetch wallet:', err)
      setWallet(null)
      setOffline(true)
    } finally {
      setLoading(false)
    }
  }

  const fetchHistory = async () => {
    if (!wallet?.address) return
    try {
      setLoadingHistory(true)
      // Fetch all transactions and filter down to ours
      const data = await blockchainApi.getTransactions(1, 50, 'all')
      const filtered = (data?.transactions || []).filter(
        (tx) => tx.from.toLowerCase() === wallet.address.toLowerCase() ||
                tx.to.toLowerCase() === wallet.address.toLowerCase()
      )
      setRecentSent(filtered.slice(0, 10))
    } catch (err) {
      console.error('Failed to fetch transaction history:', err)
    } finally {
      setLoadingHistory(false)
    }
  }

  useEffect(() => {
    fetchWallet()
  }, [])

  useEffect(() => {
    if (wallet?.address) {
      fetchHistory()
    }
  }, [wallet?.address])

  const handleCopy = async () => {
    if (!wallet?.address) return
    await navigator.clipboard.writeText(wallet.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setTxError(null)
    setTxSuccess(null)

    if (!recipient) {
      setTxError('Recipient address is required.')
      return
    }
    if (!amount || parseFloat(amount) <= 0) {
      setTxError('Amount must be greater than zero.')
      return
    }
    if (wallet && parseFloat(amount) + 0.0001 > wallet.balance) {
      setTxError('Insufficient balance. Remember to leave 0.0001 LUNAR for the transaction fee.')
      return
    }

    try {
      setSubmitting(true)
      const res = await blockchainApi.sendTransaction(recipient, parseFloat(amount))
      if (res.error) {
        setTxError(res.error)
      } else {
        setTxSuccess(res)
        setRecipient('')
        setAmount('')
        // Refresh balance and history
        await fetchWallet()
        await fetchHistory()
      }
    } catch (err: any) {
      console.error('Failed to send transaction:', err)
      setTxError(err.message || 'Failed to submit transaction to miner.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Send Coins</h1>
        <p className="text-muted-foreground mt-1">
          Compile, sign, and broadcast LunarCoin transfers securely across the local peer network
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[300px] lg:col-span-2" />
          <Skeleton className="h-[300px]" />
        </div>
      ) : offline ? (
        <Card className="bg-card/50 border-border/50 max-w-2xl">
          <CardContent className="py-12 text-center">
            <Wallet className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Miner Offline</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Start the local backend at http://127.0.0.1:5000 to send coins.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Transaction Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card/30 border-border/40 backdrop-blur-md shadow-2xl relative overflow-hidden card-glow">
              {/* Decorative light effect */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
              
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <Send className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Create New Transfer</CardTitle>
                    <CardDescription>
                      The transaction will be signed locally via SECP256R1 ECDSA
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSend} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Sender Wallet (You)
                    </label>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-input/20 border border-border/30 font-mono text-xs text-muted-foreground break-all">
                      <span>{wallet?.address}</span>
                      <span className="shrink-0 ml-2 text-primary font-semibold font-sans">
                        {(wallet?.balance ?? 0).toFixed(4)} LUNAR
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="recipient" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Recipient Wallet Address
                    </label>
                    <Input
                      id="recipient"
                      placeholder="e.g. 2FB007CC0E53F181 (16-char hex address)"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value.trim())}
                      disabled={submitting}
                      className="bg-input/20 border-border/50 font-mono text-sm focus-visible:ring-primary focus-visible:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="amount" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Amount (LUNAR)
                    </label>
                    <div className="relative">
                      <Input
                        id="amount"
                        type="number"
                        step="any"
                        placeholder="0.0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        disabled={submitting}
                        className="bg-input/20 border-border/50 font-mono text-sm pl-10 focus-visible:ring-primary focus-visible:border-primary"
                      />
                      <Coins className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/60" />
                      <div className="absolute right-3.5 top-2">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="xs" 
                          onClick={() => {
                            if (wallet) {
                              const maxAmount = Math.max(0, wallet.balance - 0.0001)
                              setAmount(maxAmount.toFixed(4))
                            }
                          }}
                          className="h-7 text-xs px-2 hover:bg-primary/10 text-primary border border-primary/20"
                        >
                          Max
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
                    <span>Standard Network Fee</span>
                    <span className="font-mono text-primary font-medium">0.000100 LUNAR</span>
                  </div>

                  {txError && (
                    <div className="p-3.5 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-sm flex items-start gap-2.5">
                      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-semibold">Transaction Failed</p>
                        <p className="text-xs leading-relaxed text-destructive/80">{txError}</p>
                      </div>
                    </div>
                  )}

                  {txSuccess && (
                    <div className="p-3.5 rounded-xl border border-success/20 bg-success/10 text-success text-sm flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                      <div className="space-y-1 w-full overflow-hidden">
                        <p className="font-semibold">Transaction Broadcasted</p>
                        <p className="text-xs leading-relaxed text-success/80">
                          Transaction signed, validated, and broadcast successfully to local peers!
                        </p>
                        <div className="mt-2 p-2 rounded bg-success/20 border border-success/20 font-mono text-[10px] break-all">
                          <span className="font-semibold">TXID:</span> {txSuccess.transaction?.tx_id || txSuccess.transaction?.hash}
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-[0_0_15px_oklch(0.75_0.15_195/0.2)] font-semibold flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing & Broadcasting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Sign & Send Transaction
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Wallet Summary Cards */}
          <div className="space-y-6">
            <Card className="bg-card/30 border-border/40 backdrop-blur-md shadow-xl relative overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Spendable Payouts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-3xl font-extrabold text-foreground tracking-tight">
                    {(wallet?.balance ?? 0).toFixed(4)}
                  </div>
                  <p className="text-xs text-muted-foreground font-medium mt-1">LUNAR Available</p>
                </div>
                <div className="pt-3 border-t border-border/30 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Mined Rewards</span>
                  <span className="text-success font-bold">
                    {(wallet?.minedRewards ?? wallet?.totalReceived ?? 0).toFixed(4)} LUN
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/30 border-border/40 backdrop-blur-md shadow-xl">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Wallet Identity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-xs text-muted-foreground font-semibold">Local Address</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-foreground bg-input/20 px-2 py-1 rounded border border-border/30 select-all">
                      {wallet?.address}
                    </span>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0 border border-border/30" onClick={handleCopy}>
                      {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg border border-primary/10 bg-primary/5 text-[11px] text-muted-foreground/80 leading-normal">
                  💡 Derived cryptographically from standard SECP256R1 Elliptic Curve keys. Standard signature verification matches `SHA-256(pub_key)[:16].upper()`.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Recent Sent / Received Ledger */}
      {!loading && !offline && (
        <Card className="bg-card/20 border-border/30 backdrop-blur-md shadow-xl">
          <CardHeader className="pb-3 border-b border-border/20">
            <CardTitle className="text-md font-semibold">Your Recent Transfers</CardTitle>
            <CardDescription>
              Live activity of signed transaction outputs for your local identity
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loadingHistory ? (
              <div className="p-8 text-center text-muted-foreground text-sm flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" /> Loading transfers...
              </div>
            ) : recentSent.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No recent transactions found for your address.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-input/10">
                      <th className="p-3.5 pl-6">Hash / ID</th>
                      <th className="p-3.5">Direction</th>
                      <th className="p-3.5">Counterparty</th>
                      <th className="p-3.5 text-right">Amount</th>
                      <th className="p-3.5 pr-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/10 text-sm">
                    {recentSent.map((tx) => {
                      const isSent = wallet && tx.from.toLowerCase() === wallet.address.toLowerCase()
                      
                      return (
                        <tr key={tx.hash} className="hover:bg-accent/30 transition-colors">
                          <td className="p-3.5 pl-6 font-mono text-xs text-primary">
                            {truncateAddress(tx.hash, 8)}
                          </td>
                          <td className="p-3.5">
                            <span className={cn(
                              'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide border',
                              isSent 
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                                : 'bg-success/10 text-success border-success/20'
                            )}>
                              {isSent ? 'Sent' : 'Received'}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-xs text-muted-foreground">
                            {isSent ? truncateAddress(tx.to, 6) : truncateAddress(tx.from, 6)}
                          </td>
                          <td className={cn(
                            'p-3.5 text-right font-semibold',
                            isSent ? 'text-rose-400' : 'text-success'
                          )}>
                            {isSent ? '-' : '+'}{(tx.amount ?? 0).toFixed(4)} LUN
                          </td>
                          <td className="p-3.5 pr-6">
                            <span className={cn(
                              'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs border font-medium',
                              tx.status === 'pending'
                                ? 'bg-warning/10 text-warning border-warning/20'
                                : tx.status === 'confirmed'
                                ? 'bg-success/10 text-success border-success/20'
                                : 'bg-destructive/10 text-destructive border-destructive/20'
                            )}>
                              {tx.status === 'pending' && <Loader2 className="h-3 w-3 animate-spin shrink-0" />}
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
