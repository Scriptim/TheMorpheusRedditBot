# [u/TheMorpheusBot](https://reddit.com/u/TheMorpheusBot "Reddit")

**Bot for [r/TheMorpheusTuts](https://reddit.com/r/TheMorpheusTuts "Reddit") written in JavaScript**

## How to use

- **Install** all dependencies by running `npm install`
- **Start** the bot by running `node .`

### Credentials

This bot needs certain credentials to work properly. Create a `credentials.json` file with the following format.

    {
      "REDDIT_ID": "reddit client id",
      "REDDIT_SECRET": "reddit secret",
      "REDDIT_USER": "reddit user name",
      "REDDIT_PASS": "reddit password",
      "REDDIT_USER_AGENT": "reddit user agent",
      "REDDIT_SUBREDDIT": "subreddit name",
      "YOUTUBE_KEY": "google api key",
      "YOUTUBE_ID": "google api client id",
      "YOUTUBE_SECRET": "google api secret"
    }

If you develop a plugin, you don't have to worry about it. The credentials specified in `credentials.json` are used globally so that no plugin is responsible for any authorization.

### Disable logging to file

All logs are written to the console and to a `themorpheusbot.log` file by default. If you want to disable logging to the file, open `logger.js` and change the first line to `const logToFile = false`. The log file will still be created however there will be no output logged to it.

## GitHub Issues

You can use the [Issues Page](https://github.com/Scriptim/TheMorpheusRedditBot/issues "Issues") to

- point out a **bug**
- suggest **improvements** for the bot
- suggest ideas for **plugins** (*It is also recommended to open an issue if you implement the plugin yourself to start a discussion and get feedback and inspiration*)
- request **permissions** for your plugin (e. g. api keys, scopes, npm dependencies)

Plugin related issues should be opened on the issues page of the corresponding plugin repository.

## Contributing a plugin

To contribute you own plugin, follow the steps below.

1. **Fork** this repository and clone your fork
2. Create a new **branch** with `git checkout -b <branch>` (replace `<branch>` with your plugin name)
3. **Rebase** your branch with `git pull --rebase origin master`
4. **Push** your modifications to the `<branch>` branch from step 2 with `git push origin <branch>`
5. Create a **Pull Request** on GitHub

### Create plugin

Create a new directory in `plugins` with an `index.js` file. You can use `plugins/dummy/index.js` as template.

#### `name`

Give your plugin a descriptive name. This may differ from the name of the directory.

#### `author`

This should be your GitHub username.

#### `description`

Briefly describe the purpose of your plugin.

#### `interval`

Set an interval (in seconds) at which the plugin `run`s. If this property is less than or equal to 0, `run` is not executed at all. Note that the Reddit API is limited to 30 requests per minute. These should therefore be used sparingly.

#### `setup(api, logger)`

This function is called once at the very beginning, when the bot is started.

*For more information about the `api` and `logger` arguments see below*

#### `run(api, logger)`

This function is called in a loop at the specified `interval`. The loop starts after the setup for all plugins is finished.

*For more information about the `api` and `logger` arguments see below*

### `api`

This object provides api wrapper objects.

#### `api.reddit`

- [Snoowrap](https://not-an-aardvark.github.io/snoowrap/index.html "Snoowrap Documentation")
- [Reddit API](https://www.reddit.com/dev/api "Reddit API Documentation")

This property contains a `snoowrap` wrapper for the Reddit API. You should use `api.reddit.subreddit` instead of `api.reddit.getSubreddit('TheMorpheusTuts')` to reduce the number of api requests.

#### `api.youtube`

- [Google APIs](http://google.github.io/google-api-nodejs-client/ "Google APIs Documentation")
- [YouTube Data API v3](http://google.github.io/google-api-nodejs-client/classes/_apis_youtube_v3_.youtube.html "YouTube Data API v3 Documentation")

This property contains a wrapper for the YouTube Data API v3.

### `logger`

Each plugin is assigned a custom [`log4js`](https://github.com/log4js-node/log4js-node "log4js-node on GitHub") object (`logger`) that provides the following methods for logging.

- `logger.debug(message)` (Used to trace the cause of an error, e. g. by announcing error-prone actions or logging parameters)
- `logger.info(message)` (Used for messages that are addressed to the user)
- `logger.error(error)` (Used to log error objects; don't pass strings and always use this to log caught errors)
- `logger.fatal(error)` (Used for errors that cause the program to stop; this should never be used in plugin code)

### Language

All code, logging and documentation is in **English**. The **German** language is used for text that will be shown on Reddit as it addressed a German subreddit.

### Restrictions

You are in no way entitled to

- access files containing any kind of credentials such as `credentials.json` or `api/youtube_token.json` (all authentication is handled by particular scripts).
- log or pass any kind of credentials or not use them as intended.
