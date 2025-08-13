-include .env


all: clean remove install update build


# Clean the repo
clean  :; forge clean && forge build
# Remove modules
remove :; rm -rf .gitmodules && rm -rf .git/modules/* && rm -rf lib && touch .gitmodules && git add . && git commit -m "modules"

install :;npm install &&  forge install cyfrin/foundry-devops@0.2.2 && forge install foundry-rs/forge-std@v1.8.2 && forge install OpenZeppelin/openzeppelin-contracts-upgradeable@v5.3.0 && forge install OpenZeppelin/openzeppelin-contracts@v5.3.0 && forge install OpenZeppelin/openzeppelin-foundry-upgrades@v0.3.8 && forge install cyfrin/foundry-devops@0.0.11  




# Update Dependencies
update:; forge update

build:; forge clean &&  forge build     

test-all :; forge clean && forge build && forge test   -vvv
mt t= :; forge clean && forge test --mt $(t) -vvvv

coverage :; forge clean && forge build && forge coverage
coverage-report :; forge clean && forge build && forge coverage --report lcov

snapshot :; forge snapshot

format :; forge fmt
lint :; forge fmt --check && forge verify --check






deploy-amoy:; forge clean && forge build &&  forge script script/DeployNexUSD.s.sol:DeployNexUSD --rpc-url https://rpc-amoy.polygon.technology --private-key $(PRIVATE_KEY_59)  --broadcast -vvvv

deploy-bnb:; forge clean && forge build &&  forge script script/DeployNexUSD.s.sol:DeployNexUSD --rpc-url https://bsc-testnet.public.blastapi.io --private-key $(PRIVATE_KEY_59)  --broadcast -vvvv

verify-NexUSD-amoy:;forge verify-contract $(NexUSD_CONTRACT) src/NexUSD.sol:NexUSD --chain-id 80002 --verifier-api-key $(POLYGON_API_KEY) --verifier-url https://api-amoy.polygonscan.com/api 
verify-PROXY-amoy:; forge verify-contract $(PROXY_CONTRACT) lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol:ERC1967Proxy --chain-id 80002 --verifier-api-key $(POLYGON_API_KEY) --verifier-url https://api-amoy.polygonscan.com/api --constructor-args 000000000000000000000000992338cd6a11fe2bda153968d114825ec49f25b900000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000084f8c8765e0000000000000000000000001679dffe0f02ece842e503ec40922edc556f90650000000000000000000000003ff88b69d1762aa444c85c30c4b0b795f9c48b590000000000000000000000009c32fcb86bf0f4a1a8921a9fe46de3198bb884b20000000000000000000000000fd9e8d3af1aaee056eb9e802c3a762a667b190400000000000000000000000000000000000000000000000000000000

update-amoy:; forge clean && forge build && forge script script/UpgradeNexUSD.s.sol:UpgradeNexUSD --rpc-url https://rpc-amoy.polygon.technology --private-key $(PRIVATE_KEY_59)  --broadcast -vvvv
verify-NexUSD-v2-amoy:;forge verify-contract $(NexUSD_CONTRACT_V2) src/v2/NexUSDV2.sol:NexUSDV2 --chain-id 80002 --verifier-api-key $(POLYGON_API_KEY) --verifier-url https://api-amoy.polygonscan.com/api 



deploy-NexUSD-PROXY-fuji:; forge script script/DeployNexUSD.s.sol:DeployNexUSD --rpc-url https://avalanche-fuji.drpc.org --private-key $(PRIVATE_KEY_59)  --broadcast -vvvv

verify-NexUSD-fuji:; forge verify-contract $(NexUSD_CONTRACT) src/NexUSD.sol:NexUSD   --chain-id 43113 \
  --verifier-url https://api.routescan.io/v2/network/testnet/evm/43113/etherscan/api \
  --verifier etherscan \
  --verifier-api-key dummy




interaction-admin:; forge clean && forge build &&  forge script script/Interaction.s.sol:Interaction --rpc-url https://rpc-amoy.polygon.technology --private-key $(PRIVATE_KEY_59)  --broadcast -vvvv

interaction-user:; forge clean && forge build &&  forge script script/Interaction.s.sol:Interaction --rpc-url https://rpc-amoy.polygon.technology --private-key $(USER1_KEY)  --broadcast -vvvv



interaction-admin-bnb:; forge clean && forge build &&  forge script script/Interaction.s.sol:Interaction --rpc-url https://bsc-testnet.public.blastapi.io --private-key $(PRIVATE_KEY_59)  --broadcast -vvvv
