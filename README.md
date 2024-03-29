<img src="https://user-images.githubusercontent.com/4752441/204310522-999660e8-9a14-4c7e-952e-6d5e9451f9d5.png" width=50% height=50%>

# Subgraph Sync Notifier

A super simple daemon which polls the status endpoint of a [graph-node](https://github.com/graphprotocol/graph-node) and sends a Telegram message when there are changes detected:

- New Subgraph version is added
- Subgraph sync status changes eg sync false -> true

## Config

- ENDPOINT - graph-node status endpoint
- TG_TOKEN - Telegram bot token from the [BotFather](https://t.me/BotFather)
- TG_CHAT - chat id to send messages to
- SLEEP - time to wait after a check

## Docker

Daemon is auto-published to [DockerHub](https://hub.docker.com/r/kolyasapphire/subgraph-sync-notifier).

```bash
docker pull kolyasapphire/subgraph-sync-notifier
```
