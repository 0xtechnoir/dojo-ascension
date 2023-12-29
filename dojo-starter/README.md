# Ascension

## Background
blah blah

### Deploying katana and torii with Slot
```
curl -L https://slot.cartridge.sh | bash
slotup
slot auth login
# For old auth credentials debug:
rm ~/Library/Application\ Support/slot/credentials.json

# Create and manage deployments
slot deployments create ascension-dojo katana

# Retrieve and save credentials
slot deployments logs ascension-dojo katana -f

# switch environments in Scarb.toml
# update urls in .env.production
# populate account_address and private_key (from deployment logs above)

# Build and migrate releases
sozo --release build
sozo --release migrate

# Set up torii and connect to the world
slot deployments create ascension-dojo torii --rpc https://api.cartridge.gg/x/ascension-dojo/katana --world 0x33ac2f528bb97cc7b79148fd1756dc368be0e95d391d8c6d6473ecb60b4560e --start-block 1

# Update authentication for the release
./scripts/default_auth.sh release
```
### Deploying client with Vercel

