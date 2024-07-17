# HelioHost Bot

A Tags bot created by @ABUCKY0 for the non-profit, [HelioNetworks](https://github.com/helionetworks), who created and runs [HelioHost](https://heliohost.org)

# Setup

- Clone this repository
- Run `npm install --omit=dev` to install all non-dev dependencies, or remove the `--omit=dev` portion to install `eslint` in a development environment.
- Run `npm start` to start the bot. This will create config.js from config.example.js, then ask you to fill that out. It won't verify if all of config.js was filled out properly though, it only checks if the file exists.
- Run `npm run commands` to register all commands present in the `/commands` directory.
- Finally, re-run `npm start` to start the bot.


## Commands:
> Text wrapped in `<>` refrences a command that has input that isn't limited (i.e. Specific options only). whereas `[]` references a fixed list command.
- `/tag` Tag main command. Subcommands listed below:
  - `add` Create a new tag. 
  - `delete` Delete a tag from the DB. (Supports Autocomplete)
  - `get` Retreve a tag's content from the DB. (supports autocomplete)
  - `list` Lists all tags in the database.
  - `edit` Change the name or content of a tag.

- `/wiki` Wiki main command. Designed to contain excerpts from the HelioHost wiki. Subcommands listed below:
  - `add` Create a new wiki article. 
  - `delete <name>` Delete an article from the DB. (Supports Autocomplete)
  - `get <name>` Retreve an article's content from the DB. (supports autocomplete)
  - `list` Lists all articles in the database.
  - `edit <name>` Change the name or content of an article.

- `/pymodules [server] [version]` Links to the relevant python module page, for that version and server. 
- `/dns <domain (without protocol)> [record]` Gets the DNS records of a specified domain.
- `/sslcheck <url>` Checks the SSL configuration of a given website.
- `/statuscheck <url>` Checks wether a website is accessable by the bot, and what it's statuscode was during that request.
### Additional Commands
- `/ping` Shows the ping of the bot.


# Other notes
- Automatically creates `config.js` from `config.example.js`
- `register-interactions.js` Registers the slash commands. This can also be ran with `npm run commands`
- `config.js` has a version that must match the version at the top of `bot.js` to start the bot. This ensures any errors caused by an out of date config.js won't appear.
- The bot doesn't verify the contents of `config.js`, only the version number and wether it exists or not. 

## Contributing
Contributions are welcome, but please follow [GitHub's Community Guidelines](https://docs.github.com/en/site-policy/github-terms/github-community-guidelines), [GitHub's Code of Conduct](https://docs.github.com/en/site-policy/github-terms/github-community-code-of-conduct), [Our Code of Conduct](CODE-OF-CONDUCT.md), and [CONTRIBUTING.md](CONTRIBUTING.md)

Please report Security Issues using the [Security tab on GitHub](https://github.com/ABUCKY0/HelioHost-Tags-Bot/security)