import express from 'express';
import path from 'path';
import nodemailer from 'nodemailer';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

function resolveSmtpSecure(port: number, secureInput?: boolean): boolean {
  if (port === 465) return true;
  if (port === 587 || port === 25 || port === 2525) return false;
  return Boolean(secureInput);
}

function formatISTDateString(dateInput?: any): string {
  if (!dateInput) {
    return new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST';
  }
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) {
    return String(dateInput);
  }
  return d.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST';
}

function formatSmtpError(err: any): string {
  const msg = err.message || '';
  if (msg.includes('Greeting never received')) {
    return 'Connection failed ("Greeting never received"). This usually happens when the Port and Security (SSL/TLS) settings mismatch. Note: Port 587 uses TLS (SSL OFF), while Port 465 requires SSL (SSL ON). Also verify the SMTP host server address.';
  }
  if (err.code === 'EAUTH' || err.responseCode === 535 || msg.includes('Invalid login') || msg.includes('Username and Password not accepted')) {
    return 'SMTP Authentication Failed (535): Invalid SMTP username or password. Please double check your SMTP credentials.';
  }
  if (err.code === 'ETIMEDOUT' || err.code === 'ESOCKETTIMEDOUT' || msg.includes('timeout')) {
    return 'Connection timed out. Unable to reach the specified SMTP host server or port. Please check your host server domain and port.';
  }
  if (err.code === 'ENOTFOUND') {
    return 'SMTP Host Not Found (ENOTFOUND). Please verify the SMTP host server address (e.g. smtp.mailgun.org).';
  }
  if (err.code === 'ECONNREFUSED') {
    return 'Connection Refused (ECONNREFUSED). The remote host rejected connection on this port.';
  }
  return msg || 'Failed to connect to SMTP server.';
}
import fs from 'fs';

const SMTP_FILE_PATH = '/tmp/smtp_config.json';

