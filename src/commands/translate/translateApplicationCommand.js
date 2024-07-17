const translate = require('@iamtraction/google-translate');
const { SlashCommandBuilder } = require('discord.js');
const { autocomplete } = require('../wiki/wiki');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Translate a text to English.')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('The text to translate.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('language')
                .setDescription('The language to translate the text to.')
                .setRequired(false)
                .setAutocomplete(true)
        )
        .addStringOption(option =>
            option.setName('source')
                .setDescription('The language of the text to translate.')
                .setRequired(false)
                .setAutocomplete(true)
        ),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        const language = interaction.options.getString('language') || 'en';
        const source = interaction.options.getString('source') || 'auto';

        try {
            const translatedText = await translate(text, { to: language, from: source });
            if (!translatedText) return await interaction.reply('There was an error while translating the text.');
            await interaction.reply(translatedText.text);
        } catch (error) {
            console.error(error);
            await interaction.reply('There was an error while translating the text.');
        }
    },
    async autocomplete(interaction) {
        try {
            const options = [{ name: "Afrikaans", value: "af" },
            { name: "Albanian", value: "sq" },
            { name: "Amharic", value: "am" },
            { name: "Arabic", value: "ar" },
            { name: "Armenian", value: "hy" },
            { name: "Assamese", value: "as" },
            { name: "Aymara", value: "ay" },
            { name: "Azerbaijani", value: "az" },
            { name: "Bambara", value: "bm" },
            { name: "Basque", value: "eu" },
            { name: "Belarusian", value: "be" },
            { name: "Bengali", value: "bn" },
            { name: "Bhojpuri", value: "bho" },
            { name: "Bosnian", value: "bs" },
            { name: "Bulgarian", value: "bg" },
            { name: "Catalan", value: "ca" },
            { name: "Cebuano", value: "ceb" },
            { name: "Chinese (Simplified)", value: "zh-CN or zh (BCP-47)" },
            { name: "Chinese (Traditional)", value: "zh-TW (BCP-47)" },
            { name: "Corsican", value: "co" },
            { name: "Croatian", value: "hr" },
            { name: "Czech", value: "cs" },
            { name: "Danish", value: "da" },
            { name: "Dhivehi", value: "dv" },
            { name: "Dogri", value: "doi" },
            { name: "Dutch", value: "nl" },
            { name: "English", value: "en" },
            { name: "Esperanto", value: "eo" },
            { name: "Estonian", value: "et" },
            { name: "Ewe", value: "ee" },
            { name: "Filipino (Tagalog)", value: "fil" },
            { name: "Finnish", value: "fi" },
            { name: "French", value: "fr" },
            { name: "Frisian", value: "fy" },
            { name: "Galician", value: "gl" },
            { name: "Georgian", value: "ka" },
            { name: "German", value: "de" },
            { name: "Greek", value: "el" },
            { name: "Guarani", value: "gn" },
            { name: "Gujarati", value: "gu" },
            { name: "Haitian Creole", value: "ht" },
            { name: "Hausa", value: "ha" },
            { name: "Hawaiian", value: "haw" },
            { name: "Hebrew", value: "he or iw" },
            { name: "Hindi", value: "hi" },
            { name: "Hmong", value: "hmn" },
            { name: "Hungarian", value: "hu" },
            { name: "Icelandic", value: "is" },
            { name: "Igbo", value: "ig" },
            { name: "Ilocano", value: "ilo" },
            { name: "Indonesian", value: "id" },
            { name: "Irish", value: "ga" },
            { name: "Italian", value: "it" },
            { name: "Japanese", value: "ja" },
            { name: "Javanese", value: "jv or jw" },
            { name: "Kannada", value: "kn" },
            { name: "Kazakh", value: "kk" },
            { name: "Khmer", value: "km" },
            { name: "Kinyarwanda", value: "rw" },
            { name: "Konkani", value: "gom" },
            { name: "Korean", value: "ko" },
            { name: "Krio", value: "kri" },
            { name: "Kurdish", value: "ku" },
            { name: "Kurdish (Sorani)", value: "ckb" },
            { name: "Kyrgyz", value: "ky" },
            { name: "Lao", value: "lo" },
            { name: "Latin", value: "la" },
            { name: "Latvian", value: "lv" },
            { name: "Lingala", value: "ln" },
            { name: "Lithuanian", value: "lt" },
            { name: "Luganda", value: "lg" },
            { name: "Luxembourgish", value: "lb" },
            { name: "Macedonian", value: "mk" },
            { name: "Maithili", value: "mai" },
            { name: "Malagasy", value: "mg" },
            { name: "Malay", value: "ms" },
            { name: "Malayalam", value: "ml" },
            { name: "Maltese", value: "mt" },
            { name: "Maori", value: "mi" },
            { name: "Marathi", value: "mr" },
            { name: "Meiteilon (Manipuri)", value: "mni-Mtei" },
            { name: "Mizo", value: "lus" },
            { name: "Mongolian", value: "mn" },
            { name: "Myanmar (Burmese)", value: "my" },
            { name: "Nepali", value: "ne" },
            { name: "Norwegian", value: "no" },
            { name: "Nyanja (Chichewa)", value: "ny" },
            { name: "Odia (Oriya)", value: "or" },
            { name: "Oromo", value: "om" },
            { name: "Pashto", value: "ps" },
            { name: "Persian", value: "fa" },
            { name: "Polish", value: "pl" },
            { name: "Portuguese (Portugal, Brazil)", value: "pt" },
            { name: "Punjabi", value: "pa" },
            { name: "Quechua", value: "qu" },
            { name: "Romanian", value: "ro" },
            { name: "Russian", value: "ru" },
            { name: "Samoan", value: "sm" },
            { name: "Sanskrit", value: "sa" },
            { name: "Scots Gaelic", value: "gd" },
            { name: "Sepedi", value: "nso" },
            { name: "Serbian", value: "sr" },
            { name: "Sesotho", value: "st" },
            { name: "Shona", value: "sn" },
            { name: "Sindhi", value: "sd" },
            { name: "Sinhala (Sinhalese)", value: "si" },
            { name: "Slovak", value: "sk" },
            { name: "Slovenian", value: "sl" },
            { name: "Somali", value: "so" },
            { name: "Spanish", value: "es" },
            { name: "Sundanese", value: "su" },
            { name: "Swahili", value: "sw" },
            { name: "Swedish", value: "sv" },
            { name: "Tagalog (Filipino)", value: "tl" },
            { name: "Tajik", value: "tg" },
            { name: "Tamil", value: "ta" },
            { name: "Tatar", value: "tt" },
            { name: "Telugu", value: "te" },
            { name: "Thai", value: "th" },
            { name: "Tigrinya", value: "ti" },
            { name: "Tsonga", value: "ts" },
            { name: "Turkish", value: "tr" },
            { name: "Turkmen", value: "tk" },
            { name: "Twi (Akan)", value: "ak" },
            { name: "Ukrainian", value: "uk" },
            { name: "Urdu", value: "ur" },
            { name: "Uyghur", value: "ug" },
            { name: "Uzbek", value: "uz" },
            { name: "Vietnamese", value: "vi" },
            { name: "Welsh", value: "cy" },
            { name: "Xhosa", value: "xh" },
            { name: "Yiddish", value: "yi" },
            { name: "Yoruba", value: "yo" },
            { name: "Zulu", value: "zu" },
            ];

            const focusedOption = interaction.options.getFocused(true);
            if (focusedOption.name === 'language' || focusedOption.name === 'source') {
                const filtered = options.filter(option => option.name.startsWith(focusedOption.value));
                if (filtered.length > 25) {
                    filtered.splice(25);
                }
                await interaction.respond(
                    filtered.map(option => ({ name: option.name, value: option.value })),
                );
            }
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: "There was an error while processing your interaction.", ephemeral: true });
            }
            else {
                await interaction.reply({ content: "There was an error while processing your interaction.", ephemeral: true });
            }
        }
    }
}