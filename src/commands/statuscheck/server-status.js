const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const fetch = require('node-fetch');
const { FetchError } = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-status')
        .setDescription('Replies with the server status!')
        .addStringOption(option =>
            option.setName('server')
                .setDescription('Checks the uptime status of a given server.')
                .setRequired(true)
                .addChoices(
                    { name: 'Johnny', value: 'Johnny' },
                    { name: 'Tommy', value: 'Tommy' },
                    { name: 'Morty', value: 'Morty' },
                    { name: 'Lily', value: 'Lily' },
                    { name: 'Main Website', value: 'Main Website' },
                    { name: 'Forums', value: 'Forums' },
                )),

    async execute(interaction) {
        await interaction.deferReply();
        try {
            let uptime_url = `https://heliohost.org/load/load_${interaction.options.getString('server').toLowerCase()}.html`;
            let status = "";
            let responseCode = 0;
            let load = 0.00;
            let url = "";
            switch (interaction.options.getString('server')) {
                case 'Johnny':
                    url = "https://johnny.heliohost.org/";
                    break;
                case 'Tommy':
                    url = "https://tommy2.heliohost.org/";
                    break;
                case 'Morty':
                    url = "https://morty.heliohost.org/";
                    break;
                case 'Lily':
                    url = "https://lily.heliohost.org/";
                    break;
                case 'Main Website':
                    url = "https://heliohost.org/";
                    break;
                case 'Forums':
                    url = "https://www.helionet.org/";
                    break;
            }
            let response;
            try {
                response = await fetch(url, { timeout: 5000 });
            }
            catch (error) {
                if (error instanceof FetchError) {
                    status = "DOWN";
                    responseCode = "N/A";
                }
            }
            let ghResponse;

            try {
                if (interaction.options.getString('server') == 'Main Website') {
                    ghResponse = await fetch(`https://raw.githubusercontent.com/HelioNetworks/status/master/api/helio-host/uptime.json`, { timeout: 5000 });
                }
                else {
                    ghResponse = await fetch(`https://raw.githubusercontent.com/HelioNetworks/status/master/api/${interaction.options.getString('server').toLowerCase()}/uptime.json`, { timeout: 5000 });
                }
            }
            catch (error) {
                interaction.followUp("An Error Occured while trying to contact GitHub for the uptime. Check the logs for more information.");
                console.error(error);
                return;
            }
            let loadResponse;
            try {
                loadResponse = await fetch(uptime_url, { timeout: 5000 });
                load = await loadResponse.text();


                responseCode = response.status;
            }
            catch (error) {
                if (error instanceof FetchError) {
                    load = "N/A";
                }
            }


            let body = "";
            body += `Response Code: ${responseCode}\n`;

            if (interaction.options.getString('server') != 'Main Website' && interaction.options.getString('server') != 'Forums') {
                body += `Load: ${load.replace("\n", "")}\n`;
            }
            let ghResponseBody = await ghResponse.json();
            body += `Uptime: ${ghResponseBody["message"]}\n`;
            let color;
            switch (ghResponseBody["color"]) {
                case "brightgreen":
                    color = "#66ff00";
                    break;
                case "green":
                    color = "#00FF00";
                    break;
                case "yellowgreen":
                    color = "#ADFF2F";
                    break;
                case "yellow":
                    color = "#FFFF00";
                    break;
                case "orange":
                    color = "#FFA500";
                    break;
                case "red":
                    color = "#FF0000";
                    break;

            }

            if (responseCode > 199 && responseCode < 300) {
                status = "UP";
            }
            else {
                status = "DOWN";
            }
            let embed = new EmbedBuilder()
                .setTitle(`${interaction.options.getString('server')} is ${status}`)
                .setTimestamp()
                .setColor(color)
                .setAuthor({ name: "Server Status", iconURL: "https://heliohost.org/images/favicon.ico" })
                .setColor(color)
                .addFields(
                    { name: " ", value: body }
                );

            interaction.followUp({ embeds: [embed] });
        }
        catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            }
            else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    },
};