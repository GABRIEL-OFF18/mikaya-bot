import fs from 'fs';

let handler = async (m, { conn, usedPrefix }) => {
  const delay = ms => new Promise(res => setTimeout(res, ms));
  let nombre = await conn.getName(m.sender);

  function getSaludo() {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) return 'Buen día';
    if (hora >= 12 && hora < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }

  let saludo = getSaludo();

  let tags = {
    info: 'ᴍᴇɴᴜ ɪɴꜰᴏ',
    anime: 'ᴍᴇɴᴜ ᴀɴɪᴍᴇ',
    buscador: 'ᴍᴇɴᴜ ʙᴜꜱᴄᴀᴅᴏʀ',
    descargas: 'ᴍᴇɴᴜ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ',
    fun: 'ᴍᴇɴᴜ ꜰᴜɴ',
    grupo: 'ᴍᴇɴᴜ ɢʀᴜᴘᴏ',
    ai: 'ᴍᴇɴᴜ ᴀɪ',
    game: 'ᴍᴇɴᴜ ɢᴀᴍᴇ',
    serbot: 'ᴍᴇɴᴜ ᴊᴀᴅɪʙᴏᴛ',
    main: 'ᴍᴇɴᴜ ᴍᴀɪɴ',
    nable: 'ᴍᴇɴᴜ ᴏɴ / ᴏꜰꜰ',
    nsfw: 'ᴍᴇɴᴜ ɴꜱꜰᴡ',
    sticker: 'ᴍᴇɴᴜ ꜱᴛɪᴄᴋᴇʀ',
  };

  let header = '\n*╭─「 %category 」─╮*';
  let body = '• *%cmd*';
  let footer = '*╰─────────────────*';

  let user = global.db.data.users[m.sender];
  let premium = user.premium ? '✅ Sí' : '❌ No';
  let totalreg = Object.keys(global.db.data.users).length;
  let groupsCount = Object.values(conn.chats).filter(v => v.id.endsWith('@g.us')).length;
  let muptime = clockString(process.uptime());

  function clockString(seconds) {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    let s = Math.floor(seconds % 60);
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
  }

  let infoUser = `
*🍃 Hola, ${nombre}*

*─━─━─━─━─━─━─━─*
*🌿 INFORMACIÓN DEL USUARIO*
• *Usuario:* ${nombre}
• *Premium:* ${premium}
• *Bot:* ${conn.user.jid == global.conn.user.jid ? 'Principal' : 'Sub-Bot'}

*🌿 ESTADO DEL BOT*
• *Grupos:* ${groupsCount}
• *Tiempo activo:* ${muptime}
• *Usuarios totales:* ${totalreg}
• *Plataforma:* Ubuntu

*🍃 𝐅𝐀𝐁𝐈𝐀𝐍 𝐁𝐎𝐓 - 𝐌𝐄𝐍𝐔*
*─━─━─━─━─━─━─━─*
`.trim();

  let commands = Object.values(global.plugins).filter(v => v.help && v.tags && v.command).map(v => ({
    help: Array.isArray(v.help) ? v.help : [v.help],
    tags: Array.isArray(v.tags) ? v.tags : [v.tags],
    command: Array.isArray(v.command) ? v.command : [v.command]
  }));

  let menu = [];
  for (let tag in tags) {
    let comandos = commands
      .filter(command => command.tags.includes(tag))
      .map(command => command.command.map(cmd => body.replace(/%cmd/g, usedPrefix + cmd)).join('\n'))
      .join('\n');
    
    if (comandos) {
      menu.push(header.replace(/%category/g, tags[tag]) + '\n' + comandos + '\n' + footer);
    }
  }

  let finalMenu = infoUser + '\n' + menu.join('\n') + `\n\n© ᴍᴀᴅᴇ ʙʏ ᴅᴇᴠ-ꜰᴇᴅᴇxʏᴢ`;

  let imagen = 'https://raw.githubusercontent.com/Frimemoloxz/DataBase/main/1783298003162.jpeg';

  await m.react('🍃');

  await conn.sendMessage(m.chat, {
    image: { url: imagen },
    caption: finalMenu,
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363405641626756@newsletter',
        newsletterName: '『 ☆ 𝐅𝐚𝐛𝐢𝐚𝐧𝑩𝒐𝒕-𝑰𝑨 |  𝑶𝒇𝒇𝒊𝒄𝒊𝒂𝒍 ❀ 』'
      },
      externalAdReply: {
        title: '𝐅𝐀𝐁𝐈𝐀𝐍 𝐁𝐎𝐓 - 𝐌𝐄𝐍𝐔',
        body: `🍃 ${saludo}, ${nombre}`,
        thumbnailUrl: imagen,
        mediaType: 1,
        renderLargerThumbnail: true   // Imagen grande (no miniatura)
      }
    }
  }, { quoted: m });

  await delay(400);
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = ['menu'];

export default handler;