const { SlashCommandBuilder } = require('discord.js');

const { config } = require('../../config.js');
const { getAllTags } = require('../../database/database.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('list')
		.setDescription('List all tags in the Database.'),
	async execute(interaction) {

		await interaction.deferReply();
		try {
			const tags = await getAllTags();
			let message = "Tags: `";
			if (tags.length === 0) {
				message = "No tags found.";
				await interaction.editReply({ content: message });
				return;
			}
			tags.forEach(tag => {
				message += `${tag.get('tagName')}, `;
			});
			if (message.length > 7) {
				message = message.slice(0, -2);
			}
			message += "`";
			await interaction.editReply({ content: message });
		}
		catch (error) {
			console.error(error);
			await interaction.editReply({ content: "There was an error while listing the tags." });
		}
	},
};