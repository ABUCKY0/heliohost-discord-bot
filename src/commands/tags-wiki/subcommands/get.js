const { manageWiki, DBManagementActions, Status } = require('../../../database/database.js');
module.exports = {
	async cmdWikiGet(interaction) {
		await interaction.deferReply();
		try {
			console.log(`Getting Article: ${interaction.options.getString('article')}`);
			if (interaction.options.getString('article') === null) {
				await interaction.editReply("You need to provide a name to get a article.");
				return;
			}

			const name = interaction.options.getString('article');
			const article = await manageWiki(DBManagementActions.GET, name);
			if (article) {
				let message = article.get('articleBody') || "No Description";
				await interaction.editReply({ content: message });
				return;
			}
			await interaction.editReply(`Could not find article: ${name}`);
			return;
		}
		catch (error) {
			console.error(error);
			await interaction.editReply({ content: "There was an error while getting the article." });
		}
	}
};