// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

import {console, console2} from "forge-std/Script.sol";

import {HelperConfig} from "../../script/HelperConfig.s.sol";

import {Vm} from "forge-std/Vm.sol";
import {HelperTest} from "../Helper.t.sol";

contract PermitTest is HelperConfig, HelperTest {
    function setUp() public {
        deployV1();
    }

    function _getPermitSignature(
        address user,
        uint256 userPrivateKey,
        address spender,
        uint256 value,
        uint256 nonce,
        uint256 deadline
    ) internal view returns (uint8 v, bytes32 r, bytes32 s) {
        bytes32 DOMAIN_SEPARATOR = NUSDv1.DOMAIN_SEPARATOR();
        bytes32 PERMIT_TYPEHASH = keccak256(
            "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
        );
        bytes32 structHash = keccak256(
            abi.encode(PERMIT_TYPEHASH, user, spender, value, nonce, deadline)
        );
        bytes32 digest = keccak256(
            abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, structHash)
        );
        return vm.sign(userPrivateKey, digest);
    }

    function testPermitSetsAllowanceAndPreventsReplay() public {
        uint256 amount = 1000 * 1e6;
        uint256 deadline = block.timestamp + 1 hours;
        uint256 userPrivateKey = 0xA11CE;
        address user = vm.addr(userPrivateKey);
        address spender = USER2;
        uint256 nonce = NUSDv1.nonces(user);
        vm.prank(OPERATOR);
        NUSDv1.mint(user, amount);
        (uint8 v, bytes32 r, bytes32 s) = _getPermitSignature(
            user,
            userPrivateKey,
            spender,
            amount,
            nonce,
            deadline
        );
        NUSDv1.permit(user, spender, amount, deadline, v, r, s);
        assertEq(NUSDv1.allowance(user, spender), amount);
        assertEq(NUSDv1.nonces(user), nonce + 1);
        vm.expectRevert();
        NUSDv1.permit(user, spender, amount, deadline, v, r, s);
    }

    function testPermitExpiredDeadlineReverts() public {
        uint256 amount = 1000 * 1e6;
        uint256 deadline = block.timestamp - 1;
        uint256 userPrivateKey = 0xA11CE;
        address user = vm.addr(userPrivateKey);
        address spender = USER2;
        uint256 nonce = NUSDv1.nonces(user);
        vm.prank(OPERATOR);
        NUSDv1.mint(user, amount);
        (uint8 v, bytes32 r, bytes32 s) = _getPermitSignature(
            user,
            userPrivateKey,
            spender,
            amount,
            nonce,
            deadline
        );
        vm.expectRevert();
        NUSDv1.permit(user, spender, amount, deadline, v, r, s);
    }

    function testPermitWrongOwnerSignatureReverts() public {
        uint256 amount = 1000 * 1e6;
        uint256 deadline = block.timestamp + 1 hours;
        uint256 userPrivateKey = 0xA11CE;
        address user = vm.addr(userPrivateKey);
        address spender = USER2;
        uint256 nonce = NUSDv1.nonces(user);
        vm.prank(OPERATOR);
        NUSDv1.mint(user, amount);
        uint256 wrongKey = 0xBEEF;
        (uint8 v, bytes32 r, bytes32 s) = _getPermitSignature(
            user,
            wrongKey,
            spender,
            amount,
            nonce,
            deadline
        );
        vm.expectRevert();
        NUSDv1.permit(user, spender, amount, deadline, v, r, s);
    }

    function testPermitWrongSpenderDoesNotAffectAllowance() public {
        uint256 amount = 1000 * 1e6;
        uint256 deadline = block.timestamp + 1 hours;
        uint256 userPrivateKey = 0xA11CE;
        address user = vm.addr(userPrivateKey);
        address spender = USER2;
        address wrongSpender = address(0xBEEF);
        uint256 nonce = NUSDv1.nonces(user);
        vm.prank(OPERATOR);
        NUSDv1.mint(user, amount);
        (uint8 v, bytes32 r, bytes32 s) = _getPermitSignature(
            user,
            userPrivateKey,
            spender,
            amount,
            nonce,
            deadline
        );
        vm.expectRevert();
        NUSDv1.permit(user, wrongSpender, amount, deadline, v, r, s);
        assertEq(NUSDv1.allowance(user, spender), 0);
    }

    function testPermitWrongNonceReverts() public {
        uint256 amount = 1000 * 1e6;
        uint256 deadline = block.timestamp + 1 hours;
        uint256 userPrivateKey = 0xA11CE;
        address user = vm.addr(userPrivateKey);
        address spender = USER2;
        uint256 nonce = NUSDv1.nonces(user) + 1;
        vm.prank(OPERATOR);
        NUSDv1.mint(user, amount);
        (uint8 v, bytes32 r, bytes32 s) = _getPermitSignature(
            user,
            userPrivateKey,
            spender,
            amount,
            nonce,
            deadline
        );
        vm.expectRevert();
        NUSDv1.permit(user, spender, amount, deadline, v, r, s);
    }

    function testPermitZeroValueSetsZeroAllowance() public {
        uint256 amount = 0;
        uint256 deadline = block.timestamp + 1 hours;
        uint256 userPrivateKey = 0xA11CE;
        address user = vm.addr(userPrivateKey);
        address spender = USER2;
        uint256 nonce = NUSDv1.nonces(user);
        vm.prank(OPERATOR);
        NUSDv1.mint(user, 1000 * 1e6);
        (uint8 v, bytes32 r, bytes32 s) = _getPermitSignature(
            user,
            userPrivateKey,
            spender,
            amount,
            nonce,
            deadline
        );
        NUSDv1.permit(user, spender, amount, deadline, v, r, s);
        assertEq(NUSDv1.allowance(user, spender), 0);
        assertEq(NUSDv1.nonces(user), nonce + 1);
    }
}
