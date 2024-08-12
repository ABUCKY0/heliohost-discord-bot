const { manageTags, DBManagementActions } = require('../../../database/database.js');
module.exports = {
	async cmdTagList(interaction) {
		await interaction.deferReply();
		try {
			const tags = await manageTags(DBManagementActions.GETALL);
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

			if (message.length > 2000) {
				// splice to 1997 and add ...
				message = message.slice(0, 1997) + "...";
			}
			await interaction.editReply({ content: message });
		}
		catch (error) {
			console.error(error);
			await interaction.editReply({ content: "There was an error while listing the tags." });
		}
	},
};