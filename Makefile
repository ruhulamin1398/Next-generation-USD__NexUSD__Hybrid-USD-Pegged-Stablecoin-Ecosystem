-include .env


all: clean remove install update build


# Clean the repo
clean  :; forge clean && forge build
# Remove modules
remove :; rm -rf .gitmodules && rm -rf .git/modules/* && rm -rf lib && touch .gitmodules && git add . && git commit -m "modules"

install :; forge install cyfrin/foundry-devops@0.2.2   && forge install foundry-rs/forge-std@v1.8.2   &&  forge install forge install OpenZeppelin/openzeppelin-contracts-upgradeable@v5.3.0   && forge install OpenZeppelin/openzeppelin-contracts@v5.3.0   && forge install OpenZeppelin/openzeppelin-foundry-upgrades@v0.4.0   && && forge install cyfrin/foundry-devops@0.0.11



# Update Dependencies
update:; forge update

build:; forge build     

test :; forge test  

snapshot :; forge snapshot

format :; forge fmt
lint :; forge fmt --check && forge verify --check






deploy-MUSD-PROXY-amoy:; forge clean && forge build &&  forge script script/DeployMaven.s.sol:DeployMaven --rpc-url https://rpc-amoy.polygon.technology --private-key $(PRIVATE_KEY_59) --ffi --broadcast -vvvv

verify-MUSD-amoy:;forge verify-contract $(MUSD_CONTRACT) src/TestMaven.sol:TestMaven --chain-id 80002 --verifier-api-key $(POLYGON_API_KEY) --verifier-url https://api-amoy.polygonscan.com/api 
verify-PROXY-amoy:; forge verify-contract $(PROXY_CONTRACT) lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol:ERC1967Proxy --chain-id 80002 --verifier-api-key $(POLYGON_API_KEY) --verifier-url https://api-amoy.polygonscan.com/api --constructor-args 0000000000000000000000001679dffe0f02ece842e503ec40922edc556f906500000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000044485cc9550000000000000000000000003ff88b69d1762aa444c85c30c4b0b795f9c48b590000000000000000000000003ff88b69d1762aa444c85c30c4b0b795f9c48b5900000000000000000000000000000000000000000000000000000000

update-MUSD-amoy:; forge clean && forge build && forge script script/UpgradeMaven.s.sol:UpgradeMaven --rpc-url https://rpc-amoy.polygon.technology --private-key $(PRIVATE_KEY_59) --ffi --broadcast -vvvv
verify-MUSD-v2-amoy:;forge verify-contract $(MUSD_CONTRACT_V2) src/TestMavenv2.sol:TestMavenv2 --chain-id 80002 --verifier-api-key $(POLYGON_API_KEY) --verifier-url https://api-amoy.polygonscan.com/api 



deploy-MUSD-PROXY-fuji:; forge script script/DeployMaven.s.sol:DeployMaven --rpc-url https://avalanche-fuji.drpc.org --private-key $(PRIVATE_KEY_59) --ffi --broadcast -vvvv

verify-MUSD-fuji:; forge verify-contract $(MUSD_CONTRACT) src/TestMaven.sol:TestMaven   --chain-id 43113 \
  --verifier-url https://api.routescan.io/v2/network/testnet/evm/43113/etherscan/api \
  --verifier etherscan \
  --verifier-api-key dummy
