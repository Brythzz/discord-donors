import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

import * as commandList from './commands.js';
const commands = Object.values(commandList);

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

await rest.put(
    Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
    ),
    { body: commands }
);
