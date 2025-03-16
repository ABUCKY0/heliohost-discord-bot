const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const { manageWiki, DBManagementActions } = require('../../database/database.js');
const fetch = require('node-fetch');
const wtf = require('wtf_wikipedia');
let cachedCategories = null;
let cachedArticles = null;
let cachedSections = {};
let cacheTimestamp = 0;
const CACHE_DURATION = 60 * 1000; // 1 minute

wtf.extend(require('wtf-plugin-markdown'));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wiki')
    .setDescription('Wiki Article Ref Management')
    .addStringOption(option =>
      option.setName('category')
        .setDescription('The name of the category.')
        .setRequired(true)
        .setAutocomplete(true)
    ).addStringOption(option =>
      option.setName('article')
        .setDescription('The name of the article.')
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply();
      const category = interaction.options.getString('category');
      const article = interaction.options.getString('article');
      let data = null;
      if (!cachedSections[article] || Date.now() - cachedSections[article].timestamp > CACHE_DURATION) {
        const url = `https://wiki.helionet.org/api.php?action=parse&page=${encodeURIComponent(article)}&prop=sections&format=json`;
        const response = await fetch(url);
        data = await response.json();
        cachedSections[article] = {
          sections: data.parse.sections.map(section => ({
            Title: section.line,
            Anchor: section.anchor,
            Page: section.fromtitle
          })),
          timestamp: Date.now()
        };
      }

      const sections = cachedSections[article].sections.map(section => ({
        label: section.Title,
        value: section.Title,
        page: section.Page
      }));
      // Add link section to the select menu
      console.log();
      sections.push({
        label: 'Link to article',
        value: `link:${sections[0].page}`,
      });

      const row = new ActionRowBuilder()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId(`select-heading:${article}`)
            .setPlaceholder('Select a heading')
            .addOptions(sections)
        );

      await interaction.editReply({ content: 'Select a heading to display:', components: [row] });
    } catch (error) {
      console.error(error);
      await interaction.editReply({ content: 'An error occurred while fetching the sections.', ephemeral: true });
    }
  },
  async autocomplete(interaction) {
    try {
      const focusedOption = interaction.options.getFocused(true);
      const now = Date.now();

      if (focusedOption.name === 'category') {
        if (!cachedCategories || now - cacheTimestamp > CACHE_DURATION) {
          // const url = "https://wikipedia.org/w/api.php?action=query&list=allcategories&aclimit=100&format=json";
          const url = `https://wiki.helionet.org/api.php?action=query&list=allcategories&aclimit=1000&format=json`;
          const response = await fetch(url);
          const data = await response.json();
          cachedCategories = data.query.allcategories.map(category => category['*']);
          cacheTimestamp = now;
        }
        const filtered = cachedCategories.filter(choice =>
          choice.toLowerCase().startsWith(focusedOption.value.toLowerCase())
        );
        // Limit the number of choices to 25
        if (filtered.length > 25) {
          filtered.splice(25);
        }

        await interaction.respond(
          filtered.map(choice => ({ name: choice, value: choice })),
        );
        // Reset cachedArticles when category changes
        cachedArticles = null;
      } else if (focusedOption.name === 'article') {
        const category = interaction.options.getString('category');
        if (!cachedArticles || now - cacheTimestamp > CACHE_DURATION) {
          // const url = `https://wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:${encodeURIComponent(category)}&cmlimit=100&format=json`;
          const url = `https://wiki.helionet.org/api.php?action=query&list=categorymembers&cmtitle=Category:${encodeURIComponent(category)}&cmlimit=25&format=json`;
          const response = await fetch(url);
          const data = await response.json();
          cachedArticles = data.query.categorymembers.map(article => article.title);
          cacheTimestamp = now;
        }
        const filtered = cachedArticles.filter(choice =>
          choice.toLowerCase().startsWith(focusedOption.value.toLowerCase())
        );
        // Limit the number of choices to 25
        if (filtered.length > 25) {
          filtered.splice(25);
        }
        await interaction.respond(
          filtered.map(choice => ({ name: choice, value: choice })),
        );
      }
    } catch (error) {
      console.error(error);
    }
  },
  handleSelectMenu: async (interaction) => {
    if (interaction.customId.startsWith('select-heading:')) {
      const article = interaction.customId.split(':')[1];
      const heading = interaction.values[0];
      const pageTitle = heading.split(':')[1];
      if (heading.startsWith('link:')) {
        const articleLink = `https://wiki.helionet.org/${encodeURIComponent(pageTitle)}`;
        // Recreate the select menu
        const sections = cachedSections[article].sections.map(section => ({
          label: section.Title,
          value: section.Title
        }));
        // Add link section to the select menu
        sections.push({
          label: 'Link to article',
          value: `link:${pageTitle}`
        });

        const row = new ActionRowBuilder()
          .addComponents(
            new StringSelectMenuBuilder()
              .setCustomId(`select-heading:${article}`)
              .setPlaceholder('Select a heading')
              .addOptions(sections)
          );
        await interaction.update({embeds: [], content: `Here is the link to the article: ${articleLink}`, components: [row], ephemeral: true });
        return;
      }

      const sectionIndex = cachedSections[article].sections.findIndex(section => section.Title.toLowerCase() === heading.toLowerCase());
      if (sectionIndex === -1) {
        await interaction.update({ content: `Section "${heading}" not found in article "${article}".`, components: [], ephemeral: true });
        return;
      }

      const url = `https://wiki.helionet.org/api.php?action=parse&page=${encodeURIComponent(article)}&prop=wikitext&section=${sectionIndex + 1}&format=json`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.error) {
        await interaction.update({ content: `Error: ${data.error.info}`, components: [], ephemeral: true });
      } else {
        let sectionText = data.parse.wikitext['*'];
        const doc = wtf(sectionText);
        const text = doc.markdown();
        const anchor = cachedSections[article].sections[sectionIndex].Anchor;
        const textCutDown = text.slice(0, 4096);

        const embed = new EmbedBuilder()
          .setTitle(heading)
          .setDescription(textCutDown)
          .setURL(`https://wiki.helionet.org/${encodeURIComponent(article)}#${encodeURIComponent(anchor)}`);

        // Recreate the select menu
        const sections = cachedSections[article].sections.map(section => ({
          label: section.Title,
          value: section.Title,
          page: section.Page
        }));
        // Add link section to the select menu
        sections.push({
          label: 'Link to article',
          value: `link:${sections[0].page}`,
        });

        const row = new ActionRowBuilder()
          .addComponents(
            new StringSelectMenuBuilder()
              .setCustomId(`select-heading:${article}`)
              .setPlaceholder('Select a heading')
              .addOptions(sections)
          );
          

        await interaction.update({ content: "", embeds: [embed], components: [row], ephemeral: true });
      }
    }
  }
};