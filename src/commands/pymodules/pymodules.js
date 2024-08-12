
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
        let url = "";
        if (server === 'Tommy') {
            url = 'https://krydos.heliohost.org/pyinfo/info';
        }
        else if (server === 'Johnny') {
            url = 'https://notjohnnytamale.helioho.st/modules';
        }
        try {
            const html = await fetch(url + `${version}.py`);
            const text = await html.text();
            if (text.length === 0) {
                await interaction.editReply(`Could not find information on version: ${version}`);
                return;
            }
            await interaction.editReply(`\`\`\`${text}\`\`\``);
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