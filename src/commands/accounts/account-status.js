const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { FetchError } = require('node-fetch');
const { data } = require('../statuscheck/server-status');
const { JSDOM } = require('jsdom');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('account-status')
        .setDescription('Checks the status of a user\'s account.')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('The username to check.')
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();
        const url = "https://heliohost.org/status?u=" + interaction.options.getString('username');
        let response;
        try {
            response = await fetch(url);
        }
        catch (error) {
            console.error(error);
        }

        const dom = new JSDOM(await response.text());
        const text = dom.window.document.querySelector("p").textContent;
        await interaction.followUp(text);
    }
}
