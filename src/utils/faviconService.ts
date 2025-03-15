
export const FaviconService = {
  /**
   * Attempts to get a high-quality favicon for a given URL
   */
  getFaviconUrl: (url: string): string => {
    try {
      const parsedUrl = new URL(url);
      const domain = parsedUrl.hostname;
      
      // Try multiple favicon services for better chances of finding an icon
      const services = [
        `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
        `https://icon.horse/icon/${domain}`,
        `https://${domain}/favicon.ico`,
      ];
      
      return services[0]; // Default to Google's service as it's most reliable
    } catch (error) {
      console.error('Error parsing URL for favicon:', error);
      return '/placeholder.svg'; // Fallback to placeholder
    }
  },

  /**
   * Validates a URL and formats it properly
   */
  formatUrl: (url: string): string => {
    if (!url) return '';
    
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.toString();
    } catch (error) {
      console.error('Invalid URL format:', error);
      return '';
    }
  }
};
