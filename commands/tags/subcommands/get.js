const { getTag } = require('../../../database/database.js');
module.exports = {
	async cmdTagGet(interaction) {
		await interaction.deferReply();
		try {
			console.log(`Getting Tag: ${interaction.options.getString('tag')}`);
			if (interaction.options.getString('tag') === null) {
				await interaction.editReply("You need to provide a name to get a tag.");
				return;
			}

			const name = interaction.options.getString('tag');
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