function loadSmtpConfig() {
  const defaultConfig = {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || 'praful.akhani19@gmail.com',
    pass: process.env.SMTP_PASS || '',
    secure: process.env.SMTP_SECURE === 'true',
    targetRecipient: 'praful.akhani19@gmail.com',
  };

  try {
    if (fs.existsSync(SMTP_FILE_PATH)) {
      const data = fs.readFileSync(SMTP_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      return { ...defaultConfig, ...parsed };
    }
  } catch (err) {
    console.error('Error reading saved SMTP config:', err);
  }
  return defaultConfig;
}

let activeSmtpConfig = loadSmtpConfig();

function saveSmtpConfig(config: typeof activeSmtpConfig) {
  try {
    fs.writeFileSync(SMTP_FILE_PATH, JSON.stringify(config, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving SMTP config file:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable trust proxy so Express reads x-forwarded-proto & x-forwarded-host correctly
  app.set('trust proxy', true);

  // Helper to extract the public live domain URL for email links
  const getAppHost = (req: express.Request): string => {
    // 1. Explicit appHost passed from browser client window.location.origin
    if (req.body && req.body.appHost && typeof req.body.appHost === 'string' && req.body.appHost.startsWith('http')) {
      return req.body.appHost.replace(/\/$/, '');
    }

    // 2. Check Origin header
    const origin = req.get('origin');
    if (origin && origin.startsWith('http') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
      return origin.replace(/\/$/, '');
    }

    // 3. Check Referer header
    const referer = req.get('referer');
    if (referer && referer.startsWith('http')) {
      try {
        const refUrl = new URL(referer);
        if (!refUrl.hostname.includes('localhost') && !refUrl.hostname.includes('127.0.0.1')) {
          return refUrl.origin;
        }
      } catch (e) {}
    }

    // 4. Check X-Forwarded-Proto and X-Forwarded-Host
    const xProto = req.get('x-forwarded-proto');
    const xHost = req.get('x-forwarded-host');
    if (xHost && !xHost.includes('localhost') && !xHost.includes('127.0.0.1')) {
      const proto = (xProto || 'https').split(',')[0].trim();
      const host = xHost.split(',')[0].trim();
      return `${proto}://${host}`;
    }

    // 5. Fallback to Origin/Referer even if local
    if (origin && origin.startsWith('http')) {
      return origin.replace(/\/$/, '');
    }
    if (referer && referer.startsWith('http')) {
      try {
        return new URL(referer).origin;
      } catch (e) {}
    }

    const proto = req.protocol || 'https';
    const host = req.get('host') || 'localhost:3000';
    return `${proto}://${host}`;
  };

  // CORS & Parse Headers for Hostinger / production proxy compatibility
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json());

  // SEO: robots.txt Endpoint
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /
Disallow: /api/
Sitemap: ${req.protocol}://${req.get('host')}/sitemap.xml
`);
  });

  // SEO: Dynamic XML Sitemap Endpoint
  app.get('/sitemap.xml', (req, res) => {
    const host = `${req.protocol}://${req.get('host')}`;
    const today = new Date().toISOString().split('T')[0];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${host}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${host}/#features</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${host}/#demo</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${host}/#modules</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${host}/#testimonials</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

  // Health check API
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Get current SMTP configuration status
  app.get('/api/smtp-config', (req, res) => {
    res.json({
      configured: Boolean(activeSmtpConfig.user && activeSmtpConfig.pass),
      host: activeSmtpConfig.host,
      port: activeSmtpConfig.port,
      user: activeSmtpConfig.user,
      secure: activeSmtpConfig.secure,
      targetRecipient: activeSmtpConfig.targetRecipient || 'praful.akhani19@gmail.com',
      hasPass: Boolean(activeSmtpConfig.pass),
    });
  });

  // Save/Update SMTP configuration via Admin Dashboard
  app.post('/api/smtp-config', (req, res) => {
    const { host, port, user, pass, secure, targetRecipient } = req.body;
    
    if (host) activeSmtpConfig.host = host;
    if (port) activeSmtpConfig.port = Number(port);
    if (user !== undefined) activeSmtpConfig.user = user;
    if (pass !== undefined && pass !== '') activeSmtpConfig.pass = pass;
    if (secure !== undefined) activeSmtpConfig.secure = Boolean(secure);
    if (targetRecipient) activeSmtpConfig.targetRecipient = targetRecipient;

    saveSmtpConfig(activeSmtpConfig);

    console.log(`[SMTP CONFIG UPDATED] Host: ${activeSmtpConfig.host}, User: ${activeSmtpConfig.user}, Target: ${activeSmtpConfig.targetRecipient}`);

    res.json({
      success: true,
      message: 'SMTP settings updated successfully.',
      configured: Boolean(activeSmtpConfig.user && activeSmtpConfig.pass),
      config: {
        host: activeSmtpConfig.host,
        port: activeSmtpConfig.port,
        user: activeSmtpConfig.user,
        secure: activeSmtpConfig.secure,
        targetRecipient: activeSmtpConfig.targetRecipient,
      },
    });
  });

  // Test Email Endpoint
  app.post('/api/test-email', async (req, res) => {
    const targetEmail = req.body.email || activeSmtpConfig.targetRecipient || 'praful.akhani19@gmail.com';
    const host = (req.body.host && req.body.host.trim()) ? req.body.host.trim() : activeSmtpConfig.host;
    const port = Number(req.body.port) || activeSmtpConfig.port || 587;
    const user = (req.body.user && req.body.user.trim()) ? req.body.user.trim() : activeSmtpConfig.user;
    const pass = (req.body.pass && req.body.pass.trim()) ? req.body.pass.trim() : activeSmtpConfig.pass;
    const secure = resolveSmtpSecure(port, req.body.secure !== undefined ? Boolean(req.body.secure) : activeSmtpConfig.secure);

    if (!host) {
      return res.status(200).json({
        success: false,
        error: 'Missing SMTP Host Server! Please enter your outbound SMTP host address (e.g. smtp.mailgun.org or mail.yourdomain.com).',
      });
    }

    if (!user || !pass) {
      return res.status(200).json({
        success: false,
        error: 'Missing SMTP Credentials! Please enter your SMTP Username and Password/API Token.',
      });
    }

    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 15000,
      });

      await transporter.sendMail({
        from: `"EduSphere Smart School ERP" <${user}>`,
        to: targetEmail,
        subject: `✅ Test Email: EduSphere Lead Notification System`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; background: #06151B; color: #ffffff; border-radius: 12px; border: 1px solid #00C896;">
            <h2 style="color: #00C896; margin-top: 0;">EduSphere Custom SMTP Test Successful!</h2>
            <p style="color: #cbd5e1;">Your lead notification email system is active and verified for <strong>${targetEmail}</strong>.</p>
            <p style="font-size: 12px; color: #94a3b8;">Sent via EduSphere Smart School ERP Admin Portal at ${new Date().toLocaleString()}</p>
          </div>
        `,
      });

      // Update active config if test succeeded
      activeSmtpConfig = { 
        ...activeSmtpConfig,
        host, 
        port, 
        user, 
        pass, 
        secure,
        targetRecipient: targetEmail
      };
      saveSmtpConfig(activeSmtpConfig);

      res.json({
        success: true,
        message: `Test email successfully delivered to ${targetEmail}!`,
      });
    } catch (err: any) {
      console.error('[SMTP TEST ERROR]', err);
      const errorMsg = formatSmtpError(err);
      res.status(200).json({
        success: false,
        error: errorMsg,
      });
    }
  });



  // API endpoint to dispatch lead emails to praful.akhani19@gmail.com
  app.post('/api/send-otp', async (req, res) => {
    const { name, email, phone, otpCode } = req.body;
    if (!email || !otpCode) {
      return res.status(400).json({ success: false, error: 'Email and OTP code are required.' });
    }

    const host = activeSmtpConfig.host || process.env.SMTP_HOST || '';
    const port = Number(activeSmtpConfig.port || process.env.SMTP_PORT || 587);
    const user = activeSmtpConfig.user || process.env.SMTP_USER || '';
    const pass = activeSmtpConfig.pass || process.env.SMTP_PASS || '';
    const secure = resolveSmtpSecure(port, activeSmtpConfig.secure || process.env.SMTP_SECURE === 'true');

    if (!user || !pass || !host) {
      console.log(`[OTP EMAIL] Fallback OTP generated: ${otpCode} for ${email}`);
      return res.json({
        success: true,
        sentViaEmail: false,
        message: 'OTP generated. (SMTP not configured on backend yet)',
      });
    }

    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
      });

      await transporter.sendMail({
        from: `"EduSphere Verification" <${user}>`,
        to: email,
        subject: `Your EduSphere Verification Code: ${otpCode}`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #06151B; color: #ffffff; padding: 24px; border-radius: 12px; max-width: 500px; margin: 0 auto; border: 1px solid #00C896;">
            <h2 style="color: #00C896; margin-top: 0;">EduSphere Demo Verification</h2>
            <p style="color: #e2e8f0;">Hello ${name || 'User'},</p>
            <p style="color: #cbd5e1;">Your 6-digit verification code for EduSphere Smart School Platform is:</p>
            <div style="background-color: #0f172a; border: 1px solid #00C896; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #00C896; font-family: monospace;">${otpCode}</span>
            </div>
            <p style="color: #94a3b8; font-size: 12px;">This code is required to verify your demo request for phone number <strong>${phone || ''}</strong>.</p>
          </div>
        `,
      });

      console.log(`[OTP EMAIL SENT] Verification code ${otpCode} dispatched to ${email}`);
      return res.json({ success: true, sentViaEmail: true, message: `OTP sent to ${email}` });
    } catch (err: any) {
      console.error('[OTP EMAIL ERROR]', err);
      return res.json({ success: true, sentViaEmail: false, error: err.message });
    }
  });

  // API endpoint to dispatch lead emails to praful.akhani19@gmail.com
  app.post('/api/send-lead-email', async (req, res) => {
    const { name, email, phone, school, recipientEmail, verifiedAt, type, customSmtp } = req.body;

    const targetEmail = recipientEmail || activeSmtpConfig.targetRecipient || 'praful.akhani19@gmail.com';

    // Use custom provided SMTP or active config or env vars
    const host = customSmtp?.host || activeSmtpConfig.host || process.env.SMTP_HOST || '';
    const port = Number(customSmtp?.port || activeSmtpConfig.port || process.env.SMTP_PORT || 587);
    const user = customSmtp?.user || activeSmtpConfig.user || process.env.SMTP_USER || '';
    const pass = customSmtp?.pass || activeSmtpConfig.pass || process.env.SMTP_PASS || '';
    const secure = resolveSmtpSecure(port, customSmtp?.secure !== undefined ? Boolean(customSmtp.secure) : (activeSmtpConfig.secure || process.env.SMTP_SECURE === 'true'));

    console.log(`[LEAD EMAIL REQUEST] Received lead for ${school} (${name}, ${phone}, ${email}). Target: ${targetEmail}`);

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #06151B; color: #f8fafc; padding: 30px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #00C896;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #00C896; font-size: 24px; margin: 0;">EduSphere Smart School ERP</h1>
          <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">🚀 New Live Demo Request & High-Priority Lead</p>
        </div>

        <div style="background-color: #0f172a; padding: 20px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 20px;">
          <h2 style="color: #38bdf8; font-size: 16px; margin-top: 0; border-bottom: 1px solid #334155; padding-bottom: 8px;">Lead Details Summary</h2>
          
          <table style="width: 100%; text-align: left; font-size: 14px; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; width: 140px;"><strong>School / Institution:</strong></td>
              <td style="padding: 8px 0; color: #ffffff; font-weight: bold;">${school || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;"><strong>Contact Person:</strong></td>
              <td style="padding: 8px 0; color: #ffffff; font-weight: bold;">${name || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;"><strong>Email Address:</strong></td>
              <td style="padding: 8px 0; color: #38bdf8;"><a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email || 'N/A'}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;"><strong>Phone / Mobile:</strong></td>
              <td style="padding: 8px 0; color: #ffffff;">${phone || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;"><strong>Email Verification:</strong></td>
              <td style="padding: 8px 0; color: #00C896; font-weight: bold;">Verified via Email OTP</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;"><strong>Submitted At (IST):</strong></td>
              <td style="padding: 8px 0; color: #cbd5e1;">${formatISTDateString(verifiedAt)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;"><strong>Status:</strong></td>
              <td style="padding: 8px 0;"><span style="background-color: #065f46; color: #34d399; padding: 3px 8px; border-radius: 6px; font-size: 12px; font-weight: bold;">${type || 'VERIFIED_DEMO_REQUEST'}</span></td>
            </tr>
          </table>
        </div>

        <div style="background-color: #064e3b; padding: 14px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 13px; color: #a7f3d0; font-weight: bold;">
            ⚡ Quick WhatsApp Follow-up:
            <a href="https://wa.me/${(phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${name}, thank you for requesting a live demo of EduSphere Smart School ERP for ${school}.`)}" 
               style="color: #ffffff; background-color: #10b981; padding: 6px 14px; border-radius: 8px; text-decoration: none; margin-left: 8px; font-weight: bold; display: inline-block;">
               Message on WhatsApp
            </a>
          </p>
        </div>

        <div style="font-size: 11px; color: #64748b; text-align: center; border-top: 1px solid #1e293b; padding-top: 12px;">
          This automated lead email notification was sent to <strong>${targetEmail}</strong> via EduSphere Live CRM.
        </div>
      </div>
    `;

    if (!user || !pass) {
      console.warn(`[SMTP WARNING] Cannot send email to ${targetEmail} because SMTP User/Password is not set.`);
      return res.status(200).json({
        success: false,
        emailStatus: 'SMTP_NOT_CONFIGURED',
        message: `Lead saved to database, but real email delivery requires SMTP credentials (e.g. Gmail App Password). Configure it in Admin Portal > Email Settings.`,
        targetEmail,
      });
    }

    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
      });

      await transporter.sendMail({
        from: `"EduSphere CRM Leads" <${user}>`,
        to: targetEmail,
        subject: `🚀 New EduSphere Live Demo Lead: ${school} (${name})`,
        html: htmlContent,
      });

      console.log(`[SMTP SUCCESS] Real lead email dispatched to ${targetEmail}`);

      // 2. Dispatch automated Thank You confirmation email directly to the lead
      let leadThankYouSent = false;
      if (email && email.includes('@')) {
        try {
          const thankYouHtml = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #06151B; color: #f8fafc; padding: 32px 20px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #00C896;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #00C896; font-size: 26px; margin: 0; font-weight: bold;">EduSphere Smart School ERP</h1>
                <p style="color: #38bdf8; font-size: 14px; margin-top: 6px; font-weight: 600;">Empowering Educational Excellence</p>
              </div>

              <div style="background-color: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 24px;">
                <h2 style="color: #ffffff; font-size: 18px; margin-top: 0;">Dear ${name || 'Valued Educator'},</h2>
                <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
                  Thank you for requesting a live demonstration of <strong>EduSphere Smart School ERP</strong> for <strong>${school || 'your institution'}</strong>!
                </p>
                <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
                  We have successfully registered your request. One of our senior product consultants will reach out to you shortly at <strong style="color: #38bdf8;">${email}</strong> / <strong style="color: #38bdf8;">${phone || ''}</strong> to schedule a custom walkthrough tailored to your school's requirements.
                </p>

                <div style="background-color: #06211a; border: 1px solid #00C896; border-radius: 10px; padding: 18px; margin: 20px 0;">
                  <h3 style="color: #00C896; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 0.5px;">✨ What your demo session includes:</h3>
                  <ul style="color: #a7f3d0; font-size: 13px; margin: 0; padding-left: 20px; line-height: 1.8;">
                    <li>Guided tour of 20+ integrated modules (Fee Engine, LMS, Attendance, Parent Portal)</li>
                    <li>AI-powered student performance & analytics insights preview</li>
                    <li>Customized implementation & historical data migration strategy for ${school || 'your campus'}</li>
                    <li>Live Q&A with our core solution architect</li>
                  </ul>
                </div>

                <p style="color: #94a3b8; font-size: 13px; margin-bottom: 0; line-height: 1.5;">
                  If you have immediate questions before our call, reply directly to this email or write to us at <a href="mailto:praful.akhani19@gmail.com" style="color: #00C896; font-weight: bold; text-decoration: none;">praful.akhani19@gmail.com</a>.
                </p>
              </div>

              <div style="text-align: center; color: #64748b; font-size: 12px; border-top: 1px solid #1e293b; padding-top: 16px;">
                <p style="margin: 0; font-weight: 500;">© ${new Date().getFullYear()} EduSphere Technologies Inc. All rights reserved.</p>
                <p style="margin: 4px 0 0 0; color: #475569;">Next-Generation AI-Driven School Management Platform</p>
              </div>
            </div>
          `;

          await transporter.sendMail({
            from: `"EduSphere ERP Team" <${user}>`,
            to: email,
            subject: `🎉 Thank You for Requesting an EduSphere Smart School Demo, ${name}!`,
            html: thankYouHtml,
          });
          leadThankYouSent = true;
          console.log(`[THANK YOU EMAIL SENT] Personalized confirmation dispatched to lead: ${email}`);
        } catch (thankYouErr) {
          console.error('[THANK YOU EMAIL ERROR]', thankYouErr);
        }
      }

      res.status(200).json({
        success: true,
        emailStatus: 'SENT',
        leadThankYouSent,
        message: `Lead email notification sent to ${targetEmail} and Thank You email dispatched to ${email}`,
        leadDetails: { name, email, phone, school, targetEmail },
        timestamp: formatISTDateString(),
      });
    } catch (err: any) {
      console.error('[EMAIL DISPATCH ERROR]', err);
      const formattedErr = formatSmtpError(err);
      res.status(200).json({
        success: false,
        emailStatus: 'FAILED',
        message: `Lead logged to database, but SMTP delivery error occurred: ${formattedErr}`,
        errorNote: formattedErr,
      });
    }
  });

  // Endpoint: Send Account Creation Email to New Team Member
  app.post('/api/send-account-created-email', async (req, res) => {
    const { name, email, role, password, resetToken, createdBy } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const host = activeSmtpConfig.host || process.env.SMTP_HOST || '';
    const port = Number(activeSmtpConfig.port || process.env.SMTP_PORT || 587);
    const user = activeSmtpConfig.user || process.env.SMTP_USER || '';
    const pass = activeSmtpConfig.pass || process.env.SMTP_PASS || '';
    const secure = resolveSmtpSecure(port, activeSmtpConfig.secure || process.env.SMTP_SECURE === 'true');

    const appHost = getAppHost(req);
    const resetUrl = `${appHost}/?action=reset-password&email=${encodeURIComponent(email)}&token=${encodeURIComponent(resetToken || '')}`;
    const loginUrl = `${appHost}/?action=admin-login`;

    if (!user || !pass || !host) {
      return res.json({
        success: true,
        sentViaEmail: false,
        message: 'Account created in system. (SMTP server not configured for email dispatch yet)',
        resetUrl,
      });
    }

    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
      });

      const roleLabel = role === 'SUPER_ADMIN' ? 'Super Administrator' : 'Team Member / Staff';

      const emailHtml = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #06151B; color: #f8fafc; padding: 32px 20px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #00C896;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #00C896; font-size: 26px; margin: 0; font-weight: bold;">EduSphere Smart School ERP</h1>
            <p style="color: #38bdf8; font-size: 14px; margin-top: 6px; font-weight: 600;">Admin Panel Access Credentials</p>
          </div>

          <div style="background-color: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 24px;">
            <h2 style="color: #ffffff; font-size: 18px; margin-top: 0;">Welcome aboard, ${name || 'Team Member'}!</h2>
            <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
              An administrator account has been created for you on the <strong>EduSphere ERP Platform</strong> by <strong style="color: #38bdf8;">${createdBy || 'Super Admin'}</strong>.
            </p>

            <div style="background-color: #06211a; border: 1px solid #00C896; border-radius: 10px; padding: 18px; margin: 20px 0;">
              <h3 style="color: #00C896; font-size: 14px; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">🔐 Your Login Credentials:</h3>
              <table style="width: 100%; font-size: 14px; color: #e2e8f0;">
                <tr>
                  <td style="padding: 6px 0; color: #94a3b8; width: 120px;"><strong>Role:</strong></td>
                  <td style="padding: 6px 0; color: #38bdf8; font-weight: bold;">${roleLabel}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #94a3b8;"><strong>Login ID (Email):</strong></td>
                  <td style="padding: 6px 0; color: #00C896; font-weight: bold;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #94a3b8;"><strong>Initial Password:</strong></td>
                  <td style="padding: 6px 0; color: #fbbf24; font-family: monospace; font-weight: bold; font-size: 15px;">${password}</td>
                </tr>
              </table>
            </div>

            <p style="color: #cbd5e1; font-size: 13px; line-height: 1.5; margin-bottom: 20px;">
              For security reasons, we strongly recommend changing your password upon first login using the secure reset link below:
            </p>

            <div style="text-align: center; margin: 24px 0 16px 0;">
              <a href="${resetUrl}" style="background-color: #00C896; color: #06151B; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 14px rgba(0, 200, 150, 0.4);">
                🔑 Reset / Change Your Password
              </a>
              <div style="margin-top: 14px; font-size: 11px; color: #94a3b8; word-break: break-all; background-color: #06151b; padding: 10px; border-radius: 8px; border: 1px solid #1e293b;">
                Direct Reset URL:<br />
                <a href="${resetUrl}" style="color: #38bdf8; text-decoration: underline;">${resetUrl}</a>
              </div>
            </div>

            <div style="text-align: center; margin-bottom: 10px;">
              <a href="${loginUrl}" style="color: #38bdf8; font-size: 13px; font-weight: 600; text-decoration: underline;">
                🚀 Directly Open Admin Login Portal
              </a>
            </div>
          </div>

          <div style="text-align: center; color: #64748b; font-size: 12px; border-top: 1px solid #1e293b; padding-top: 16px;">
            <p style="margin: 0; font-weight: 500;">© ${new Date().getFullYear()} EduSphere Technologies Inc. All rights reserved.</p>
            <p style="margin: 4px 0 0 0; color: #475569;">Security & Team Management System</p>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: `"EduSphere ERP Super Admin" <${user}>`,
        to: email,
        subject: `🔑 Your EduSphere Admin Account Details & Password Reset Link`,
        html: emailHtml,
      });

      console.log(`[ACCOUNT EMAIL SENT] Credentials & reset link dispatched to ${email}`);

      res.json({
        success: true,
        sentViaEmail: true,
        message: `Credentials and password reset link sent to ${email}`,
        resetUrl,
      });
    } catch (err: any) {
      console.error('[ACCOUNT EMAIL ERROR]', err);
      res.json({
        success: false,
        error: formatSmtpError(err),
        resetUrl,
      });
    }
  });

  // Endpoint: Send Password Reset Link Email (Triggered by Super Admin or User Lockout)
  app.post('/api/send-password-reset-email', async (req, res) => {
    const { name, email, resetToken, requestedBy, isLocked } = req.body;
    if (!email || !resetToken) {
      return res.status(400).json({ success: false, error: 'Email and reset token are required.' });
    }

    const host = activeSmtpConfig.host || process.env.SMTP_HOST || '';
    const port = Number(activeSmtpConfig.port || process.env.SMTP_PORT || 587);
    const user = activeSmtpConfig.user || process.env.SMTP_USER || '';
    const pass = activeSmtpConfig.pass || process.env.SMTP_PASS || '';
    const secure = resolveSmtpSecure(port, activeSmtpConfig.secure || process.env.SMTP_SECURE === 'true');

    const appHost = getAppHost(req);
    const resetUrl = `${appHost}/?action=reset-password&email=${encodeURIComponent(email)}&token=${encodeURIComponent(resetToken)}`;

    if (!user || !pass || !host) {
      return res.json({
        success: true,
        sentViaEmail: false,
        message: 'Password reset link generated. (SMTP server not configured yet)',
        resetUrl,
      });
    }

    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
        tls: { rejectUnauthorized: false },
      });

      const lockNote = isLocked
        ? '<p style="color: #f87171; background: #450a0a; border: 1px solid #991b1b; padding: 12px; border-radius: 8px; font-size: 13px;">⚠️ Note: Your account was locked after 3 failed login attempts. Clicking the link below will allow you to set a new password and automatically unlock your account.</p>'
        : '';

      const emailHtml = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #06151B; color: #f8fafc; padding: 32px 20px; border-radius: 16px; max-width: 600px; margin: 0 auto; border: 1px solid #00C896;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #00C896; font-size: 26px; margin: 0; font-weight: bold;">EduSphere Smart School ERP</h1>
            <p style="color: #38bdf8; font-size: 14px; margin-top: 6px; font-weight: 600;">Password Reset Authorization</p>
          </div>

          <div style="background-color: #0f172a; padding: 24px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 24px;">
            <h2 style="color: #ffffff; font-size: 18px; margin-top: 0;">Hello ${name || 'Team Member'},</h2>
            <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
              A password reset link has been dispatched for your EduSphere admin account (<strong>${email}</strong>) by <strong style="color: #00C896;">${requestedBy || 'Super Admin'}</strong>.
            </p>

            ${lockNote}

            <p style="color: #cbd5e1; font-size: 13px; line-height: 1.5; margin-top: 16px;">
              Please click the button below to set your new password immediately:
            </p>

            <div style="text-align: center; margin: 28px 0 16px 0;">
              <a href="${resetUrl}" style="background-color: #00C896; color: #06151B; padding: 14px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 16px rgba(0, 200, 150, 0.4);">
                🔒 Set New Password Now
              </a>
              <div style="margin-top: 16px; font-size: 11px; color: #94a3b8; word-break: break-all; background-color: #06151b; padding: 10px; border-radius: 8px; border: 1px solid #1e293b;">
                Or copy and paste this direct link into your browser:<br />
                <a href="${resetUrl}" style="color: #38bdf8; text-decoration: underline;">${resetUrl}</a>
              </div>
            </div>

            <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">
              If you did not request this password reset or believe this is an error, please inform your Super Admin immediately.
            </p>
          </div>

          <div style="text-align: center; color: #64748b; font-size: 12px; border-top: 1px solid #1e293b; padding-top: 16px;">
            <p style="margin: 0; font-weight: 500;">© ${new Date().getFullYear()} EduSphere Technologies Inc. All rights reserved.</p>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: `"EduSphere ERP Security" <${user}>`,
        to: email,
        subject: `🔒 EduSphere Password Reset Link for ${email}`,
        html: emailHtml,
      });

      console.log(`[RESET EMAIL SENT] Password reset link sent to ${email}`);

      res.json({
        success: true,
        sentViaEmail: true,
        message: `Password reset email delivered to ${email}`,
        resetUrl,
      });
    } catch (err: any) {
      console.error('[RESET EMAIL ERROR]', err);
      res.json({
        success: false,
        error: formatSmtpError(err),
        resetUrl,
      });
    }
  });

  // WhatsApp Widget AI Chat Bot Endpoint
  app.post('/api/whatsapp-ai-chat', async (req, res) => {
    try {
      const { messages } = req.body || {};
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ success: false, error: 'Messages array is required.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({
          success: true,
          reply: "Hello! I am EduSphere AI Assistant. Our Smart School ERP provides AI Biometric Attendance, GPS Bus Tracking, Fee Management, and Parent Mobile Apps. If you would like to speak directly with our team, please click 'Chat with Human Agent on WhatsApp' below!",
          shouldTransferToHuman: true
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const systemInstruction = `You are EduSphere AI, the virtual admissions & school management advisor for EduSphere Smart School ERP Platform.
EduSphere is Bharat's leading all-in-one Smart School ERP system.
Key capabilities & modules include:
1. AI Biometric & Facial Recognition Student/Teacher Attendance with instant SMS/WhatsApp parent alerts.
2. Real-time GPS School Transport & Bus Tracking with Geofencing, Speed monitoring, and Parent ETA alerts.
3. Automated Fee Management, Fine Calculation, Digital Receipts, GST Tax invoices & Online Payment Gateway.
4. Mobile Apps for Parents, Teachers, and Drivers on Android and iOS.
5. AI Exam & Report Card Generator supporting CBSE/ICSE/IB/State Board grading standards.
6. Custom Lead CRM, Digital Inquiry Management, and Admission Funnel Automation.
7. Multi-branch School Administration, Role-based Access, Expense Ledger & Financial Audits.
8. Live Demo Booking and On-boarding assistance.

Instructions:
- Be extremely warm, helpful, professional, and concise (maximum 2-3 short paragraphs or clean bullet points).
- Answer questions accurately about EduSphere's features, modules, security, and demo scheduling.
- If the user explicitly asks for human support, custom price negotiation, phone calls, or if you cannot answer their query, answer what you know briefly and warmly invite them to click the "Chat with Human Agent on WhatsApp" button below so their entire conversation context is transferred to our live support team on WhatsApp.`;

      // Build context prompt from conversation history
      let formattedPrompt = systemInstruction + "\n\n--- Conversation Thread ---\n";
      for (const msg of messages) {
        const roleName = msg.role === 'user' ? 'User' : 'EduSphere AI';
        formattedPrompt += `${roleName}: ${msg.text}\n`;
      }
      formattedPrompt += `EduSphere AI:`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: formattedPrompt,
      });

      const replyText = response.text || "I'd be happy to connect you with our team on WhatsApp for complete details!";

      res.json({
        success: true,
        reply: replyText
      });
    } catch (err: any) {
      console.error('[WHATSAPP AI CHAT ERROR]', err);
      res.json({
        success: true,
        reply: "I'm having trouble connecting right now, but our human support team is online on WhatsApp! Click the button below to connect directly with our human agent.",
        shouldTransferToHuman: true
      });
    }
  });


  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduSphere Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
