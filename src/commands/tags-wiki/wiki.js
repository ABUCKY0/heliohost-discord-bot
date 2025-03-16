const { SlashCommandBuilder } = require('discord.js');
const { checkAuth } = require('../../utility/authorization.js');
const { config } = require('../../config.js');
const { cmdWikiAdd } = require('./subcommands/add.js');
const { cmdWikiDelete } = require('./subcommands/delete.js');
const { cmdWikiEdit } = require('./subcommands/edit.js');
const { cmdWikiGet } = require('./subcommands/get.js');
const { cmdWikiList } = require('./subcommands/list.js');
const { manageWiki, DBManagementActions } = require('../../database/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tags-wiki')
        .setDescription('Wiki Article Ref Management')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a Wiki Article entry to the Database.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete an Article Entry from the Database.')
                .addStringOption(option =>
                    option.setName('article')
                        .setDescription('The name of the Article Entry to delete.')
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('edit')
                .setDescription('Edit an Article present in the Database.')
                .addStringOption(option =>
                    option.setName('article')
                        .setDescription('The name of the article to edit.')
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('get')
                .setDescription('Reference an artcle from the Database.')
                .addStringOption(option =>
                    option.setName('article')
                        .setDescription('The name of the article to get.')
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all Wiki Articles in the Database.')
        ),
    async execute(interaction) {
        switch (interaction.options.getSubcommand()) {
            case 'add':
                await cmdWikiAdd(interaction);
                break;
            case 'delete':
                await cmdWikiDelete(interaction);
                break;
            case 'edit':
                await cmdWikiEdit(interaction);
                break;
            case 'get':
                await cmdWikiGet(interaction);
                break;
            case 'list':
                await cmdWikiList(interaction);
                break;
            default:
                await interaction.reply({ content: "Invalid Subcommand.", ephemeral: true });
                break;
        }
    },
    async autocomplete(interaction) {
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
}