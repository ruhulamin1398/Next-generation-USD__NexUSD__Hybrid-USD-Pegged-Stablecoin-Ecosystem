-include .env


all: clean remove install update build


# Clean the repo
clean  :; forge clean
# Remove modules
remove :; rm -rf .gitmodules && rm -rf .git/modules/* && rm -rf lib && touch .gitmodules && git add . && git commit -m "modules"

install :; forge install cyfrin/foundry-devops@0.2.2 --no-commit && forge install foundry-rs/forge-std@v1.8.2 --no-commit &&  forge install forge install OpenZeppelin/openzeppelin-contracts-upgradeable@v5.3.0 --no-commit && forge install OpenZeppelin/openzeppelin-contracts@v5.3.0 --no-commit


# Update Dependencies
update:; forge update

build:; forge build     

test :; forge test  

snapshot :; forge snapshot

format :; forge fmt
lint :; forge fmt --check && forge verify --check






deploy-MUSD:; forge script script/DeployMaven.s.sol:DeployMaven --rpc-url https://rpc-amoy.polygon.technology --private-key $(PRIVATE_KEY_59) --broadcast -vvvv
