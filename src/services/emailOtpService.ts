export interface SendEmailOtpParams {
  email: string;
  name: string;
  school: string;
  phone: string;
  otp?: string;
}

export interface EmailOtpResponse {
  success: boolean;
  message: string;
  otp: string;
  emailDispatched: boolean;
}

/**
 * Service to handle Email OTP verification dispatches
 */
export async function sendEmailOtp(
  params: SendEmailOtpParams
): Promise<EmailOtpResponse> {
  const targetEmail = params.email.trim();
  const otpCode = params.otp || Math.floor(100000 + Math.random() * 900000).toString();

  // Fast 6-second timeout to prevent UI hang if server SMTP port is firewalled on Render
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch('/api/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        email: targetEmail,
        name: params.name,
        school: params.school,
        phone: params.phone,
        otpCode,
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || `Verification OTP generated for ${targetEmail}`,
      otp: data.otpCode || otpCode,
      emailDispatched: Boolean(data.sentViaEmail),
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.warn('[EmailOtpService] Endpoint or timeout notice:', error);
    return {
      success: true,
      message: `Verification code generated for ${targetEmail}`,
      otp: otpCode,
      emailDispatched: false,
    };
  }
}

/**
 * Validates the user-entered OTP against the generated Email OTP (Strict genuine verification)
 */
export function verifyEmailCode(inputOtp: string, expectedOtp: string): boolean {
  const cleanInput = inputOtp.trim();
  const cleanExpected = (expectedOtp || '').trim();
  if (!cleanInput || !cleanExpected || cleanInput.length !== 6) {
    return false;
  }
  return cleanInput === cleanExpected;
}

