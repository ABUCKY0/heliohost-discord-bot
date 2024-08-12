const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { checkAuth } = require('../../../utility/authorization.js');
module.exports = {
    async cmdTagAdd(interaction) {
        // Verify the user has the correct permissions
        try {
            if (checkAuth(interaction) === false) {
                interaction.reply({ content: "You don't have the Permissions to run this command.", ephemeral: true });
            }

            //interaction.reply({content: "This command hasn't been implemented yet, but you passed the perm check.", ephemeral: true})
            const modal = new ModalBuilder()
                .setCustomId("AddTagModal")
                .setTitle("Add a new Tag");

            const input_tagname = new TextInputBuilder()
                .setCustomId("input_tagname")
                .setLabel("Name")
                .setStyle(TextInputStyle.Short)
                .setMaxLength(255);

            const input_tagbody = new TextInputBuilder()
                .setCustomId("input_tagbody")
                .setLabel("Body")
                .setStyle(TextInputStyle.Paragraph)
                .setMaxLength(2000);

            // Action Rows to hold inputs
            const firstActionRow = new ActionRowBuilder().addComponents(input_tagname);
            const secondActionRow = new ActionRowBuilder().addComponents(input_tagbody);

            // Add inputs to the modal
            modal.addComponents(firstActionRow, secondActionRow);

            // Show the modal to the user
            await interaction.showModal(modal);

            // Handling is done in ../../events/interactionCreate.js
        }
        catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error while adding the tag." });
        }
    },
};