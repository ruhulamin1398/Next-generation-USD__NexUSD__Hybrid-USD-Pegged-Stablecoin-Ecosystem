-include .env
 
  

install :;npm install &&  forge install cyfrin/foundry-devops@0.2.2 && forge install foundry-rs/forge-std@v1.8.2 && forge install OpenZeppelin/openzeppelin-contracts-upgradeable@v5.3.0 && forge install OpenZeppelin/openzeppelin-contracts@v5.3.0 && forge install OpenZeppelin/openzeppelin-foundry-upgrades@v0.3.8  




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






deploy-sepolia:; fupdate-bsc-testnetorge clean && forge build &&  forge script script/DeployNexUSD.s.sol:DeployNexUSD --rpc-url https://1rpc.io/sepolia --private-key $(PRIVATE_KEY_59)  --verify --verifier-api-key $(V2_API_KEY)   --broadcast  -vvvv

deploy-amoy:; forge clean && forge build &&  forge script script/DeployNexUSD.s.sol:DeployNexUSD --rpc-url https://rpc-amoy.polygon.technology --private-key $(PRIVATE_KEY_59)  --verify --verifier-api-key $(V2_API_KEY)   --broadcast  -vvvv

deploy-bsc-testnet:; forge clean && forge build &&  forge script script/DeployNexUSD.s.sol:DeployNexUSD --rpc-url https://bsc-testnet.public.blastapi.io --private-key $(PRIVATE_KEY_59)  --verify --verifier-api-key $(V2_API_KEY)   --broadcast  -vvvv

deploy-arbitrum-sepolia:; forge clean && forge build &&  forge script script/DeployNexUSD.s.sol:DeployNexUSD --rpc-url https://arbitrum-sepolia.drpc.org --private-key $(PRIVATE_KEY_59)  --verify --verifier-api-key $(V2_API_KEY)   --broadcast  -vvvv

 
deploy-avalanche-fuji:; forge clean && forge build &&  forge script script/DeployNexUSD.s.sol:DeployNexUSD --rpc-url https://avalanche-fuji.drpc.org --private-key $(PRIVATE_KEY_59)  --verify --verifier-api-key $(V2_API_KEY)   --broadcast  -vvvv
 
deploy-optimism-sepolia:; forge clean && forge build &&  forge script script/DeployNexUSD.s.sol:DeployNexUSD --rpc-url https://optimism-sepolia.drpc.org --private-key $(PRIVATE_KEY_59)  --verify --verifier-api-key $(V2_API_KEY)   --broadcast  -vvvv
 
deploy-celo-sepolia:; forge clean && forge build &&  forge script script/DeployNexUSD.s.sol:DeployNexUSD --rpc-url https://celo-sepolia.drpc.org --private-key $(PRIVATE_KEY_59)  --verify --verifier-api-key $(V2_API_KEY)   --broadcast  -vvvv

deploy-base-sepolia:; forge clean && forge build &&  forge script script/DeployNexUSD.s.sol:DeployNexUSD --rpc-url https://base-sepolia-public.nodies.app --private-key $(PRIVATE_KEY_59)  --verify --verifier-api-key $(V2_API_KEY)   --broadcast  -vvvv


deploy-hoodi-sepolia:; forge clean && forge build &&  forge script script/DeployNexUSD.s.sol:DeployNexUSD --rpc-url https://0xrpc.io/hoodi --private-key $(PRIVATE_KEY_59)  --verify --verifier-api-key $(V2_API_KEY)   --broadcast  -vvvv

deploy-gnosis-chiado:; forge clean && forge build &&  forge script script/DeployNexUSD.s.sol:DeployNexUSD --rpc-url https://gnosis-chiado-rpc.publicnode.com --private-key $(PRIVATE_KEY_59)  --verify --verifier-api-key $(V2_API_KEY)   --broadcast  -vvvv

deploy-mantle-sepolia:; forge clean && forge build &&  forge script script/DeployNexUSD.s.sol:DeployNexUSD --rpc-url https://rpc.sepolia.mantle.xyz --private-key $(PRIVATE_KEY_59)  --verify --verifier-api-key $(V2_API_KEY)   --broadcast  -vvvv

 
 
 

update-sepolia:; forge clean && forge build && forge script script/UpgradeNexUSD.s.sol:UpgradeNexUSD --rpc-url https://1rpc.io/sepolia --private-key $(PRIVATE_KEY_59)  --verify --verifier-api-key $(V2_API_KEY)   --broadcast  -vvvv

