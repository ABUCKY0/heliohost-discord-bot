const config = require('../config.js');

module.exports = {
    checkAuth: function (interaction) {
        const invokedUser = interaction.user.id;

        // Check if the user has one of the roles defined in config.auth.roles
        if (interaction.member.roles.cache.some(role => config.auth.role_ids.includes(role.id)) || config.auth.users.includes(invokedUser)) {
            return true;
        }

        return false ;
    }
}``