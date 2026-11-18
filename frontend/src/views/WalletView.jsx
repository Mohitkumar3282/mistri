import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Loader2, Wallet, Landmark, Save, Plus, Banknote, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import api from '../services/api';
import OnlinePaymentModal from '../components/OnlinePaymentModal';

export default function WalletView() {
  const { navigateTo, addToast } = useStore();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingBank, setSavingBank] = useState(false);
  const [bankFormOpen, setBankFormOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [walletAction, setWalletAction] = useState('');
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(0);
  const [withdrawSubmitting, setWithdrawSubmitting] = useState(false);
  const [bankAccount, setBankAccount] = useState({ accountHolderName: '', accountNumber: '', ifscCode: '', bankName: '', accountType: 'Savings', upiId: '' });

  useEffect(() => {
    api.getWalletHistory()
      .then((response) => {
        setWallet(response.data);
        setBankAccount((current) => ({ ...current, ...(response.data.bankAccount || {}) }));
      })
      .catch((error) => addToast(error.message || 'Could not load wallet', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const updateBankField = (event) => setBankAccount((current) => ({ ...current, [event.target.name]: event.target.value }));
  const refreshWallet = async () => {
    const response = await api.getWalletHistory();
    setWallet(response.data);
    setBankAccount((current) => ({ ...current, ...(response.data.bankAccount || {}) }));
  };
  const saveBankAccount = async (event) => {
    event.preventDefault();
    setSavingBank(true);
    try {
      const response = await api.saveWalletBankAccount(bankAccount);
      setBankAccount((current) => ({ ...current, ...response.data }));
      addToast('Bank account details saved', 'success');
    } catch (error) {
      addToast(error.message || 'Could not save bank account details', 'error');
    } finally {
      setSavingBank(false);
    }
  };

  const startTopUp = () => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value < 10 || value > 50000 || Math.round(value * 100) !== value * 100) {
      addToast('Enter an amount from ₹10 to ₹50,000 (up to two decimal places)', 'error');
      return;
    }
    setTopUpAmount(value);
    setWalletAction('');
    setPaymentOpen(true);
  };

  const submitWithdrawal = async (event) => {
    event.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0 || Math.round(value * 100) !== value * 100) {
      addToast('Enter a valid withdrawal amount', 'error');
      return;
    }
    setWithdrawSubmitting(true);
    try {
      await api.requestWalletWithdrawal(value);
      await refreshWallet();
      setWalletAction('');
      setAmount('');
      addToast('Withdrawal requested. The request is pending review.', 'success');
    } catch (error) {
      addToast(error.message || 'Could not request withdrawal', 'error');
    } finally {
      setWithdrawSubmitting(false);
    }
  };

  const confirmTopUp = async (paymentDetails) => {
    try {
      const result = await api.verifyPayment({
        razorpay_order_id: paymentDetails.razorpayOrderId,
        razorpay_payment_id: paymentDetails.razorpayPaymentId,
        razorpay_signature: paymentDetails.razorpaySignature,
      });
      await refreshWallet();
      addToast(result.message || 'Wallet topped up successfully', 'success');
    } catch (error) {
      addToast(`${error.message || 'Payment verification failed'}. If you were charged, contact support with payment ID ${paymentDetails.razorpayPaymentId}.`, 'error');
    } finally {
      setPaymentOpen(false);
      setAmount('');
    }
  };

  const fieldStyle = { width: '100%', boxSizing: 'border-box', border: '1px solid #CBD5E1', borderRadius: 9, padding: '11px 12px', color: '#172033', fontSize: 14, background: '#fff' };
  const labelStyle = { display: 'grid', gap: 6, color: '#475569', fontSize: 13, fontWeight: 650 };

  return <main style={{ maxWidth: 760, margin: '0 auto', padding: '20px 16px 48px' }}>
    <button onClick={() => navigateTo('profile')} style={{ display: 'flex', alignItems: 'center', gap: 8, border: 0, background: 'none', color: '#64748B', padding: '8px 0 18px', cursor: 'pointer' }}><ArrowLeft size={18}/> My Profile</button>
    <h1 style={{ margin: '0 0 18px', color: '#172033', fontSize: 25 }}>My Wallet</h1>
    <section style={{ borderRadius: 18, padding: 22, color: 'white', background: 'linear-gradient(120deg,#0B2947,#145586)', boxShadow: '0 8px 24px rgba(11,41,71,.18)' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', opacity: .9 }}><Wallet size={20}/><span style={{ fontWeight: 700 }}>Available balance</span></div>
      {loading ? <div style={{ padding: '24px 0 6px' }}><Loader2 className="spin" size={24}/></div> : <div style={{ fontSize: 36, lineHeight: 1.2, fontWeight: 850, marginTop: 14 }}>₹{Number(wallet?.balance || 0).toLocaleString('en-IN')}</div>}
      <p style={{ margin: '10px 0 0', color: 'rgba(255,255,255,.8)', fontSize: 13 }}>Referral rewards are added after eligible orders are completed.</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
        <button onClick={() => { setAmount(''); setWalletAction('add'); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: 0, borderRadius: 9, padding: '10px 14px', color: '#12314D', background: '#fff', fontWeight: 750, cursor: 'pointer' }}><Plus size={16}/> Add money</button>
        <button onClick={() => { setAmount(''); setWalletAction('withdraw'); }} disabled={!wallet?.allowWithdrawals} title={!wallet?.allowWithdrawals ? 'Withdrawals are currently disabled' : ''} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1px solid rgba(255,255,255,.55)', borderRadius: 9, padding: '10px 14px', color: '#fff', background: 'rgba(255,255,255,.1)', fontWeight: 750, cursor: wallet?.allowWithdrawals ? 'pointer' : 'not-allowed', opacity: wallet?.allowWithdrawals ? 1 : .6 }}><Banknote size={16}/> Withdraw</button>
      </div>
      {!wallet?.allowWithdrawals && <div style={{ marginTop: 9, color: 'rgba(255,255,255,.75)', fontSize: 12 }}>Withdrawals are currently disabled.</div>}
    </section>
    <section style={{ background: '#fff', border: '1px solid #E6EBF2', borderRadius: 16, marginTop: 18, padding: 18 }}>
      <button type="button" onClick={() => setBankFormOpen((open) => !open)} aria-expanded={bankFormOpen} aria-controls="wallet-bank-form" style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', gap: 10, border: 0, padding: 0, background: 'transparent', color: '#172033', textAlign: 'left', cursor: 'pointer' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Landmark size={20} color="#17558A"/><span style={{ fontSize: 16, fontWeight: 750 }}>{bankFormOpen ? 'Bank account details' : 'Add bank details'}</span></span>
        {bankFormOpen ? <X size={18} color="#64748B"/> : <Plus size={18} color="#17558A"/>}
      </button>
      {bankFormOpen && <div id="wallet-bank-form" style={{ marginTop: 12 }}>
      <p style={{ color: '#64748B', fontSize: 13, lineHeight: 1.5, margin: '0 0 16px' }}>Save the bank account you want to use for wallet deposits or withdrawals. Never enter your banking PIN, password, or card security code.</p>
      <form onSubmit={saveBankAccount}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 13 }}>
          <label style={labelStyle}>Account holder name<input style={fieldStyle} name="accountHolderName" autoComplete="name" maxLength={100} value={bankAccount.accountHolderName} onChange={updateBankField} required /></label>
          <label style={labelStyle}>Bank name<input style={fieldStyle} name="bankName" autoComplete="organization" maxLength={100} value={bankAccount.bankName} onChange={updateBankField} required /></label>
          <label style={labelStyle}>Account number<input style={fieldStyle} name="accountNumber" inputMode="numeric" autoComplete="off" maxLength={18} value={bankAccount.accountNumber} onChange={updateBankField} required /></label>
          <label style={labelStyle}>IFSC code<input style={fieldStyle} name="ifscCode" autoCapitalize="characters" autoComplete="off" maxLength={11} value={bankAccount.ifscCode} onChange={updateBankField} required /></label>
          <label style={labelStyle}>Account type<select style={fieldStyle} name="accountType" value={bankAccount.accountType} onChange={updateBankField}><option value="Savings">Savings</option><option value="Current">Current</option></select></label>
          <label style={labelStyle}>UPI ID (optional)<input style={fieldStyle} name="upiId" autoComplete="off" value={bankAccount.upiId} onChange={updateBankField} placeholder="name@bank" /></label>
        </div>
        <button type="submit" disabled={savingBank || loading} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: 0, borderRadius: 9, marginTop: 16, padding: '11px 16px', color: '#fff', background: savingBank ? '#64748B' : '#17558A', fontWeight: 750, cursor: savingBank ? 'wait' : 'pointer' }}>
          {savingBank ? <Loader2 className="spin" size={16}/> : <Save size={16}/>} {savingBank ? 'Saving…' : 'Save bank details'}
        </button>
      </form>
      </div>}
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
    {walletAction && <div role="dialog" aria-modal="true" aria-label={walletAction === 'add' ? 'Add money to wallet' : 'Withdraw money from wallet'} style={{ position: 'fixed', inset: 0, zIndex: 1200, background: 'rgba(15,23,42,.55)', display: 'grid', placeItems: 'center', padding: 16 }}>
      <section style={{ width: 'min(100%, 430px)', background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 18px 50px rgba(15,23,42,.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}><h2 style={{ margin: 0, color: '#172033', fontSize: 20 }}>{walletAction === 'add' ? 'Add money to wallet' : 'Withdraw from wallet'}</h2><button type="button" onClick={() => setWalletAction('')} aria-label="Close" style={{ border: 0, background: 'transparent', cursor: 'pointer', color: '#64748B' }}><X size={20}/></button></div>
        <form onSubmit={walletAction === 'add' ? (event) => { event.preventDefault(); startTopUp(); } : submitWithdrawal}>
          <label style={{ ...labelStyle, marginTop: 18 }}>Amount (INR)<input style={{ ...fieldStyle, marginTop: 4 }} type="number" min={walletAction === 'add' ? 10 : 0.01} max={walletAction === 'add' ? 50000 : undefined} step="0.01" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} required /></label>
          {walletAction === 'add' ? <p style={{ margin: '10px 0 0', color: '#64748B', fontSize: 13 }}>Pay securely online. Your balance is updated after payment verification.</p> : <p style={{ margin: '10px 0 0', color: '#64748B', fontSize: 13 }}>Request goes to your saved bank account and stays pending until an administrator reviews it. Available balance: &#8377;{Number(wallet?.balance || 0).toLocaleString('en-IN')}.</p>}
          {walletAction === 'withdraw' && (!bankAccount.accountNumber || !bankAccount.ifscCode || !bankAccount.accountHolderName || !bankAccount.bankName) && <p style={{ color: '#B45309', fontSize: 13 }}>Add and save complete bank details first.</p>}
          <button type="submit" disabled={withdrawSubmitting || (walletAction === 'withdraw' && (!wallet?.allowWithdrawals || !bankAccount.accountNumber))} style={{ width: '100%', marginTop: 16, border: 0, borderRadius: 9, padding: '12px 16px', color: '#fff', background: '#17558A', fontWeight: 750, cursor: 'pointer' }}>{walletAction === 'add' ? 'Continue to payment' : withdrawSubmitting ? 'Submitting…' : 'Request withdrawal'}</button>
        </form>
      </section>
    </div>}
    <OnlinePaymentModal isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} amount={topUpAmount} customer={{}} walletTopUp onPaymentSuccess={confirmTopUp} onPaymentError={(message) => addToast(message || 'Payment failed', 'error')} />
  </main>;
}
