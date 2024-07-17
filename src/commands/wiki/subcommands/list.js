const { manageWiki, DBManagementActions, Status } = require('../../../database/database.js');
module.exports = {
	async cmdWikiList(interaction) {

		await interaction.deferReply();
		try {
			const wikiArticles = await manageWiki(DBManagementActions.GETALL);
			let message = "Articles: `";
			if (wikiArticles.length === 0) {
				message = "No articles found.";
				await interaction.editReply({ content: message });
				return;
			}
			wikiArticles.forEach(article => {
				message += `${article.get('articleName')}, `;
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
			await interaction.editReply({ content: "There was an error while listing all Wiki Artciles." });
		}
	},
};