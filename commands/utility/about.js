const { SlashCommandBuilder, AllowedMentionsTypes } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('Provides information about the bot.'),
	async execute(interaction) {
		// interaction.guild is the object representing the Guild in which the command was run
		await interaction.reply(`This bot is a Discord bot created by notjohnnytamale.`);
	},
};