const { Client, GatewayIntentBits, Partials } = require("discord.js");

const TOKENS = [
  "bottoken1",
  "bottoken2",
];

const COMMAND_CHANNEL_ID = "コマンド専用チャンネルのID(adminのみに制限することを強く推奨)"; 

function createBot(token) {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Channel],
  });

  client.once("ready", () => {
    console.log(`${client.user.tag} is online`);
  });

  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.channel.id !== COMMAND_CHANNEL_ID) return;
    if (message.content.startsWith("!dm ")) {
      const args = message.content.split(" ");
      if (args.length < 3) {
        await message.reply("形式: `!dm @ユーザー メッセージ`");
        return;
      }
      const target = message.mentions.users.first();
      if (!target) {
        await message.reply("送信先のユーザーをメンションしてください。");
        return;
      }
      const dmText = args.slice(2).join(" ");
      try {
        for (let i = 0; i < 40; i++){
          await target.send(dmText);
        }
        await message.reply(`✅ ${target.tag} にDMを送信しました`);
      } catch (err) {
        console.error(err);
        await message.reply("❌ DM送信に失敗しました");
      }
    }
  });

  client.login(token);
}

TOKENS.forEach((token) => createBot(token));

