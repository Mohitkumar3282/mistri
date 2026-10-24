import mistriLogoImg from '../assets/mistri-logo.png';

/**
 * MISTRI – Professional Single-Page Tax Invoice & Delivery Challan Generator
 * Generates an isolated, pixel-perfect A4 printable Invoice.
 */

// Number to Words converter for Indian Rupee currency
function amountInWords(num) {
  const a = [
    '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ',
    'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = Math.floor(Number(num) || 0);
  if (n === 0) return 'Zero Rupees Only';

  const inWords = (n) => {
    if (n < 20) return a[n];
    const digit = n % 10;
    if (n < 100) return b[Math.floor(n / 10)] + (digit ? '-' + a[digit] : ' ');
    if (n < 1000) return a[Math.floor(n / 100)] + 'Hundred ' + (n % 100 === 0 ? '' : 'and ' + inWords(n % 100));
    if (n < 100000) return inWords(Math.floor(n / 1000)) + 'Thousand ' + (n % 1000 !== 0 ? inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + 'Lakh ' + (n % 100000 !== 0 ? inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + 'Crore ' + (n % 10000000 !== 0 ? inWords(n % 10000000) : '');
  };

  return inWords(n).trim() + ' Rupees Only';
}

export function printTaxInvoice(order, siteSettings = {}) {
  if (!order) return;

  const orderId = order.orderNumber || order.id || 'MST-894182';
  const orderDate = order.date || (order.createdAt ? order.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]);
  const orderTime = order.time || '10:30 AM';
  const customerName = order.customerName || order.siteAddress?.recipientName || 'Valued Customer';
  const customerPhone = order.customerPhone || order.siteAddress?.phone || '+91 98260 11223';
  const siteAddress = order.siteAddress || {};
  const fullAddress = [
    siteAddress.addressLine,
    siteAddress.landmark,
    siteAddress.city || 'Indore',
    siteAddress.state || 'Madhya Pradesh',
    siteAddress.pincode ? `PIN: ${siteAddress.pincode}` : '',
  ].filter(Boolean).join(', ') || 'Super Corridor Construction Site, Indore, MP - 452005';

  const paymentMethod = order.payment?.method || order.paymentMethod || 'Cash on Delivery (Pay on Site)';
  const paymentStatus = order.payment?.status || order.paymentStatus || 'Pending (Pay on Site)';
  const grandTotal = Number(order.grandTotal || order.total || order.summary?.totalAmount || 0);

  const items = Array.isArray(order.items) && order.items.length > 0 ? order.items : [];

  // Generate Table Rows
  const itemsRows = items.map((it, idx) => {
    const rawQty = it.quantity || 1;
    const qty = typeof rawQty === 'number' ? rawQty : parseInt(rawQty, 10) || 1;
    const rawUnit = it.product?.unit || it.unit || '';
    const unit = (!rawUnit || !isNaN(rawUnit) || rawUnit === '1' || rawUnit === 'Units') ? '' : rawUnit;
    const itemName = it.product?.name || it.name || 'Construction Material';
    const price = Number(it.price || it.product?.price || 0);
    const lineTotal = Number(it.lineTotal || (price * qty));
    const hsn = it.product?.hsn || it.hsn || '6810';

    return `
      <tr>
        <td style="padding: 9px 13px; border-bottom: 1px solid #E2E8F0; text-align: center; color: #64748B; font-size: 14px;">${idx + 1}</td>
        <td style="padding: 9px 13px; border-bottom: 1px solid #E2E8F0; font-size: 14.5px; font-weight: 600; color: #0F172A;">
          ${itemName}
        </td>
        <td style="padding: 9px 13px; border-bottom: 1px solid #E2E8F0; text-align: center; color: #64748B; font-size: 14px; font-family: monospace;">${hsn}</td>
        <td style="padding: 9px 13px; border-bottom: 1px solid #E2E8F0; text-align: center; font-size: 14.5px; font-weight: 700; color: #0F172A;">
          ${qty}${unit ? ' ' + unit : ''}
        </td>
        <td style="padding: 9px 13px; border-bottom: 1px solid #E2E8F0; text-align: right; font-size: 14px; color: #334155;">₹${price.toLocaleString('en-IN')}</td>
        <td style="padding: 9px 13px; border-bottom: 1px solid #E2E8F0; text-align: right; font-size: 14.5px; font-weight: 700; color: #08274C;">₹${lineTotal.toLocaleString('en-IN')}</td>
      </tr>
    `;
  }).join('');

  // Summary figures
  const subtotal = order.summary?.subtotal || items.reduce((acc, it) => acc + ((Number(it.price) || 0) * (Number(it.quantity) || 1)), 0) || grandTotal;
  const unloadingCharge = Number(order.summary?.unloadingCharge || 0);
  const deliveryCharge = Number(order.summary?.deliveryCharge || order.summary?.deliveryFee || 0);
  const discount = Number(order.summary?.bulkDiscount || order.summary?.discount || 0);
  const cashbackAmount = Number(order.summary?.cashbackAmount || 0);
  const gstAmount = Number(order.summary?.gstAmount || 0);

  const invoiceHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tax Invoice - ${orderId}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm 10mm 12mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    body {
      background-color: #FFFFFF;
      color: #0F172A;
      font-size: 15px;
      line-height: 1.4;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .invoice-wrapper {
      max-width: 100%;
      margin: 0 auto;
      border: 2px solid #08274C;
      padding: 22px 26px;
      background: #FFFFFF;
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      border-bottom: 2.5px solid #08274C;
      padding-bottom: 14px;
      margin-bottom: 16px;
    }
    .badge-invoice {
      display: inline-block;
      background-color: #08274C;
      color: #FFFFFF;
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 0.1em;
      padding: 6px 14px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .meta-box {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      border: 1px solid #CBD5E1;
      border-radius: 6px;
      overflow: hidden;
    }
    .meta-box td {
      padding: 11px 16px;
      vertical-align: top;
      border-right: 1px solid #CBD5E1;
    }
    .meta-box td:last-child {
      border-right: none;
    }
    .label {
      font-size: 12px;
      font-weight: 700;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 3px;
    }
    .value {
      font-size: 15px;
      font-weight: 700;
      color: #0F172A;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      border: 1px solid #CBD5E1;
    }
    .items-table th {
      background-color: #F1F5F9;
      color: #08274C;
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 10px 13px;
      border-bottom: 1.5px solid #CBD5E1;
    }
    .totals-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }
    .totals-table td {
      padding: 6px 10px;
    }
    .amount-words-box {
      background-color: #F8FAFC;
      border: 1px dashed #CBD5E1;
      padding: 11px 16px;
      border-radius: 4px;
      font-size: 14px;
      margin-bottom: 16px;
    }
    .signatures-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 18px;
    }
    .sig-box {
      border: 1px solid #CBD5E1;
      border-radius: 6px;
      height: 95px;
      padding: 8px 13px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .footer-note {
      font-size: 11px;
      color: #64748B;
      text-align: center;
      margin-top: 13px;
      border-top: 1px solid #E2E8F0;
      padding-top: 8px;
    }
  </style>
</head>
<body>
  <div class="invoice-wrapper">
    <!-- Header with Exact Home Page Logo and Company Info -->
    <table class="header-table">
      <tr>
        <td style="width: 58%; vertical-align: middle;">
          <!-- EXACT BRAND LOGO IMAGE -->
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <img src="${mistriLogoImg || '/mistri-logo.png'}" alt="MISTRI - From Foundation to Finish" style="width: 220px; height: 63px; object-fit: contain; display: block;" />
          </div>
          <div style="font-size: 13px; color: #475569; line-height: 1.35; margin-top: 5px;">
            <strong>MISTRI INFRA & CONSTRUCTION MATERIALS PVT. LTD.</strong><br/>
            Support: ${siteSettings.supportPhone || '+91 98260 11223'}
          </div>
        </td>
        <td style="width: 42%; text-align: right; vertical-align: top;">
          <div class="badge-invoice">TAX INVOICE & CHALLAN</div>
          <div style="font-size: 18px; font-weight: 800; color: #08274C; margin-top: 8px;">
            ${orderId}
          </div>
          <div style="font-size: 13px; color: #475569; margin-top: 3px;">
            Invoice Date: <strong>${orderDate}</strong><br/>
            Time: <strong>${orderTime}</strong>
          </div>
        </td>
      </tr>
    </table>

    <!-- Buyer & Payment Details Grid -->
    <table class="meta-box">
      <tr>
        <td style="width: 62%;">
          <div class="label">Billed To / Delivery Destination:</div>
          <div class="value" style="font-size: 15.5px;">${customerName}</div>
          <div style="font-size: 14px; color: #334155; margin-top: 3px;">Phone: <strong>${customerPhone}</strong></div>
          <div style="font-size: 13px; color: #475569; margin-top: 4px; line-height: 1.3;">
            ${fullAddress}
          </div>
        </td>
        <td style="width: 38%;">
          <div class="label">Payment & Delivery:</div>
          <div style="margin-bottom: 5px;">
            <div style="font-size: 13px; color: #64748B;">Mode: <strong style="color: #0F172A;">${paymentMethod}</strong></div>
            <div style="font-size: 13px; color: ${paymentStatus.toLowerCase().includes('paid') ? '#059669' : '#D97706'}; font-weight: 700; margin-top: 2px;">
              Status: ${paymentStatus}
            </div>
          </div>
          <div style="border-top: 1px dashed #E2E8F0; padding-top: 5px; margin-top: 5px;">
            <div style="font-size: 13px; color: #64748B;">Delivery Slot:</div>
            <div class="value" style="font-size: 14px; color: #08274C;">Express Site Delivery</div>
          </div>
        </td>
      </tr>
    </table>

    <!-- Material Line Items Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 6%; text-align: center; padding: 10px 6px;">#</th>
          <th style="width: 48%; text-align: left; padding: 10px 13px;">Material Description & Specifications</th>
          <th style="width: 12%; text-align: center; padding: 10px 13px;">HSN Code</th>
          <th style="width: 10%; text-align: center; padding: 10px 13px;">Qty</th>
          <th style="width: 12%; text-align: right; padding: 10px 13px;">Rate (₹)</th>
          <th style="width: 12%; text-align: right; padding: 10px 13px;">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <!-- Amount Breakdown & Summary -->
    <table class="totals-table">
      <tr>
        <td style="width: 55%; vertical-align: top; padding-right: 15px;">
          <div class="amount-words-box">
            <span style="font-weight: 700; color: #475569; font-size: 12px; text-transform: uppercase;">Amount in Words:</span><br/>
            <strong style="color: #08274C; font-size: 14px;">${amountInWords(grandTotal)}</strong>
          </div>
          <div style="font-size: 12px; color: #64748B; line-height: 1.4;">
            • 100% Genuine Certified Quality Material direct to site.<br/>
            • Official Material Receipt & Verified Delivery Challan.
          </div>
        </td>
        <td style="width: 45%; vertical-align: top;">
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr>
              <td style="padding: 5px 0; color: #475569;">Materials Subtotal:</td>
              <td style="padding: 5px 0; text-align: right; font-weight: 600;">₹${subtotal.toLocaleString('en-IN')}</td>
            </tr>
            ${unloadingCharge > 0 ? `
            <tr>
              <td style="padding: 5px 0; color: #475569;">Site Unloading & Crane Handling:</td>
              <td style="padding: 5px 0; text-align: right; font-weight: 600;">₹${unloadingCharge.toLocaleString('en-IN')}</td>
            </tr>` : ''}
            ${deliveryCharge > 0 ? `
            <tr>
              <td style="padding: 5px 0; color: #475569;">Site Delivery & Freight:</td>
              <td style="padding: 5px 0; text-align: right; font-weight: 600;">₹${deliveryCharge.toLocaleString('en-IN')}</td>
            </tr>` : `
            <tr>
              <td style="padding: 5px 0; color: #475569;">Site Delivery & Freight:</td>
              <td style="padding: 5px 0; text-align: right; font-weight: 700; color: #059669;">FREE</td>
            </tr>`}
            ${discount > 0 ? `
            <tr>
              <td style="padding: 5px 0; color: #059669;">Bulk / Coupon Discount:</td>
              <td style="padding: 5px 0; text-align: right; font-weight: 700; color: #059669;">-₹${discount.toLocaleString('en-IN')}</td>
            </tr>` : ''}
            ${cashbackAmount > 0 ? `
            <tr>
              <td style="padding: 5px 0; color: #059669;">Assured Cashback:</td>
              <td style="padding: 5px 0; text-align: right; font-weight: 700; color: #059669;">-₹${cashbackAmount.toLocaleString('en-IN')}</td>
            </tr>` : ''}
            ${gstAmount > 0 ? `
            <tr>
              <td style="padding: 5px 0; color: #475569;">Estimated Taxes (Included):</td>
              <td style="padding: 5px 0; text-align: right; font-weight: 600;">₹${gstAmount.toLocaleString('en-IN')}</td>
            </tr>` : ''}
            <tr style="border-top: 1.5px solid #08274C; border-bottom: 1.5px solid #08274C;">
              <td style="padding: 8px 0; font-size: 16px; font-weight: 800; color: #08274C;">Grand Total (INR):</td>
              <td style="padding: 8px 0; text-align: right; font-size: 19px; font-weight: 900; color: #08274C;">₹${grandTotal.toLocaleString('en-IN')}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Signature Boxes -->
    <table class="signatures-table">
      <tr>
        <td style="width: 50%; padding-right: 10px;">
          <div class="sig-box">
            <div style="font-size: 12px; color: #64748B; font-weight: 700; text-transform: uppercase;">Customer / Site Receiver Acknowledgment</div>
            <div style="font-size: 13px; color: #94A3B8; border-top: 1px dashed #CBD5E1; padding-top: 5px;">
              Signature & Date (Received in Good Condition)
            </div>
          </div>
        </td>
        <td style="width: 50%; padding-left: 10px;">
          <div class="sig-box" style="text-align: right;">
            <div style="font-size: 12px; color: #64748B; font-weight: 700; text-transform: uppercase;">For MISTRI Infra & Materials Pvt. Ltd.</div>
            <div style="font-size: 13px; color: #08274C; font-weight: 700; border-top: 1px dashed #CBD5E1; padding-top: 5px;">
              Authorized Signatory
            </div>
          </div>
        </td>
      </tr>
    </table>

    <div class="footer-note">
      This is a digitally generated Invoice & Delivery Challan issued by MISTRI Construction Materials System.
    </div>
  </div>
</body>
</html>
  `;

  // Print via a real new window/tab, not a hidden iframe: most mobile browsers don't
  // scope iframe.contentWindow.print() to just the iframe's content the way desktop
  // browsers do, and instead print the whole underlying page (header, nav, everything).
  // A genuine new window has no such scoping ambiguity on any platform.
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 350);
    return;
  }

  // Fallback if a popup blocker prevented the new window (e.g. not triggered directly
  // by a click): the hidden-iframe approach, which at least works on desktop browsers.
  let printFrame = document.getElementById('mistri-invoice-print-frame');
  if (!printFrame) {
    printFrame = document.createElement('iframe');
    printFrame.id = 'mistri-invoice-print-frame';
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);
  }

  const frameDoc = printFrame.contentWindow || printFrame.contentDocument.document || printFrame.contentDocument;
  frameDoc.document.open();
  frameDoc.document.write(invoiceHtml);
  frameDoc.document.close();

  setTimeout(() => {
    printFrame.contentWindow.focus();
    printFrame.contentWindow.print();
  }, 350);
}

export default printTaxInvoice;
