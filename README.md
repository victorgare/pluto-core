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

# Service Principal Credentials
{
  "appId": "93fcb146-1037-4652-9e98-e6462e55b454",
  "displayName": "pluto-core",
  "name": "http://pluto-core",
  "password": "8771cd23-f741-4945-a55c-f5c4f1996ee2",
  "tenant": "75c8977e-ddae-45d2-b96b-cde7147bc106"
}