# pluto-core

Pluto is a crypto arbitrage bot

# Create new func

func new

# Update settings (execute on CMD)

az login
func azure functionapp fetch-app-settings pluto-core

# Publish

npm run build:production
func azure functionapp publish pluto-core
