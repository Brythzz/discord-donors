## Creating a Discord application

You'll first need a [Discord app](https://discord.com/developers/applications) with the following permissions:
- `bot` with the `Use Slash Command` permission
- `application.commands` scope

> Permissions can be configured by clicking on the `OAuth2` tab and using the `URL Generator`

## Creating a Cloudflare Worker

Next, you'll need to create a Cloudflare Worker
- Visit the [Cloudflare dashboard](https://dash.cloudflare.com)
- Click on the `Workers` tab and create a new service with the name `discord-donors`
- Install the [Wrangler CLI](https://developers.cloudflare.com/workers/cli-wrangler/install-update) and set it up

### Storing secrets

The app needs access to credentials from the different platforms. Those can be added to Cloudflare using Wrangler:
```
$ wrangler secret put DISCORD_PUBLIC_KEY
$ wrangler secret put DISCORD_TOKEN
$ wrangler secret put DONOR_ROLE_ID
$ wrangler secret put GUILD_ID

$ wrangler secret put FOXY_CLIENT_ID
$ wrangler secret put FOXY_CLIENT_SECRET
$ wrangler secret put FOXY_REFRESH_TOKEN
$ wrangler secret put FOXY_STORE_ID

$ wrangler secret put PAYPAL_CLIENT_ID
$ wrangler secret put PAYPAL_SECRET
```

### Getting the credentials

#### Discord
On the [Developer Portal](https://discord.com/developers/applications), click your application and copy its `Public Key`.
The `Bot Token` can be copied from the `Bot` tab.

#### Foxycart
On the [Admin Page](https://admin.foxycart.com), click the `integrations` tab and `Create Integration`. A new `client_id`, `client_secret` and `refresh_token` will be generated.

#### Paypal
On the [Developer Dashboard](https://developer.paypal.com/dashboard), click the `Apps & Credentials` tab and click `Create App`. To create live credentials, you will need a Business Account.

### Deployment
> We now need to register the Discord slash command and push the code to Cloudflare
```
$ npm i
$ DISCORD_TOKEN=<token> CLIENT_ID=<discord_client_id> GUILD_ID=<discord_server_id> node ./src/register.js
$ wrangler publish
```
