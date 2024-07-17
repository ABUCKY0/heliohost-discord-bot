const { manageTags, DBManagementActions } = require('../../../database/database.js');
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
			const tag = await manageTags(DBManagementActions.GET,name);
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
	async cmdTagGetAutocomplete(interaction) {
		try {
			console.log("hit autocomplete");
			const focusedOption = interaction.options.getFocused(true);
			if (focusedOption.name === 'article') {
				// Get all articles
				const wikiArticles = await manageWiki(DBManagementActions.GETALL);
				const choices = [];
				for (const article of wikiArticles) {
					choices.push(article.get('articleName'));
				}
				if (choices.length > 25) {
					// splice to 25
					choices.splice(25);
				}
				console.log(choices);
				console.log(focusedOption);
				const filtered = choices.filter(choice => choice.startsWith(focusedOption.value));
				await interaction.respond(
					filtered.map(choice => ({ name: choice, value: choice })),
				);
			}

		}
		catch (error) {
			console.error(error);
		}
	}
};