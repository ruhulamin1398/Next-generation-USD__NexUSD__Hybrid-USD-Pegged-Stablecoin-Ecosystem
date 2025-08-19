# NexUSD-C Smart Contract Project Makefile

# Default target
.DEFAULT_GOAL := help

# Variables
FOUNDRY_PROFILE ?= default

# Colors for output
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m

.PHONY: help install build test test-verbose clean lint format check coverage deploy-local gas-report

## Show this help message
help:
	@echo "$(GREEN)NexUSD-C Smart Contract Commands$(RESET)"
	@echo ""
	@echo "$(YELLOW)Setup:$(RESET)"
	@echo "  install          Install dependencies"
	@echo ""
	@echo "$(YELLOW)Development:$(RESET)"
	@echo "  build            Compile contracts"
	@echo "  test             Run all tests"
	@echo "  test-verbose     Run tests with detailed output"
	@echo "  coverage         Generate test coverage report"
	@echo "  gas-report       Generate gas usage report"
	@echo ""
	@echo "$(YELLOW)Code Quality:$(RESET)"
	@echo "  lint             Check code for issues"
	@echo "  format           Format code"
	@echo "  check            Run all checks (build, test, lint)"
	@echo ""
	@echo "$(YELLOW)Utilities:$(RESET)"
	@echo "  clean            Clean build artifacts"
	@echo "  deploy-local     Deploy to local network"

## Install dependencies
install:
	@echo "$(GREEN)Installing dependencies...$(RESET)"
	forge install

## Compile contracts
build:
	@echo "$(GREEN)Building contracts...$(RESET)"
	forge build

## Run all tests
test:
	@echo "$(GREEN)Running tests...$(RESET)"
	forge test

## Run tests with verbose output
test-verbose:
	@echo "$(GREEN)Running tests (verbose)...$(RESET)"
	forge test -vvv

## Generate test coverage report
coverage:
	@echo "$(GREEN)Generating coverage report...$(RESET)"
	forge coverage --report lcov
	@echo "Coverage report generated in lcov.info"

## Generate gas usage report
gas-report:
	@echo "$(GREEN)Generating gas report...$(RESET)"
	forge test --gas-report

## Check code formatting and style
lint:
	@echo "$(GREEN)Checking code style...$(RESET)"
	forge fmt --check

## Format code
format:
	@echo "$(GREEN)Formatting code...$(RESET)"
	forge fmt

## Run all checks
check: build test lint
	@echo "$(GREEN)All checks passed!$(RESET)"

## Clean build artifacts
clean:
	@echo "$(GREEN)Cleaning build artifacts...$(RESET)"
	forge clean

## Deploy to local network (anvil)
deploy-local:
	@echo "$(GREEN)Deploying to local network...$(RESET)"
	@echo "$(YELLOW)Make sure anvil is running: anvil$(RESET)"
	forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

## Test specific contract
test-%:
	@echo "$(GREEN)Running tests for $*...$(RESET)"
	forge test --match-contract $*

## Test specific function
test-func-%:
	@echo "$(GREEN)Running test function $*...$(RESET)"
	forge test --match-test $*
