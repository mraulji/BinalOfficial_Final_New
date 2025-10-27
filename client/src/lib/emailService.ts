import emailjs from '@emailjs/browser';

// EmailJS Configuration
export const EMAIL_CONFIG = {
  // Replace these with your actual EmailJS credentials
  SERVICE_ID: 'service_zff4g6c', // Gmail, Outlook, etc.
  TEMPLATE_ID_CONTACT: 'template_kpl9w36', // Contact form template
  TEMPLATE_ID_BUDGET: 'template_kpl9w36', // Budget request template (using same for now)
  PUBLIC_KEY: 'lJ8rkJpLdwI4ZScnt', // Your EmailJS public key
  
  // Your email address to receive notifications
  TO_EMAIL: 'mraulji2001@gmail.com',
  
  // Enable/disable email sending
  ENABLED: true, // Now enabled with correct template ID
};

// Initialize EmailJS
export const initEmailJS = () => {
  emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
};

// Send contact form email
export const sendContactEmail = async (formData: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) => {
  // Check if email is enabled
  if (!EMAIL_CONFIG.ENABLED) {
    console.log('Email disabled - Contact form data:', formData);
    return Promise.resolve({ status: 200, text: 'Email disabled for setup' });
  }

  const templateParams = {
    from_name: formData.name,
    from_email: formData.email,
    phone: formData.phone || 'Not provided',
    message: formData.message,
    
    // Additional comprehensive information
    subject: `New Contact Message from ${formData.name}`,
    full_message: `
CONTACT INFORMATION:
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}

MESSAGE:
${formData.message}

---
This message was sent from the Binal Studio Photography website contact form.
Reply directly to this email to respond to the customer.
    `.trim(),
  };

  return emailjs.send(
    EMAIL_CONFIG.SERVICE_ID,
    EMAIL_CONFIG.TEMPLATE_ID_CONTACT,
    templateParams,
    EMAIL_CONFIG.PUBLIC_KEY
  );
};

// Send budget request email
export const sendBudgetEmail = async (budgetData: {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  services: Array<{
    serviceName: string;
    quantity: number;
    totalPrice: number;
  }>;
  totalAmount: number;
  additionalNotes: string;
}) => {
  // Check if email is enabled
  if (!EMAIL_CONFIG.ENABLED) {
    console.log('Email disabled - Budget request data:', budgetData);
    return Promise.resolve({ status: 200, text: 'Email disabled for setup' });
  }

  const servicesList = budgetData.services
    .map((service) => `${service.serviceName} x${service.quantity} - ₹${service.totalPrice.toLocaleString()}`)
    .join('\n');

  const templateParams = {
    from_name: budgetData.name,
    from_email: budgetData.email,
    phone: budgetData.phone || 'Not provided',
    event_date: budgetData.eventDate || 'Not specified',
    total_amount: `₹${budgetData.totalAmount.toLocaleString()}`,
    
    // Comprehensive information
    subject: `Budget Request from ${budgetData.name} - ₹${budgetData.totalAmount.toLocaleString()}`,
    services_list: servicesList,
    message: budgetData.additionalNotes || 'No additional notes provided',
    
    full_message: `
CUSTOMER INFORMATION:
Name: ${budgetData.name}
Email: ${budgetData.email}
Phone: ${budgetData.phone || 'Not provided'}
Event Date: ${budgetData.eventDate || 'Not specified'}

SELECTED SERVICES:
${servicesList}

TOTAL AMOUNT: ₹${budgetData.totalAmount.toLocaleString()}

ADDITIONAL NOTES:
${budgetData.additionalNotes || 'No additional notes provided'}

---
This budget request was submitted through the Binal Studio Photography website.
Reply directly to this email to respond to the customer.
    `.trim(),
  };

  return emailjs.send(
    EMAIL_CONFIG.SERVICE_ID,
    EMAIL_CONFIG.TEMPLATE_ID_BUDGET,
    templateParams,
    EMAIL_CONFIG.PUBLIC_KEY
  );
};

// Instructions for setup (will be displayed in console)
export const displayEmailSetupInstructions = () => {
  console.log(`
📧 EMAIL SETUP INSTRUCTIONS:

1. Go to https://www.emailjs.com and create a free account

2. Create an Email Service:
   - Go to Email Services
   - Add service (Gmail, Outlook, etc.)
   - Note the Service ID

3. Create Email Templates:
   
   CONTACT FORM TEMPLATE:
   Subject: New Contact Message from {{from_name}}
   Content:
   Name: {{from_name}}
   Email: {{from_email}}
   Phone: {{phone}}
   
   Message:
   {{message}}
   
   BUDGET REQUEST TEMPLATE:
   Subject: New Budget Request from {{from_name}}
   Content:
   Customer: {{from_name}}
   Email: {{from_email}}
   Phone: {{phone}}
   Event Date: {{event_date}}
   
   Services:
   {{services}}
   
   Total: {{total_amount}}
   
   Notes: {{additional_notes}}

4. Update EMAIL_CONFIG in src/lib/emailService.ts:
   - SERVICE_ID: Your service ID
   - TEMPLATE_ID_CONTACT: Contact template ID
   - TEMPLATE_ID_BUDGET: Budget template ID
   - PUBLIC_KEY: Your public key
   - TO_EMAIL: Your business email

5. Test the forms on your website!
  `);
};