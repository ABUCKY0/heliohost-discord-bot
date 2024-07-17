const { Events } = require('discord.js');
const { manageTags, manageWiki, DBManagementActions, Status } = require("../database/database.js");
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        try {
            if (interaction.isModalSubmit()) {
                const modalID = interaction.customId;
                console.log(modalID);
                switch (modalID) {
                    case "AddTagModal":
                        await interaction.deferReply();
                        try {
                            // At this point, I need to add the inputted tag to the database
                            const tagName = interaction.fields.getTextInputValue("input_tagname") || "";
                            const tagBody = interaction.fields.getTextInputValue("input_tagbody") || "";
                            const tagReturnValue = await manageTags(DBManagementActions.ADD, tagName, tagBody);
                            console.log(`Tag Return Value ${tagReturnValue}`);
                            if (tagReturnValue == Status.SUCCESS) {
                                await interaction.followUp(`Added "${tagName}" to database`);
                            }
                            else if (tagReturnValue == Status.FAIL) {
                                await interaction.followUp(`Tag Already Exists. Try editing it or removing it instead.`);
                            }
                            else {
                                await interaction.followUp({ content: 'There was an error while adding the tag to the database.' });
                            }
                        }
                        catch (error) {
                            console.error(error);
                            await interaction.followUp({ content: 'There was an error while adding the tag to the database.' });
                        }
                        break;
                    case "EditTagModal":
                        await interaction.deferReply();
                        try {
                            // At this point, I need to update the inputted tag in the database
                            const tagName = interaction.fields.getTextInputValue("input_tagname") || "";
                            const tagBody = interaction.fields.getTextInputValue("input_tagbody") || "";
                            const oldTagName = interaction.fields.getTextInputValue("oldtagname") || "";
                            const tagReturnValue = await manageTags(DBManagementActions.EDIT, oldTagName, tagName, tagBody);
                            console.log(`Tag Return Value ${tagReturnValue}`);
                            if (tagReturnValue == Status.SUCCESS) {
                                await interaction.followUp(`Updated "${tagName}" in the database`);
                            }
                            else if (tagReturnValue == Status.FAIL) {
                                await interaction.followUp(`Tag does not exist. Try adding it instead.`);
                            }
                            else {
                                await interaction.followUp({ content: 'There was an error while updating the tag in the database.' });
                            }
                        }
                        catch (error) {
                            console.error(error);
                            await interaction.followUp({ content: 'There was an error while updating the tag in the database.' });
                        }
                        break;

                    
                    /* -------------------------
                        __      _____ _  _____  
                        \ \    / /_ _| |/ /_ _| 
                        \ \/\/ / | || ' < | |  
                        \_/\_/ |___|_|\_\___| 
                       -------------------------
                    */     
                       case "AddArticleModal":
                        await interaction.deferReply();
                        try {
                            // At this point, I need to add the inputted article to the database
                            const articleName = interaction.fields.getTextInputValue("input_articlename") || "";
                            const articleBody = interaction.fields.getTextInputValue("input_articlebody") || "";
                            const articleReturnValue = await manageWiki(DBManagementActions.ADD, articleName, articleBody);
                            console.log(`Article Return Value ${articleReturnValue}`);
                            if (articleReturnValue == Status.SUCCESS) {
                                await interaction.followUp(`Added "${articleName}" to database`);
                            }
                            else if (articleReturnValue == Status.FAIL) {
                                await interaction.followUp(`Article Already Exists. Try editing it or removing it instead.`);
                            }
                            else {
                                await interaction.followUp({ content: 'There was an error while adding the article to the database.' });
                            }
                        }
                        catch (error) {
                            console.error(error);
                            await interaction.followUp({ content: 'There was an error while adding the article to the database.' });
                        }
                        break;
                    case "EditArticleModal":
                        await interaction.deferReply();
                        try {
                            // At this point, I need to update the inputted tag in the database
                            const articleName = interaction.fields.getTextInputValue("input_articlename") || "";
                            const articleBody = interaction.fields.getTextInputValue("input_articlebody") || "";
                            const oldArticleName = interaction.fields.getTextInputValue("oldArticleName") || "";
                            const articleReturnValue = await manageWiki(DBManagementActions.EDIT, oldArticleName, articleName, articleBody);
                            console.log(`Article Return Value ${articleReturnValue}`);
                            if (articleReturnValue == Status.SUCCESS) {
                                await interaction.followUp(`Updated "${articleName}" in the database`);
                            }
                            else if (articleReturnValue == Status.FAIL) {
                                await interaction.followUp(`Article does not exist. Try adding it instead. It's also possible that you changed the old name.`);
                            }
                            else {
                                await interaction.followUp({ content: 'There was an error while updating the tag in the database.' });
                            }
                        }
                        catch (error) {
                            console.error(error);
                            await interaction.followUp({ content: 'There was an error while updating the article in the database.' });
                        }
                        break;

                    default:
                        await interaction.reply("I couldn't find a matching handler for the modal.");
                }
            }
            else if (interaction.isAutocomplete()) {
                const command = interaction.client.commands.get(interaction.commandName);
                
                if (!command) {
                    console.error(`No command matching ${interaction.commandName} was found.`);
                    return;
                }
        
                try {
                    await command.autocomplete(interaction);
                } catch (error) {
                    console.error(error);
                }
            }
        } catch {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: "There was an error while processing your interaction.", ephemeral: true });
            }
            else {
                await interaction.reply({ content: "There was an error while processing your interaction.", ephemeral: true });
            }

        }
    },
};