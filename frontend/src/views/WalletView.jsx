import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Loader2, Wallet } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import api from '../services/api';

export default function WalletView() {
  const { navigateTo, addToast } = useStore();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getWalletHistory()
      .then((response) => setWallet(response.data))
      .catch((error) => addToast(error.message || 'Could not load wallet', 'error'))
      .finally(() => setLoading(false));
  }, []);

  return <main style={{ maxWidth: 760, margin: '0 auto', padding: '20px 16px 48px' }}>
    <button onClick={() => navigateTo('profile')} style={{ display: 'flex', alignItems: 'center', gap: 8, border: 0, background: 'none', color: '#64748B', padding: '8px 0 18px', cursor: 'pointer' }}><ArrowLeft size={18}/> My Profile</button>
    <h1 style={{ margin: '0 0 18px', color: '#172033', fontSize: 25 }}>My Wallet</h1>
    <section style={{ borderRadius: 18, padding: 22, color: 'white', background: 'linear-gradient(120deg,#0B2947,#145586)', boxShadow: '0 8px 24px rgba(11,41,71,.18)' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', opacity: .9 }}><Wallet size={20}/><span style={{ fontWeight: 700 }}>Available balance</span></div>
      {loading ? <div style={{ padding: '24px 0 6px' }}><Loader2 className="spin" size={24}/></div> : <div style={{ fontSize: 36, lineHeight: 1.2, fontWeight: 850, marginTop: 14 }}>₹{Number(wallet?.balance || 0).toLocaleString('en-IN')}</div>}
      <p style={{ margin: '10px 0 0', color: 'rgba(255,255,255,.8)', fontSize: 13 }}>Referral rewards are added after eligible orders are completed.</p>
    </section>
    <section style={{ background: '#fff', border: '1px solid #E6EBF2', borderRadius: 16, marginTop: 18, padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}><h2 style={{ margin: 0, fontSize: 18, color: '#172033' }}>Wallet history</h2><button onClick={() => navigateTo('referrals')} style={{ border: 0, borderRadius: 8, background: '#EFF6FF', color: '#17558A', padding: '8px 11px', fontWeight: 700, cursor: 'pointer' }}>Refer & Earn</button></div>
      {loading ? <div style={{ padding: 28, textAlign: 'center', color: '#64748B' }}>Loading transactions…</div> : wallet?.transactions?.length ? <div>{wallet.transactions.map((transaction) => {
        const incoming = Number(transaction.amount) >= 0;
        return <article key={transaction.transactionId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 0', borderBottom: '1px solid #EEF2F6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}><span style={{ width: 38, height: 38, flex: '0 0 38px', borderRadius: 12, background: incoming ? '#ECFDF3' : '#FFF7ED', color: incoming ? '#15803D' : '#C2410C', display: 'grid', placeItems: 'center' }}>{incoming ? <ArrowDownLeft size={18}/> : <ArrowUpRight size={18}/>}</span><div style={{ minWidth: 0 }}><div style={{ fontWeight: 700, color: '#172033', fontSize: 14 }}>{transaction.description || (transaction.type === 'referral_reward' ? 'Referral reward' : transaction.type === 'reversal' ? 'Reward reversal' : 'Wallet purchase')}</div><div style={{ color: '#718096', fontSize: 12, marginTop: 4, overflowWrap: 'anywhere' }}>{transaction.transactionId} · {new Date(transaction.createdAt).toLocaleDateString()}</div></div></div>
          <div style={{ flex: '0 0 auto', textAlign: 'right' }}><strong style={{ color: incoming ? '#15803D' : '#C2410C' }}>{incoming ? '+' : '−'}₹{Math.abs(Number(transaction.amount || 0)).toLocaleString('en-IN')}</strong><div style={{ color: '#718096', fontSize: 11, marginTop: 3 }}>{transaction.status}</div></div>
        </article>;
      })}</div> : <div style={{ padding: '34px 12px', textAlign: 'center', color: '#718096' }}><Wallet size={28} color="#94A3B8"/><p style={{ marginBottom: 0 }}>Your wallet transactions will appear here.</p></div>}
    </section>
  </main>;
}