update-amoy:; forge clean && forge build && forge script script/UpgradeNexUSD.s.sol:UpgradeNexUSD --rpc-url https://rpc-amoy.polygon.technology --private-key $(PRIVATE_KEY_59)  --verify --verifier-api-key $(V2_API_KEY)   --broadcast  -vvvv

update-bsc-testnet:; forge clean && forge build && forge script script/UpgradeNexUSD.s.sol:UpgradeNexUSD --rpc-url https://rpc.sentio.xyz/bsc-testnet --private-key $(PRIVATE_KEY_59)  --verify --verifier-api-key $(V2_API_KEY)   --broadcast  -vvvv

update-avalanche-fuji:; forge clean && forge build && forge script script/UpgradeNexUSD.s.sol:UpgradeNexUSD --rpc-url https://avalanche-fuji.drpc.org --private-key $(PRIVATE_KEY_59)  --verify --verifier-api-key $(V2_API_KEY)   --broadcast  -vvvv

update-arbitrum-sepolia:; forge clean && forge build && forge script script/UpgradeNexUSD.s.sol:UpgradeNexUSD --rpc-url https://arbitrum-sepolia.drpc.org --private-key $(PRIVATE_KEY_59)  --verify --verifier-api-key $(V2_API_KEY)   --broadcast  -vvvv

update-optimism-sepolia:; forge clean && forge build && forge script script/UpgradeNexUSD.s.sol:UpgradeNexUSD --rpc-url https://optimism-sepolia-public.nodies.app --private-key $(PRIVATE_KEY_59)  --verify --verifier-api-key $(V2_API_KEY)   --broadcast  -vvvv

update-base-sepolia:; forge clean && forge build && forge script script/UpgradeNexUSD.s.sol:UpgradeNexUSD --rpc-url https://base-sepolia-public.nodies.app --private-key $(PRIVATE_KEY_59)  --verify --verifier-api-key $(V2_API_KEY)   --broadcast  -vvvv

update-hoodi-sepolia:; forge clean && forge build && forge script script/UpgradeNexUSD.s.sol:UpgradeNexUSD --rpc-url https://0xrpc.io/hoodi --private-key $(PRIVATE_KEY_59)  --verify --verifier-api-key $(V2_API_KEY)   --broadcast  -vvvv

update-gnosis-chiado:; forge clean && forge build && forge script script/UpgradeNexUSD.s.sol:UpgradeNexUSD --rpc-url https://gnosis-chiado-rpc.publicnode.com --private-key $(PRIVATE_KEY_59)  --verify --verifier-api-key $(V2_API_KEY)   --broadcast  -vvvv
 
update-mantle-sepolia:; forge clean && forge build && forge script script/UpgradeNexUSD.s.sol:UpgradeNexUSD --rpc-url https://rpc.sepolia.mantle.xyz --private-key $(PRIVATE_KEY_59)  --verify --verifier-api-key $(V2_API_KEY)   --broadcast  -vvvv

int:;   forge script script/Interaction.s.sol:Interaction --rpc-url https://0xrpc.io/sep --private-key 0xb9f7be492599e9e2e202672ed67dd67c36c77fdccd786fb270972aa595b6f0d5 --broadcast -vvvv


interaction-admin:; forge clean && forge build &&  forge script script/Interaction.s.sol:Interaction --rpc-url https://rpc-amoy.polygon.technology --private-key $(PRIVATE_KEY_59)  --broadcast -vvvv

interaction-user:; forge clean && forge build &&  forge script script/Interaction.s.sol:Interaction --rpc-url https://rpc-amoy.polygon.technology --private-key $(USER1_KEY)  --broadcast -vvvv



interaction-admin-bnb:; forge clean && forge build &&  forge script script/Interaction.s.sol:Interaction --rpc-url https://bsc-testnet.public.blastapi.io --private-key $(PRIVATE_KEY_59)  --broadcast -vvvv



verify-PROXY-celo:; forge verify-contract 0x58F427707474346B30163EE69c24681c18Cf87DA src/NexUSDProxy.sol:NexUSDProxy --chain-id 11142220 --verifier-api-key $(V2_API_KEY)  --constructor-args 00000000000000000000000073a2c399a5b2419a9e963c440c3c6d9c528b562b00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000044485cc9550000000000000000000000003ff88b69d1762aa444c85c30c4b0b795f9c48b5900000000000000000000000093d918a0f5c16a1a2dbbe60f8dfd014b6cdd401300000000000000000000000000000000000000000000000000000000

verify-NexUSDV2-sepolia:;forge verify-contract 0xb34b476aa0eb14b9c74a2093920d3c7bb25c09e7 src/v2/NexUSDV2.sol:NexUSDV2 --chain-id 80002 --verifier-api-key $(V2_API_KEY)

