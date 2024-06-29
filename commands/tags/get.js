const { SlashCommandBuilder } = require('discord.js');

const { config } = require('../../config.js');
const { getTag } = require('../../database/database.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('get')
		.setDescription('Get a Tag in the Database.')
		// autocomplete
		.addStringOption(option => option.setName('name').setDescription('The name of the Tag').setRequired(true).setAutocomplete(false)),
	async execute(interaction) {
		await interaction.deferReply();
		try {
			console.log(`Getting Tag: ${interaction.options.getString('name')}`);
			if (interaction.options.getString('name') === null) {
				await interaction.editReply("You need to provide a name to get a tag.");
				return;
			}

			const name = interaction.options.getString('name');
			const tag = await getTag(name);
			if (tag) {
				let message = tag.get('tagDescription') || "No Description";
				await interaction.editReply({ content: message });
				return;
			}
			await interaction.editReply(`Could not find tag: ${name}`);
			return;
		}
		catch (error) {
			console.error(error);
			await interaction.editReply({ content: "There was an error while getting the tag." });
		}
	},
};