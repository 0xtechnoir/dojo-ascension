#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/..

# Check the script argument for the mode
mode=${1:-dev} # default to 'dev' if no argument is provided

# Use different manifest file based on the mode
if [ "$mode" = "release" ]; then
    manifest_file="./target/release/manifest.json"
    export RPC_URL="https://api.cartridge.gg/x/ascension-dojo/katana";
else
    manifest_file="./target/dev/manifest.json"
    export RPC_URL="http://localhost:5050";
fi

export WORLD_ADDRESS=$(cat ./target/dev/manifest.json | jq -r '.world.address')
export ACTIONS_ADDRESS=$(cat ./target/dev/manifest.json | jq -r '.contracts[] | select(.name == "dojo_examples::actions::actions" ).address')

echo "---------------------------------------------------------------------------"
echo world : $WORLD_ADDRESS 
echo " "
echo actions : $ACTIONS_ADDRESS
echo "---------------------------------------------------------------------------"

# enable system -> component authorizations
COMPONENTS=("GameData" "PlayerAtPosition" "PlayerAddress" "PlayerId" "InGame" "Position" "Moves" "Square" "Health" "ActionPoint" "VotingPoint" "Username" "LastActionPointClaim" "LastVotingPointClaim" "ClaimInterval" "Player" "Alive" "Range" "GameSession")

for component in ${COMPONENTS[@]}; do
    sozo auth writer $component $ACTIONS_ADDRESS --world $WORLD_ADDRESS --rpc-url $RPC_URL
    sleep 1
done

echo "default_auth script execution complete."