const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { FetchError } = require('node-fetch');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('statuscheck')
        .setDescription('Check the status of a website.')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('The URL to check.')
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const url = interaction.options.getString('url');
        /*
        This command will do the following:

        1. Check if the URL is valid. (https)
        2. Check if the URL is reachable.
        */
        try {

            if (!url.startsWith('https://')) {
                await interaction.editReply({ content: 'Please include https:// before the url', ephemeral: false });
                return;
            }
            // https://stackoverflow.com/a/9284473
            const urlRegex = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i
            if (!urlRegex.test(url)) {
                await interaction.editReply({ content: 'Please enter a valid URL.', ephemeral: false });
                return;
            }
            const response = await fetch(url, { timeout: 5000 });


            const embed = new EmbedBuilder()
                .setTitle(`Status Check for ${url}`)
                .setColor('#0099ff')
                .addFields(
                    { name: 'Status', value: `${response.status}`, inline: true },
                    { name: 'Status Text', value: response.statusText, inline: true }
                );
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            if (error instanceof FetchError) {
                const failembed = new EmbedBuilder()
                    .setTitle(`Status Check for ${url}`)
                    .setColor('#ff0000')
                    .addFields(
                        {
                            name: "Could not reach the provided url. Please check the following:", value:
                                `- You typed the proper URL.
- The DNS settings for the website are properly setup, if you control it. This can be checked by running \`dig ${url}\` in a Terminal window.`, inline: true
                        }
                    )
                await interaction.editReply({ embeds: [failembed] });
                return;
            }
            console.error(error);
            await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
        }

    }
};