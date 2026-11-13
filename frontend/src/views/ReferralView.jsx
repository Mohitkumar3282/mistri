import React, { useEffect, useState } from 'react';
import { Copy, Gift, Share2, Users, Wallet, Loader2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import api from '../services/api';

export default function ReferralView() {
  const { addToast } = useStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.getReferralSummary().then((r) => setData(r.data)).catch((e) => addToast(e.message, 'error')).finally(() => setLoading(false)); }, []);
  const copy = async (value, label) => { try { await navigator.clipboard.writeText(value); addToast(`${label} copied`, 'success'); } catch { addToast('Could not access clipboard', 'error'); } };
  const share = async () => {
    if (navigator.share) await navigator.share({ title: 'Join me on Mistri', text: 'Sign up with my referral link and earn wallet rewards.', url: data.link });
    else window.open(`https://wa.me/?text=${encodeURIComponent(`Join me on Mistri: ${data.link}`)}`, '_blank', 'noopener,noreferrer');
  };
  const referrals = data?.referrals || [];
  const earned = (data?.ledger || []).filter((x) => x.status === 'Credited').reduce((n, x) => n + Number(x.amount || 0), 0);
  const stats = [['People referred', referrals.length, Users], ['Successful', referrals.filter((x) => x.status === 'Credited').length, Gift], ['Pending', referrals.filter((x) => ['Pending', 'Eligible'].includes(x.status)).length, Share2], ['Wallet balance', `₹${Number(data?.walletBalance || 0).toLocaleString('en-IN')}`, Wallet]];
  return <div className="referral-page" style={{ maxWidth: 1120, margin: '0 auto', padding: '28px 18px 56px' }}>
    {loading ? <div style={{ padding: 80, textAlign: 'center', color: '#64748B' }}><Loader2 className="spin"/> Loading your referral details…</div> : !data ? <p>Referral information could not be loaded.</p> : <>
      <section className="referral-share-card">
        <div className="referral-card-heading"><span className="referral-heading-icon"><Gift size={17}/></span><div><strong>Invite friends, earn rewards</strong><small>Share your code and grow your Mistri wallet</small></div></div>
        <div className="referral-code-row"><div><span className="referral-eyebrow">YOUR REFERRAL CODE</span><strong className="referral-code-value">{data.code || '—'}</strong></div><button className="referral-copy-code" onClick={() => copy(data.code, 'Referral code')}><Copy size={15}/> Copy code</button></div>
        <div className="referral-link-label">Your personal invite link</div><div className="referral-link-value">{data.link}</div>
        <div className="referral-share-actions"><button className="referral-copy-link" onClick={() => copy(data.link, 'Referral link')}><Copy size={16}/> Copy link</button><button className="referral-share-button" onClick={share} disabled={!data.config?.enabled}><Share2 size={16}/> Share invite</button></div>
        {!data.config?.enabled && <div className="referral-paused-note">The referral program is temporarily paused.</div>}
      </section>
      <div className="referral-section-heading"><div><h2>Referral overview</h2><p>Your referral progress and wallet at a glance.</p></div><span className="referral-limit-pill">{data.remainingLimit === null ? 'Unlimited invites' : `${data.remainingLimit} invites left`}</span></div>
      <section className="referral-stats">{stats.map(([label, value, Icon], index) => <div className={`referral-stat referral-stat-${index}`} key={label}><span className="referral-stat-icon"><Icon size={19}/></span><div className="referral-stat-label">{label}</div><strong>{value}</strong></div>)}</section>
      <section style={{ ...cardStyle, marginTop: 16 }}><div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}><div><h2 style={{ margin: 0, fontSize: 19 }}>Referral history</h2><p style={{ color: '#64748B', fontSize: 13 }}>Rewards are added after the referred customer meets the order requirement.</p></div><div style={{ color: '#64748B', fontSize: 13 }}>Limit used: {data.usedLimit} · {data.remainingLimit === null ? 'Unlimited remaining' : `${data.remainingLimit} remaining`}</div></div>
        {data.ownReferral && <div style={{ padding: '10px 12px', margin: '8px 0 12px', borderRadius: 9, background: '#FFF7ED', color: '#7C3E0B', fontSize: 13 }}>You joined using code <b>{data.ownReferral.referralCode}</b> · Status: <b>{data.ownReferral.status}</b> · Your reward: ₹{Number(data.ownReferral.referredReward || data.config?.referredReward || 0).toLocaleString('en-IN')}</div>}
        {referrals.length ? <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 620 }}><thead><tr>{['Referral code','Customer','Joined','Status','Your reward'].map((x)=><th key={x} style={thStyle}>{x}</th>)}</tr></thead><tbody>{referrals.map((r)=><tr key={r._id}><td style={tdStyle}>{r.referralCode}</td><td style={tdStyle}>Customer</td><td style={tdStyle}>{new Date(r.createdAt).toLocaleDateString()}</td><td style={tdStyle}><span style={{ background: r.status === 'Credited' ? '#DCFCE7' : '#FEF3C7', borderRadius: 20, padding: '4px 9px', fontSize: 12 }}>{r.status}</span></td><td style={tdStyle}>₹{Number(r.referrerReward || data.config?.referrerReward || 0).toLocaleString('en-IN')}</td></tr>)}</tbody></table></div> : <div style={{ textAlign: 'center', padding: '34px 12px', color: '#64748B' }}><Gift size={28} color="#E88916"/><p>No referrals yet. Share your link to invite someone.</p></div>}
        <div style={{ borderTop: '1px solid #E2E8F0', marginTop: 14, paddingTop: 14, color: '#64748B', fontSize: 13 }}>Total referral earnings: <b style={{ color: '#0F172A' }}>₹{earned.toLocaleString('en-IN')}</b> · {data.config?.useForPurchases ? 'Wallet rewards can be used toward purchases.' : 'Wallet rewards are not currently usable for purchases.'}{data.config?.allowWithdrawals ? ' Withdrawals are enabled.' : ''}</div>
      </section>
      <section style={{ ...cardStyle, marginTop: 16 }}><h2 style={{ margin: '0 0 14px', fontSize: 19 }}>Referral wallet transactions</h2>{data.ledger?.length ? <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}><thead><tr>{['Transaction ID','Date','Order','Amount','Status'].map((x)=><th key={x} style={thStyle}>{x}</th>)}</tr></thead><tbody>{data.ledger.map((t)=><tr key={t.transactionId}><td style={tdStyle}>{t.transactionId}</td><td style={tdStyle}>{new Date(t.createdAt).toLocaleDateString()}</td><td style={tdStyle}>{t.orderId || '—'}</td><td style={{ ...tdStyle, color: Number(t.amount) < 0 ? '#B91C1C' : '#15803D' }}>{Number(t.amount) < 0 ? '−' : '+'}₹{Math.abs(Number(t.amount || 0)).toLocaleString('en-IN')}</td><td style={tdStyle}>{t.status}</td></tr>)}</tbody></table></div> : <p style={{ color: '#64748B' }}>Referral rewards will appear here after qualification.</p>}</section>
    </>}
  </div>;
}
const cardStyle = { background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16, padding: 20, boxShadow: '0 4px 16px rgba(15,23,42,.04)' };
const buttonStyle = { background: '#0B2947', color: 'white', border: 0, borderRadius: 9, padding: '10px 14px', display: 'inline-flex', gap: 8, alignItems: 'center', fontWeight: 700, cursor: 'pointer' };
const secondaryStyle = { ...buttonStyle, color: '#0B2947', background: 'white', border: '1px solid #CBD5E1' };
const thStyle = { textAlign: 'left', fontSize: 12, color: '#64748B', padding: '12px 8px', borderBottom: '1px solid #E2E8F0' };
const tdStyle = { padding: '13px 8px', borderBottom: '1px solid #F1F5F9', fontSize: 14 };
