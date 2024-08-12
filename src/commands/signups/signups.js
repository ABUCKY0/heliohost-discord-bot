const { SlashCommandBuilder, EmbedBuilder, time, TimestampStyles} = require('discord.js');
const fetch = require('node-fetch');
const { FetchError } = require('node-fetch');
const { data } = require('../statuscheck/server-status');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('signups')
    .setDescription('Checks the status of a user\'s account.'),
    async execute(interaction) {
        // "[Signups](https://heliohost.org/signup/) will reset in: **{time until utc}**"
        // Tommy        Johnny      Ricky
        // Closed       Closed      Closed
        await interaction.deferReply();

        const now = new Date();
        const midnightUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));

        /*
        Tommy: 2
        Johnny: 9
        Ricky: 1
        */
        let url = "https://heliohost.org/assets/monitor.php?plan=";
        let response;
        // 0 if closed, 1 if open
        try {
            johnnyResponse = await fetch(`${url}9`, { timeout: 5000 }) ? "Closed" : "Open";
        }
        catch (error) {
            interaction.followUp("An error occured while checking if Johnny is open.");
            console.error(error);
        }
        try {
            tommyResponse = await fetch(`${url}2`, { timeout: 5000 }) ? "Closed" : "Open";
        }
        catch (error) {
            interaction.followUp("An error occured while checking if Tommy is open.");
            console.error(error);
        }
        try {
            rickyResponse = await fetch(`${url}1`, { timeout: 5000 }) ? "Closed" : "Open";
        }
        catch (error) {
            interaction.followUp("An error occured while checking if Ricky is open.");
            console.error(error);
        }
        
        let embed = new EmbedBuilder()
            .setDescription(`Signups will reset in: ` + time(midnightUTC, TimestampStyles.RelativeTime) )
            .addFields(
                { name: 'Tommy', value: tommyResponse, inline: true },
                { name: 'Johnny', value: johnnyResponse, inline: true },
                { name: 'Ricky', value: rickyResponse, inline: true }
            )
        interaction.followUp({ embeds: [embed] });
    }
};