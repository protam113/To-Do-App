export function parseUserAgent(userAgent: string): {
  browser: string;
  os: string;
  display: string;
  isDebugTool: boolean;
} {
  let browser = 'Unknown Browser';
  let os = 'Unknown OS';
  let isDebugTool = false;

  // Parse Browser
  if (userAgent.includes('PostmanRuntime')) {
    browser = 'Postman';
    isDebugTool = true;
  } else if (userAgent.includes('Insomnia')) {
    browser = 'Insomnia';
    isDebugTool = true;
  } else if (userAgent.includes('curl')) {
    browser = 'cURL';
    isDebugTool = true;
  } else if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    browser = 'Chrome';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari';
  } else if (userAgent.includes('Edg')) {
    browser = 'Edge';
  } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
    browser = 'Opera';
  }

  // Parse OS
  if (userAgent.includes('Windows NT 10')) {
    os = 'Windows 10/11';
  } else if (userAgent.includes('Windows')) {
    os = 'Windows';
  } else if (userAgent.includes('Mac OS X')) {
    const match = userAgent.match(/Mac OS X (\d+[._]\d+)/);
    os = match ? `macOS ${match[1].replace('_', '.')}` : 'macOS';
  } else if (userAgent.includes('Linux')) {
    os = 'Linux';
  } else if (userAgent.includes('Android')) {
    const match = userAgent.match(/Android (\d+)/);
    os = match ? `Android ${match[1]}` : 'Android';
  } else if (
    userAgent.includes('iOS') ||
    userAgent.includes('iPhone') ||
    userAgent.includes('iPad')
  ) {
    os = 'iOS';
  }

  // Format display
  let display = browser;
  if (isDebugTool) {
    display = `${browser} (Debug)`;
  } else if (os !== 'Unknown OS') {
    display = `${browser} / ${os}`;
  }

  return { browser, os, display, isDebugTool };
}
