const { manageWiki, DBManagementActions, Status } = require('../../../database/database.js');
const { checkAuth } = require('../../../utility/authorization.js');


module.exports = {
    async cmdWikiDelete(interaction) {
        // Verify the user has the correct permissions
        await interaction.deferReply();
        try {
            if (checkAuth(interaction) === false) {
                await interaction.editReply({ content: "You don't have the required permissions to run this command.", ephemeral: true });
                return;
            }
            const articleName = await interaction.options.getString('article');
            if (articleName === null) {
                await interaction.editReply({ content: "You need to provide a name to remove a article.", ephemeral: true });
                return;
            }

            const article = await manageWiki(DBManagementActions.DELETE, articleName);
            if (article === Status.SUCCESS) {
                await interaction.editReply({ content: `Removed article: ${articleName}` });
                return;
            }
            else if (article === Status.FAIL) {
                await interaction.editReply({ content: `Could not find article: ${articleName}` });
            }
            else {
                await interaction.editReply({ content: `There was an issue while removing the article: ${articleName}` });
            }
        }
        catch (error) {
            console.error(error);
            await interaction.editReply({ content: `There was a ${typeof(error)} error while removing the article.` });
        }
    },
};