function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Configuration
    const adminEmail = "info@mablehair.co.za";
    const brandName = "Mable Hair Care";

    if (data.type === 'order') {
      return handleOrder(data, adminEmail, brandName);
    } else if (data.type === 'contact') {
      return handleContact(data, adminEmail, brandName);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Unknown type received" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleOrder(data, adminEmail, brandName) {
  // Format Product List for Email
  let productListHtml = "";
  data.products.forEach(p => {
    productListHtml += `<li>${p.name} (x${p.quantity}) - R${p.price.toFixed(2)}</li>`;
  });

  const orderSummaryHtml = `
    <p><strong>Subtotal:</strong> R${data.subtotal.toFixed(2)}</p>
    <p><strong>Delivery Fee:</strong> R${data.deliveryFee.toFixed(2)}</p>
    <p><strong>TOTAL:</strong> R${data.total.toFixed(2)}</p>
  `;

  // --- Admin Email ---
  const adminSubject = `New ${brandName} Order - ${data.orderNumber}`;
  const adminBody = `
    <h2>MABLE HAIR CARE - NEW ORDER</h2>
    <p><strong>Order Number:</strong> ${data.orderNumber}</p>
    
    <h3>Customer Details</h3>
    <p>
      Name: ${data.customer.name}<br>
      Phone: ${data.customer.phone}<br>
      Email: <a href="mailto:${data.customer.email}">${data.customer.email}</a><br>
      Address: ${data.customer.address}
    </p>

    <h3>Products</h3>
    <ul>${productListHtml}</ul>
    
    ${orderSummaryHtml}
    
    <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
    <p><strong>Status:</strong> ${data.status}</p>
  `;

  MailApp.sendEmail({
    to: adminEmail,
    subject: adminSubject,
    htmlBody: adminBody
  });

  // --- Customer Email ---
  const customerSubject = `${brandName} Order Confirmation - ${data.orderNumber}`;
  const customerBody = `
    <h2>Thank you for your order!</h2>
    <p>Your order number is <strong>${data.orderNumber}</strong>.</p>
    <p>We have recorded your order and are awaiting your EFT payment.</p>
    
    <h3>Order Summary</h3>
    <ul>${productListHtml}</ul>
    ${orderSummaryHtml}

    <h3>EFT Payment Instructions</h3>
    <p>Please transfer the total amount using the following details. <br>
    <strong>IMPORTANT: Use your Order Number (${data.orderNumber}) as the payment reference.</strong></p>
    <p>
      Bank Name: [Your Bank]<br>
      Account Holder: Mable Hair Care<br>
      Account Number: [Your Account Number]<br>
      Branch Code: [Your Branch Code]
    </p>
    
    <p>If you have any questions, please WhatsApp us at 072 772 3653 or reply to this email.</p>
    <p>Warm regards,<br>The ${brandName} Team</p>
  `;

  MailApp.sendEmail({
    to: data.customer.email,
    subject: customerSubject,
    htmlBody: customerBody
  });

  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleContact(data, adminEmail, brandName) {
  // --- Admin Email ---
  const adminSubject = `New Contact Form Message: ${data.subject}`;
  const adminBody = `
    <h2>New Message from ${data.name}</h2>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Subject:</strong> ${data.subject}</p>
    <p><strong>Message:</strong></p>
    <p>${data.message}</p>
  `;

  MailApp.sendEmail({
    to: adminEmail,
    subject: adminSubject,
    htmlBody: adminBody
  });

  // --- Customer Auto-Reply ---
  const customerSubject = `We have received your message - ${brandName}`;
  const customerBody = `
    <p>Dear ${data.name},</p>
    <p>Thank you for contacting ${brandName}. We have received your message and will get back to you as soon as possible.</p>
    <p>For urgent inquiries, you can also reach us via WhatsApp at 072 772 3653.</p>
    <p>Warm regards,<br>The ${brandName} Team</p>
  `;

  MailApp.sendEmail({
    to: data.email,
    subject: customerSubject,
    htmlBody: customerBody
  });

  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
