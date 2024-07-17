// Has Modal
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

const { checkAuth } = require('../../../utility/authorization.js');
const { manageWiki, DBManagementActions, Status } = require('../../../database/database.js');
module.exports = {
      async cmdWikiEdit(interaction) {
        // Verify the user has the correct permissions
        //await interaction.deferReply(); // Modals are incompatible with deferReply
        try {
            if (checkAuth(interaction) === false) {
                await interaction.reply({ content: "You don't have the Permissions to run this command.", ephemeral: true });
            }
            // verify article exists
            const oldArticle = await manageWiki(DBManagementActions.GET,interaction.options.getString('article'));
            if (!oldArticle) {
                await interaction.reply({ content: "Article does not exist.", ephemeral: true });
                return;
            }

            const articleName = await interaction.options.getString('article');
            const modal = new ModalBuilder()
                .setCustomId("EditArticleModal")
                .setTitle("Edit Article");

            const old_ArticleName = new TextInputBuilder()
                .setCustomId("oldArticleName")
                .setLabel("Old Name (DO NOT CHANGE THIS)")
                .setStyle(TextInputStyle.Short)
                .setValue(oldArticle.articleName)
                .setMaxLength(255);

            const input_articleName = new TextInputBuilder()
                .setCustomId("input_articlename")
                .setLabel("Name")
                .setStyle(TextInputStyle.Short)
                .setValue(oldArticle.articleName)
                .setMaxLength(255);

            const input_articlebody = new TextInputBuilder()
                .setCustomId("input_articlebody")
                .setLabel("Body")
                .setStyle(TextInputStyle.Paragraph)
                .setValue(oldArticle.articleBody)
                .setMaxLength(2000);

            // Action Rows to hold inputs
            const firstActionRow = new ActionRowBuilder().addComponents(input_articleName);
            const secondActionRow = new ActionRowBuilder().addComponents(input_articlebody);
            const doNotChangeRow = new ActionRowBuilder().addComponents(old_ArticleName);

            // Add inputs to the modal
            modal.addComponents(firstActionRow, secondActionRow, doNotChangeRow);

            // Show the modal to the user
            await interaction.showModal(modal);

            //Handling is done in ../../../events/interactionCreate.js
        }
        catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error while updating the article." });
        }
    },
};