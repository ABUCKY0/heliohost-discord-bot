// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

// Check if the config file exists
if (!fs.existsSync(path.join(__dirname, 'config.js'))) {
	fs.copyFileSync(path.join(__dirname, 'config.example.js'), path.join(__dirname, 'config.js'));
	console.log('Please configure your bot in config.js');
	process.exit(1);
}

// Import the config file
console.log('Config file found!');
console.warn('This bot only checks that the config file exists, not that it is properly configured. Please ensure that your config file is properly configured before running the bot.');
const { config } = require('./config.js');

const sequelize = require("./database/database.js");
// This will create the table if it doesn't exist (and do nothing if it already exists)
sequelize.Tag.sync();
// Create the Client and Commands Collection
const client = new Client({ intents: [GatewayIntentBits.Guilds], allowedMentions: { parse: ['users', 'roles'], repliedUser: true } });
client.commands = new Collection();

// Load all commands
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}


client.login(config.bot.token);