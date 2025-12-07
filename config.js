
import settings from './settings.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file if it exists
dotenv.config({ path: path.join(__dirname, '.env') });

// Load app.json configuration
let appJsonConfig = {};
try {
  const appJsonPath = path.join(__dirname, 'app.json');
  if (fs.existsSync(appJsonPath)) {
    const appJsonData = JSON.parse(fs.readFileSync(appJsonPath, 'utf-8'));
    
    // Extract default values from app.json env configuration
    if (appJsonData.env) {
      Object.keys(appJsonData.env).forEach(key => {
        const envConfig = appJsonData.env[key];
        if (envConfig.value !== undefined) {
          appJsonConfig[key] = envConfig.value;
        }
      });
    }
    console.log('[CONFIG] Loaded app.json configuration');
  }
} catch (error) {
  console.log('[CONFIG] Could not load app.json:', error.message);
}

// Helper function to get env variable with fallback priority:
// 1. Environment variable (highest priority)
// 2. .env file value
// 3. app.json default value
// 4. Hardcoded default (lowest priority)
const getEnvValue = (key, defaultValue) => {
  return process.env[key] || appJsonConfig[key] || defaultValue;
};

export default {
  // Bot configuration - priority: process.env > .env > app.json > defaults
  prefix: getEnvValue('BOT_PREFIX', '.'),
  ownerNumber: getEnvValue('BOT_NUMBER', '2348028336218'),
  botName: getEnvValue('BOT_NAME', '𝔼𝕔𝕝𝕚𝕡𝕤𝕖 𝕄𝔻'),
  ownerName: getEnvValue('BOT_OWNER_NAME', 'Eclipse'),
  sessionId: 'ECLIPSE-MD-SESSION-ID',
  BOOM_MESSAGE_LIMIT: 50,

  // API configurations from settings (with env override)
  openaiApiKey: getEnvValue('OPENAI_API_KEY', settings.openaiApiKey),
  giphyApiKey: getEnvValue('GIPHY_API_KEY', settings.giphyApiKey),
  geminiApiKey: getEnvValue('GEMINI_API_KEY', settings.geminiApiKey),
  imgurClientId: getEnvValue('IMGUR_CLIENT_ID', settings.imgurClientId),
  copilotApiKey: getEnvValue('COPILOT_API_KEY', settings.copilotApiKey),
  FOOTBALL_API_KEY: getEnvValue('FOOTBALL_API_KEY', settings.FOOTBALL_API_KEY),
  
  // Session data
  sessionData: getEnvValue('BOT_SESSION_DATA', ''),
};
