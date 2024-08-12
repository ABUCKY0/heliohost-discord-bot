const { config } = require('../config.js');
module.exports = {
    checkAuth: function (interaction) {
        try {
            const invokedUser = interaction.user.id;

            // Role ids
            for (const role of config.auth.role_ids) {
                if (interaction.member.roles.cache.some(r => r.id === role)) {
                    return true;
                }
            }

            // Role names
            for (const role of config.auth.role_names) {
                if (interaction.member.roles.cache.some(r => r.name === role)) {
                    return true;
                }
            }

            // User ids
            for (const user of config.auth.users) {
                if (invokedUser === user) {
                    return true;
                }
            }

            return false;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
}