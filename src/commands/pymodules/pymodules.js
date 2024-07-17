
const { SlashCommandBuilder, ModalSubmitFields, } = require('discord.js');
const { autocomplete } = require('../wiki/wiki');

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
            option.setName('module')
                .setDescription('What module you want to get information on.')
                .setRequired(true)
                .setChoices(
                    { name: 'Python 2.7', value: 'Python 2.7' },
                    { name: 'Python 3.6', value: 'Python 3.6' },
                    { name: 'Python 3.10', value: 'Python 3.10' }
                )
        ),
    async execute(interaction) {
        const server = interaction.options.getString('server');
        const module = interaction.options.getString('module');
        if (server === "Tommy") {
            if (module === "Python 2.7") {
                await interaction.reply("https://krydos.heliohost.org/pyinfo/info2.7.py")
            }
            if (module === "Python 3.6") {
                await interaction.reply("https://krydos.heliohost.org/pyinfo/info3.6.py")
            }
            if (module === "Python 3.10") {
                await interaction.reply("https://krydos.heliohost.org/pyinfo/info3.10.py")
            }

        }
        else if (server === "Johnny") {
            if (module === "Python 2.7") {
                await interaction.reply("https://krydos2.heliohost.org/pyinfo/info2.7.py")
            }
            if (module === "Python 3.6") {
                await interaction.reply("https://krydos2.heliohost.org/pyinfo/info3.6.py")
            }
            if (module === "Python 3.10") {
                await interaction.reply("https://krydos2.heliohost.org/pyinfo/info3.10.py")
            }
        }
    }
}