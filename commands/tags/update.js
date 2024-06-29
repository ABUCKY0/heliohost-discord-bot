// Has Modal
const { SlashCommandBuilder, AllowedMentionsTypes, ActionRow } = require('discord.js');
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

const { checkAuth } = require('../../utility/authorization.js');
const { config } = require('../../config.js');
const { getTag, updateTag } = require('../../database/database.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Update a Tag in the Database.')
        .addStringOption(option => option.setName('name').setDescription('The name of the Tag').setRequired(true).setAutocomplete(false)),
    async execute(interaction) {
        // Verify the user has the correct permissions
        //await interaction.deferReply();
        try {
            if (checkAuth(interaction) === false) {
                await interaction.reply({ content: "You don't have the Permissions to run this command.", ephemeral: true });
            }
            // verify tag exists
            const oldTag = await getTag(interaction.options.getString('name'));
            if (!oldTag) {
                await interaction.reply({ content: "Tag does not exist.", ephemeral: true });
                return;
            }

            const tagName = await interaction.options.getString('name');
            const modal = new ModalBuilder()
                .setCustomId("EditTagModal")
                .setTitle("Edit Tag");

            const old_tagname = new TextInputBuilder()
                .setCustomId("oldtagname")
                .setLabel("Old Name (DO NOT CHANGE THIS)")
                .setStyle(TextInputStyle.Short)
                .setValue(oldTag.tagName);

            const input_tagname = new TextInputBuilder()
                .setCustomId("input_tagname")
                .setLabel("Name")
                .setStyle(TextInputStyle.Short)
                .setValue(oldTag.tagName);

            const input_tagbody = new TextInputBuilder()
                .setCustomId("input_tagbody")
                .setLabel("Body")
                .setStyle(TextInputStyle.Paragraph)
                .setValue(oldTag.tagDescription);

            // Action Rows to hold inputs
            const firstActionRow = new ActionRowBuilder().addComponents(input_tagname);
            const secondActionRow = new ActionRowBuilder().addComponents(input_tagbody);
            const doNotChangeRow = new ActionRowBuilder().addComponents(old_tagname);

            // Add inputs to the modal
            modal.addComponents(firstActionRow, secondActionRow, doNotChangeRow);

            // Show the modal to the user
            await interaction.showModal(modal);

            //Handling is done in ../../events/interactionCreate.js
        }
        catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error while updating the tag." });
        }
    },
};