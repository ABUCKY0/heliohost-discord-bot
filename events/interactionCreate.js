const { Events } = require('discord.js');
const {sequelize, addTag, updateTag} = require("../database/database.js");
module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {

            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        }
        else if (interaction.isModalSubmit()) {
            const modalID = interaction.customId;
            console.log(modalID);
            switch (modalID) {
                case "AddTagModal":
                    await interaction.deferReply();
                    try {
                    // At this point, I need to add the inputted tag to the database
                        const tagName = interaction.fields.getTextInputValue("input_tagname") || "";
                        const tagBody = interaction.fields.getTextInputValue("input_tagbody") || "";
                        const tagReturnValue = await addTag(tagName, tagBody);
                        console.log(`Tag Return Value ${tagReturnValue}`);
                        if (tagReturnValue == 0) {
                            await interaction.followUp(`Added "${tagName}" to database`);
                        }
                        else if (tagReturnValue == -1) {
                            await interaction.followUp(`Tag Already Exists. Try editing it or removing it instead.`);
                        }
                        else {
                            await interaction.followUp({ content: 'There was an error while adding the tag to the database.'});
                        }
                    }
                    catch (error){
                        console.error(error);
                        await interaction.followUp({ content: 'There was an error while adding the tag to the database.'});
                    }
                    break;
                case "EditTagModal":
                    await interaction.deferReply();
                    try {
                        // At this point, I need to update the inputted tag in the database
                        const tagName = interaction.fields.getTextInputValue("input_tagname") || "";
                        const tagBody = interaction.fields.getTextInputValue("input_tagbody") || "";
                        const oldTagName = interaction.fields.getTextInputValue("oldtagname") || "";
                        const tagReturnValue = await updateTag(oldTagName, tagName, tagBody);
                        console.log(`Tag Return Value ${tagReturnValue}`);
                        if (tagReturnValue == 0) {
                            await interaction.followUp(`Updated "${tagName}" in the database`);
                        }
                        else if (tagReturnValue == -1) {
                            await interaction.followUp(`Tag does not exist. Try adding it instead.`);
                        }
                        else {
                            await interaction.followUp({ content: 'There was an error while updating the tag in the database.'});
                        }
                    }
                    catch (error){
                        console.error(error);
                        await interaction.followUp({ content: 'There was an error while updating the tag in the database.'});
                    }
                    break;
                default:
                    await interaction.reply("I couldn't find a matching handler for the modal.");
            }
        }
	},
};