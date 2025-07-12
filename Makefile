-include .env


all: clean remove install update build


# Clean the repo
clean  :; forge clean && forge build
# Remove modules
remove :; rm -rf .gitmodules && rm -rf .git/modules/* && rm -rf lib && touch .gitmodules && git add . && git commit -m "modules"

install :; forge install cyfrin/foundry-devops@0.2.2 && forge install foundry-rs/forge-std@v1.8.2 && forge install OpenZeppelin/openzeppelin-contracts-upgradeable@v5.3.0 && forge install OpenZeppelin/openzeppelin-contracts@v5.3.0 && forge install OpenZeppelin/openzeppelin-foundry-upgrades@v0.3.8 && forge install cyfrin/foundry-devops@0.0.11 && forge install smartcontractkit/chainlink-ccip && forge install smartcontractkit/chainlink-evm 



# Update Dependencies
update:; forge update

build:; forge build     

test-all :; forge clean && forge build && forge test -vvv
coverage :; forge clean && forge build && forge coverage

snapshot :; forge snapshot

format :; forge fmt
lint :; forge fmt --check && forge verify --check






deploy-amoy:; forge clean && forge build &&  forge script script/DeployMaven.s.sol:DeployMaven --rpc-url https://rpc-amoy.polygon.technology --private-key $(PRIVATE_KEY_59)  --broadcast -vvvv

deploy-bnb:; forge clean && forge build &&  forge script script/DeployMaven.s.sol:DeployMaven --rpc-url https://bsc-testnet.public.blastapi.io --private-key $(PRIVATE_KEY_59)  --broadcast -vvvv

verify-MUSD-amoy:;forge verify-contract $(MUSD_CONTRACT) src/TestMaven.sol:TestMaven --chain-id 80002 --verifier-api-key $(POLYGON_API_KEY) --verifier-url https://api-amoy.polygonscan.com/api 
verify-PROXY-amoy:; forge verify-contract $(PROXY_CONTRACT) lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol:ERC1967Proxy --chain-id 80002 --verifier-api-key $(POLYGON_API_KEY) --verifier-url https://api-amoy.polygonscan.com/api --constructor-args 000000000000000000000000992338cd6a11fe2bda153968d114825ec49f25b900000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000084f8c8765e0000000000000000000000001679dffe0f02ece842e503ec40922edc556f90650000000000000000000000003ff88b69d1762aa444c85c30c4b0b795f9c48b590000000000000000000000009c32fcb86bf0f4a1a8921a9fe46de3198bb884b20000000000000000000000000fd9e8d3af1aaee056eb9e802c3a762a667b190400000000000000000000000000000000000000000000000000000000

update-MUSD-amoy:; forge clean && forge build && forge script script/UpgradeMaven.s.sol:UpgradeMaven --rpc-url https://rpc-amoy.polygon.technology --private-key $(PRIVATE_KEY_59)  --broadcast -vvvv
verify-MUSD-v2-amoy:;forge verify-contract $(MUSD_CONTRACT_V2) src/TestMavenv2.sol:TestMavenv2 --chain-id 80002 --verifier-api-key $(POLYGON_API_KEY) --verifier-url https://api-amoy.polygonscan.com/api 



deploy-MUSD-PROXY-fuji:; forge script script/DeployMaven.s.sol:DeployMaven --rpc-url https://avalanche-fuji.drpc.org --private-key $(PRIVATE_KEY_59)  --broadcast -vvvv

verify-MUSD-fuji:; forge verify-contract $(MUSD_CONTRACT) src/TestMaven.sol:TestMaven   --chain-id 43113 \
  --verifier-url https://api.routescan.io/v2/network/testnet/evm/43113/etherscan/api \
  --verifier etherscan \
  --verifier-api-key dummy




interaction-admin:; forge clean && forge build &&  forge script script/Interaction.s.sol:Interaction --rpc-url https://rpc-amoy.polygon.technology --private-key $(PRIVATE_KEY_59)  --broadcast -vvvv

interaction-user:; forge clean && forge build &&  forge script script/Interaction.s.sol:Interaction --rpc-url https://rpc-amoy.polygon.technology --private-key $(USER1_KEY)  --broadcast -vvvv



interaction-admin-bnb:; forge clean && forge build &&  forge script script/Interaction.s.sol:Interaction --rpc-url https://bsc-testnet.public.blastapi.io --private-key $(PRIVATE_KEY_59)  --broadcast -vvvv
