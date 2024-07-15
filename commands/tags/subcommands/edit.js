// Has Modal
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

const { checkAuth } = require('../../../utility/authorization.js');
const { getTag } = require('../../../database/database.js');
module.exports = {
      async cmdTagEdit(interaction) {
        // Verify the user has the correct permissions
        //await interaction.deferReply();
        try {
            if (checkAuth(interaction) === false) {
                await interaction.reply({ content: "You don't have the Permissions to run this command.", ephemeral: true });
            }
            // verify tag exists
            const oldTag = await getTag(interaction.options.getString('tag'));
            if (!oldTag) {
                await interaction.reply({ content: "Tag does not exist.", ephemeral: true });
                return;
            }

            const tagName = await interaction.options.getString('tag');
            const modal = new ModalBuilder()
                .setCustomId("EditTagModal")
                .setTitle("Edit Tag");

            const old_tagname = new TextInputBuilder()
                .setCustomId("oldtagname")
                .setLabel("Old Name (DO NOT CHANGE THIS)")
                .setStyle(TextInputStyle.Short)
                .setValue(oldTag.tagName)
                .setMaxLength(255);

            const input_tagname = new TextInputBuilder()
                .setCustomId("input_tagname")
                .setLabel("Name")
                .setStyle(TextInputStyle.Short)
                .setValue(oldTag.tagName)
                .setMaxLength(255);

            const input_tagbody = new TextInputBuilder()
                .setCustomId("input_tagbody")
                .setLabel("Body")
                .setStyle(TextInputStyle.Paragraph)
                .setValue(oldTag.tagDescription)
                .setMaxLength(2000);

            // Action Rows to hold inputs
            const firstActionRow = new ActionRowBuilder().addComponents(input_tagname);
            const secondActionRow = new ActionRowBuilder().addComponents(input_tagbody);
            const doNotChangeRow = new ActionRowBuilder().addComponents(old_tagname);

            // Add inputs to the modal
            modal.addComponents(firstActionRow, secondActionRow, doNotChangeRow);

            // Show the modal to the user
            await interaction.showModal(modal);

            //Handling is done in ../../../events/interactionCreate.js
        }
        catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error while updating the tag." });
        }
    },
};