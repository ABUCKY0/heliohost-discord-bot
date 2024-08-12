const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const translate = require('@iamtraction/google-translate');
module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Translate to English')
        .setType(ApplicationCommandType.Message),

    async execute(interaction) {
        const text = interaction.targetMessage.content;
        console.log(text)
        const translatedText = await translate(text);
        console.log(translatedText);
        if (!translatedText) return await interaction.reply('There was an error while translating the text.');
        await interaction.reply(translatedText.text);
    }
}