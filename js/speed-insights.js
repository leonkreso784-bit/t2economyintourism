/**
 * Vercel Speed Insights initialization
 * Imports and initializes @vercel/speed-insights for performance monitoring
 */
import { injectSpeedInsights } from '../node_modules/@vercel/speed-insights/dist/index.mjs';

// Initialize Speed Insights with default configuration
injectSpeedInsights({
    debug: false
});
