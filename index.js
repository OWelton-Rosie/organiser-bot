import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
import dotenv from 'dotenv';
import { responses } from './responses.js'; // import the essay and aliases for '/howtoorganise'
dotenv.config();

// --- Discord client setup ---
const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

// --- Slash commands ---
const commands = [
    new SlashCommandBuilder().setName('howtoorganise').setDescription('Get an essay on how to organise a competition'),
    new SlashCommandBuilder().setName('fixthesuckycomps').setDescription('Get instructions on how to improve the obviously terrible competitions'),
    new SlashCommandBuilder().setName('improvethecomps').setDescription('Get instructions on how to improve the competitions'),
    new SlashCommandBuilder().setName('makethecompsbetter').setDescription('Get an essay on how to make the competitions better'),
].map(command => command.toJSON());

// --- Register commands globally ---
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
(async () => {
    try {
        console.log('Registering slash commands...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        console.log('Slash commands registered.');
    } catch (error) {
        console.error(error);
    }
})();

// --- Ready event ---
client.once('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setStatus('online');
    client.user.setActivity('Helping organisers!', { type: 3 });
});

// --- Slash command handler ---
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.commandName.toLowerCase();
    const response = responses[command];

    if (response) {
        await interaction.reply(response);
        console.log(`Responded to /${command} command from ${interaction.user.tag}`);
    } else {
        await interaction.reply('Sorry, no response is set up for this command.');
    }
});

// --- Login ---
client.login(process.env.TOKEN);
