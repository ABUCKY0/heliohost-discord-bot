const { MessageReaction, User, Events } = require('discord.js');
module.exports = {
  name: Events.MessageReactionAdd,
  async execute(reaction, user) {
    if (user.bot) return;
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        console.error('Error fetching the message:', error);
        return;
      }
    }

    if (reaction.emoji.name === '❌') {
      if (reaction.message.author.id === reaction.client.user.id) {
        reaction.message.delete()
          .catch(console.error);
        return;
      }
    }
  },
};