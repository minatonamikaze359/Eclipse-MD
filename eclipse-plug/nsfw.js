
import axios from 'axios';

// Generic NSFW fetcher with multiple API fallbacks
async function fetchNSFW(category) {
  const apis = [
    { url: `https://api.waifu.pics/nsfw/${category}`, format: 'url' },
    { url: `https://nekos.best/api/v2/${category}`, format: 'results' },
    { url: `https://purrbot.site/api/img/nsfw/${category}/gif`, format: 'link' }
  ];

  for (const api of apis) {
    try {
      const response = await axios.get(api.url, { timeout: 10000 });
      if (response.data) {
        if (api.format === 'url' && response.data.url) return response.data.url;
        if (api.format === 'results' && response.data.results?.[0]?.url) return response.data.results[0].url;
        if (api.format === 'link' && response.data.link) return response.data.link;
      }
    } catch (error) {
      console.log(`[NSFW ${category}] API ${api.url} failed, trying next...`);
      continue;
    }
  }
  throw new Error('All APIs failed');
}

// NSFW command generator
function createNSFWCommand(name, category, description) {
  return {
    name,
    description: `🔞 ${description}`,
    category: 'NSFW',
    async execute(msg, { sock }) {
      const dest = msg.key.remoteJid;
      try {
        await sock.sendMessage(dest, {
          react: { text: '⏳', key: msg.key }
        });

        const url = await fetchNSFW(category);
        
        await sock.sendMessage(dest, {
          image: { url },
          caption: `🔞 *${description}*\n\n⚠️ NSFW Content`
        }, { quoted: msg });

        await sock.sendMessage(dest, {
          react: { text: '✅', key: msg.key }
        });
      } catch (error) {
        console.error(`[NSFW ${name}] Error:`, error.message);
        await sock.sendMessage(dest, {
          text: `❌ Failed to fetch ${name} content. Try again later.`
        }, { quoted: msg });
      }
    }
  };
}

// Export all NSFW commands
export default [
  createNSFWCommand('blowjob', 'blowjob', 'Blowjob content'),
  createNSFWCommand('trap', 'trap', 'Trap content'),
  createNSFWCommand('waifu', 'waifu', 'NSFW Waifu'),
  createNSFWCommand('neko', 'neko', 'NSFW Neko'),
  createNSFWCommand('gangbang', 'gangbang', 'Gangbang content'),
  createNSFWCommand('cum', 'cum', 'Cum content'),
  createNSFWCommand('pussy', 'pussy', 'Pussy content'),
  createNSFWCommand('feet', 'feet', 'Feet content'),
  createNSFWCommand('lewdneko', 'neko', 'Lewd Neko'),
  createNSFWCommand('solo', 'solo', 'Solo content'),
  createNSFWCommand('gasm', 'gasm', 'Orgasm content'),
  createNSFWCommand('anal', 'anal', 'Anal content'),
  createNSFWCommand('hentai', 'hentai', 'Hentai content'),
  createNSFWCommand('boobs', 'boobs', 'Boobs content'),
  createNSFWCommand('thigh', 'thigh', 'Thigh content'),
  createNSFWCommand('ass', 'ass', 'Ass content'),
  createNSFWCommand('panties', 'panties', 'Panties content'),
  createNSFWCommand('tentacle', 'tentacles', 'Tentacle content'),
  createNSFWCommand('yuri', 'yuri', 'Yuri content'),
  createNSFWCommand('bdsm', 'bdsm', 'BDSM content'),
  createNSFWCommand('cuckold', 'cuckold', 'Cuckold content'),
  createNSFWCommand('ero', 'ero', 'Erotic content'),
  createNSFWCommand('femdom', 'femdom', 'Femdom content'),
  createNSFWCommand('foot', 'foot', 'Foot fetish content'),
  createNSFWCommand('glasses', 'glasses', 'Glasses content'),
  createNSFWCommand('masturbation', 'masturbation', 'Masturbation content'),
  createNSFWCommand('orgy', 'orgy', 'Orgy content'),
  createNSFWCommand('public', 'public', 'Public content')
];
