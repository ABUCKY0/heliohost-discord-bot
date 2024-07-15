// Moving Subcommands to their own files
// Description: Tag command to create, delete, edit, and view tags

const { SlashCommandBuilder } = require('discord.js');
const { checkAuth } = require('../../utility/authorization.js');
const { config } = require('../../config.js');
// import from ./tags/*.js

// Add, Delete, edit, Get, List
const { cmdTagAdd } = require('./subcommands/add.js');
const { cmdTagDelete } = require('./subcommands/delete.js');
const { cmdTagEdit } = require('./subcommands/edit.js');
const { cmdTagGet } = require('./subcommands/get.js');
const { cmdTagList } = require('./subcommands/list.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tag')
        .setDescription('Tag Management')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a Tag to the Database.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete a Tag from the Database.')
                .addStringOption(option =>
                    option.setName('tag')
                        .setDescription('The name of the Tag to delete.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('edit')
                .setDescription('Edit a Tag in the Database.')
                .addStringOption(option =>
                    option.setName('tag')
                        .setDescription('The name of the Tag to edit.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('get')
                .setDescription('View a Tag from the Database.')
                .addStringOption(option =>
                    option.setName('tag')
                        .setDescription('The name of the Tag to get.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all Tags in the Database.')
        ),
    async execute(interaction) {
        switch(interaction.options.getSubcommand()) {
            case 'add':
                await cmdTagAdd(interaction);
                break;
            case 'delete':
                await cmdTagDelete(interaction);
                break;
            case 'edit':
                await cmdTagEdit(interaction);
                break;
            case 'get':
                await cmdTagGet(interaction);
                break;
            case 'list':
                await cmdTagList(interaction);
                break;
            default:
                await interaction.reply({ content: "Invalid Subcommand.", ephemeral: true });
                break;
        }
    }
}