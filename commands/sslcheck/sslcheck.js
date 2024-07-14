/**
 * Check SSL certificate of a website and respond with the information to discord
 */

const sslChecker = require('ssl-checker');
const { SlashCommandBuilder, AllowedMentionsTypes, ActionRow, Embed } = require('discord.js');
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const { checkAuth } = require('../../utility/authorization.js');
const { config } = require('../../config.js');
const { time, TimestampStyles } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('sslcheck')
        .setDescription('Check the SSL certificate of a website.')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('The URL to check.')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const url = interaction.options.getString('url');
            // Validate that the URL is valid
            if (!url.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)) {
                await interaction.reply({ content: "Invalid URL provided. Make sure to include https:// before the url name.", ephemeral: true });
                return;
            }
            const result = await sslChecker(url);
            console.log (result);
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`SSL Certificate for ${url}`)
                .addFields(
                    /**
                     * Response Example
{
  "daysRemaining": 90,
  "valid": true,
  "validFrom": "issue date",
  "validTo": "expiry date",
  "validFor": ["www.example.com", "example.com"]
}
                     */
                    { name: 'Valid', value: result.valid ? "Yes" : "No", inline: false },
                    { name: 'Days Remaining', value: `${result.daysRemaining}`, inline: true },
                    { name: 'Valid From', value: `${result.validFrom}`, inline: false },
                    { name: 'Valid Until', value: `${result.validTo}`, inline: true },
                    
                )
                .setTimestamp();
            await interaction.reply({ embeds: [embed] });
        }
        catch (error) {
            console.error(error);
            await interaction.reply({ content: "There was an error while checking the SSL certificate. Make sure you properly typed the URL, and it's accessable." });
        }
    }
};