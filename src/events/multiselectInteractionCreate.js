const { Events } = require('discord.js');
const { manageTags, manageWiki, DBManagementActions, Status } = require("../database/database.js");
const { handleSelectMenu } = require('../commands/wiki/wiki.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    try {
      if (interaction.isStringSelectMenu()) {
        if (interaction.customId.startsWith('select-heading:')) {
          await handleSelectMenu(interaction);
        } else {
          console.error(`No handler for customId ${interaction.customId} was found.`);
        }
      }
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: "There was an error while processing your interaction.", ephemeral: true });
      } else {
        await interaction.reply({ content: "There was an error while processing your interaction.", ephemeral: true });
      }
    }
  },
};