let config = {};
config.file = {};
config.file.version = "1.0.1";             // If the file format changes, this should be updated. The bot won't run if the version doesn't match.

// Database
config.database = {};
config.database.name = "";                // Database name
config.database.username = "";            // Database username
config.database.password = "";            // Database password
config.database.uri = "";                 // Database URI (IP or domain)
config.database.port = 3306;              // Default MariaDB port
config.database.initialRetryDelay = 1000; // Initial delay in ms
config.database.maxRetries = 10;          // Maximum number of retries
config.database.retryBackoff = 1.5;       // Exponential backoff factor


// Bot
config.bot = {};
config.bot.token = "";                     // Discord Bot token
config.bot.id = "";                        // Discord Bot ID
// Server
config.server = {};
config.server.id = "";                     // Discord Server ID

// Authentication
// May be replaced with a database table in the future
config.auth = {};
config.auth.users = [''];
config.auth.role_ids = [''];
config.auth.role_names = [''];

// Export the config object
module.exports = { config };