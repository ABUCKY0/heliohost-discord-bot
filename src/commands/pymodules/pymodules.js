
const { SlashCommandBuilder, ModalSubmitFields, } = require('discord.js');
const { autocomplete } = require('../wiki/wiki');
const fetch = require('node-fetch');
const { FetchError } = require('node-fetch');
const { JSDOM } = require('jsdom');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('pyinfo')
        .setDescription('Python Information')
        .addStringOption(option =>
            option.setName('server')
                .setDescription('What server you want to get the Python Modules for.')
                .setRequired(true)
                .setChoices(
                    { name: 'Tommy', value: 'Tommy' },
                    { name: 'Johnny', value: 'Johnny' }
                )
        )
        .addStringOption(option =>
            option.setName('version')
                .setDescription('What version you want to get information on.')
                .setRequired(true)
                .setAutocomplete(true)
        ),
    async execute(interaction) {
        
        await interaction.deferReply();
        const server = interaction.options.getString('server');
        const version = interaction.options.getString('version');
        // if version contains anything other than 3.x or 2.x or any alphabetical characters, return an error
        if (!version.match(/^[2-3]\.\d+$/)) {
            await interaction.editReply("Invalid version. Please enter a valid version.");
            return;
        }
        let url = "";
        if (server === 'Tommy') {
            url = 'https://krydos.heliohost.org/pyinfo/info';
        }
        else if (server === 'Johnny') {
            url = 'https://krydos2.heliohost.org/pyinfo/info';
        }
        try {
            interaction.editReply(`${url}${version}.py\nNote that the above link doesn't contain any downloads. Discord is just being dumb. It executes server-side and shows a normal HTML based webpage.`);
        } catch (error) {
            console.error(error);
            await interaction.editReply("An error occured while fetching the Python modules. Try again later, or see https://wiki.helionet.org/tutorials/python#modules");
        }

    },
    async autocomplete(interaction) {
        try {
            const focusedOption = interaction.options.getFocused(true);
            const server = interaction.options.getString('server');
            if (focusedOption.name === 'version') {
                if (server === 'Tommy') {
                    const tommyHtml = await fetch('https://krydos.heliohost.org/pyinfo');
                    const tommyText = await tommyHtml.text();
                    const tommyDom = new JSDOM(tommyText);
                    const tommyVersions = tommyDom.window.document.querySelector('body').textContent.split('\n')
                        .filter(version => version.startsWith('Python '))
                        .map(version => version.replace('Python ', '').trim());

                    const filtered = tommyVersions.filter(choice => choice.startsWith(focusedOption.value));
                    await interaction.respond(
                        filtered.map(choice => ({ name: choice, value: choice })),
                    );

                }
                else if (server === 'Johnny') {
                    const johnnyHtml = await fetch('https://krydos2.heliohost.org/pyinfo');
                    const johnnyText = await johnnyHtml.text();
                    const johnnyDom = new JSDOM(johnnyText);
                    const johnnyVersions = johnnyDom.window.document.querySelector('body').textContent.split('\n')
                        .filter(version => version.startsWith('Python '))
                        .map(version => version.replace('Python ', '').trim());

                    const filtered = johnnyVersions.filter(choice => choice.startsWith(focusedOption.value));
                    await interaction.respond(
                        filtered.map(choice => ({ name: choice, value: choice })),
                    );
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
}