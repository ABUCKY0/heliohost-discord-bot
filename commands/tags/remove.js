const { SlashCommandBuilder } = require('discord.js');

const { config } = require('../../config.js');
const { removeTag } = require('../../database/database.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a Tag from the Database.')
        .addStringOption(option => option.setName('name').setDescription('The name of the Tag').setRequired(true)),
    async execute(interaction) {
        // Verify the user has the correct permissions
        await interaction.deferReply();
        try {
            if (!(config.auth.users.includes(interaction.user.id))) {
                await interaction.editReply({ content: "You don't have the Permissions to run this command.", ephemeral: true });
                return;
            }
            const tagName = await interaction.options.getString('name');
            if (tagName === null) {
                await interaction.editReply({ content: "You need to provide a name to remove a tag.", ephemeral: true });
                return;
            }

            const tag = await removeTag(tagName);
            if (tag === 0) {
                await interaction.editReply({ content: `Removed tag: ${tagName}` });
                return;
            }
            else if (tag === -1) {
                await interaction.editReply({ content: `Could not find tag: ${tagName}` });
            }
            else {
                await interaction.editReply({ content: `There was an error while removing the tag: ${tagName}` });
            }
        }
        catch (error) {
            console.error(error);
            await interaction.editReply({ content: "There was an error while removing the tag." });
        }
    },
};