# Tags Bot

A Tags bot created for the non-profit, [HelioNetworks](https://github.com/helionetworks), who created and runs [HelioHost](https://heliohost.org)

# Setup

- Clone this repository
- Run `npm install --omit=dev` to install all non-dev dependencies, or remove the `--omit=dev` portion to install `eslint` in a development environment.
- Run `npm start` to start the bot. This will create config.js from config.example.js, then ask you to fill that out. It won't verify if all of config.js was filled out properly though, it only checks if the file exists.
- Run `npm run commands` to register all commands present in the `/commands` directory.
- Finally, re-run `npm start` to start the bot.


## Commands:

- `/add` Adds a tag to the Database (Modal)
- `/get <name>` Gets a tag from the database
- `/remove <name>` Removes a tag from the Databse
- `/update <name>` Updates a tag in the database (Modal)
- `/list` Lists all tags in the database

### Additional Commands
> These (besides `/ping`) will likley be removed, since they were initally created so I could get used to working with discord.js
- `/ping` Shows the ping of the bot.
- `/about` Shows information about the bot.
- `/server` Shows information about the server.
- `/user` Shows information about the user.


# Other notes
- Automatically creates `config.js` from `config.example.js`
- `register-interactions.js` Registers the slash commands. This can also be ran with `npm run commands`
- `config.js` has a version that must match the version at the top of `bot.js` to start the bot. This ensures any errors caused by an out of date config.js won't appear.
- The bot doesn't verify the contents of `config.js`, only the version number and wether it exists or not. 

## Contributing
Contributions are welcome, but please follow [GitHub's Community Guidelines](https://docs.github.com/en/site-policy/github-terms/github-community-guidelines), [GitHub's Code of Conduct](https://docs.github.com/en/site-policy/github-terms/github-community-code-of-conduct), [Our Code of Conduct](CODE-OF-CONDUCT.md), and [CONTRIBUTING.md](CONTRIBUTING.md)

Please report Security Issues using the [Security tab on GitHub](https://github.com/ABUCKY0/HelioHost-Tags-Bot/security)