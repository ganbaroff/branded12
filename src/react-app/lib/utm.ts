/**
 * Extract UTM parameters and referrer from URL
 * Stores in sessionStorage to persist across page navigations
 */

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
}

const STORAGE_KEY = 'b2brand_utm_params';

export function getUTMParams(): UTMParams {
  // Check if we already have UTM params in sessionStorage
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Invalid JSON, continue to extract from URL
    }
  }

  // Extract from current URL
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');
  
  // Get referrer (document.referrer or previous page)
  const referrer = document.referrer || null;

  const params: UTMParams = {};
  
  if (utmSource) params.utm_source = utmSource;
  if (utmMedium) params.utm_medium = utmMedium;
  if (utmCampaign) params.utm_campaign = utmCampaign;
  if (referrer) params.referrer = referrer;

  // Store in sessionStorage for future use
  if (Object.keys(params).length > 0) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(params));
  }

  return params;
}

/**
 * Clear stored UTM parameters (useful for testing)
 */
export function clearUTMParams(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
