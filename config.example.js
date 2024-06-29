let config = {};
config.file = {};
config.file.version = "1.0.0"; // If the file format changes, this should be updated. The bot won't run if the version is behind.

// Database
config.database = {};
config.database.name = "";
config.database.username = "";
config.database.password = "";
config.database.uri = "";
config.database.port = -1;


// Bot
config.bot = {};
config.bot.token = "";
config.bot.id = "";
config.bot.version = "1.0.0";
// Server
config.server = {};
config.server.id = "";

// Authentication
// May be replaced with a database table in the future
config.auth = {};
config.auth.users = [''];
config.auth.role_ids = [''];
config.auth.role_names = [''];

// Export the config object
module.exports = { config };