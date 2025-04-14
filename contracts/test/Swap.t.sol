// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import "../src/Swap.sol";
import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

contract SwapTest is Test {
    SwapApp public app;
    address user = vm.addr(1);
    address devUser = 0xc717879FBc3EA9F770c0927374ed74A998A3E2Ce;
    address arbUser = 0x41acf0e6eC627bDb3747b9Ed6799c2B469F77C5F;

    address constant arbRouter2 = 0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24;
    address constant USDT = 0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9;
    address constant WETH = 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1;
    address constant DAI = 0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1;

    string constant ARBITRUM_RPC = "https://arb1.arbitrum.io/rpc";
    uint256 public constant FORK_BLOCK = 321250277;

    function setUp() public {
        vm.createSelectFork(ARBITRUM_RPC, FORK_BLOCK);
        app = new SwapApp(arbRouter2);
    }

    function test_isDeployedCorrectly() public view {
        assert(app.V2Router02Address() == arbRouter2);
    }

    function test_revertETHSwapIfNoETH() public {
        uint256 amountIn = 1 ether;
        uint256 deadline = block.timestamp + 10 minutes;
        address[] memory path = new address[](2);
        path[0] = WETH;
        path[1] = USDT;

        uint256 amountOutMin = app.getAmountOutHelper(amountIn, path);
        uint256 amountOutMinWithSlippage = (amountOutMin * 95) / 100;

        vm.startPrank(user);

        vm.expectRevert("Must send ETH");
        app.swapETHForTokens(amountOutMinWithSlippage, path, deadline);

        vm.stopPrank();
    }

    function test_swapETHForTokensCorrectly() public {
        uint256 amountIn = 1 ether;
        uint256 deadline = block.timestamp + 10 minutes;
        address[] memory path = new address[](2);
        path[0] = WETH;
        path[1] = USDT;

        uint256 amountOutMin = app.getAmountOutHelper(amountIn, path);
        uint256 amountOutMinWithSlippage = (amountOutMin * 95) / 100;

        vm.startPrank(user);
        vm.deal(user, amountIn);

        uint256 userETHBefore = user.balance;
        uint256 userUSDTBefore = IERC20(USDT).balanceOf(user);

        app.swapETHForTokens{value: amountIn}(amountOutMinWithSlippage, path, deadline);

        uint256 userETHAfter = user.balance;
        uint256 userUSDTAfter = IERC20(USDT).balanceOf(user);

        assertEq(userETHAfter, userETHBefore - amountIn);
        assertGt(userUSDTAfter, userUSDTBefore);

        vm.stopPrank();
    }

    function test_swapTokensForETHCorrectly() public {
        uint256 amountIn = 1000 * 1e6;
        uint256 amountMinOut = 0.1 ether;
        uint256 deadline = block.timestamp + 10 minutes;
        address[] memory path = new address[](2);
        path[0] = USDT;
        path[1] = WETH;

        vm.startPrank(arbUser);

        uint256 USDTBalanceBefore = IERC20(USDT).balanceOf(arbUser);
        uint256 ETHBalanceBefore = arbUser.balance;

        IERC20(USDT).approve(address(app), amountIn);
        app.swapTokensForETH(amountIn, amountMinOut, path, deadline);

        uint256 USDTBalanceAfter = IERC20(USDT).balanceOf(arbUser);
        uint256 ETHBalanceAfter = arbUser.balance;

        assertEq(USDTBalanceAfter, USDTBalanceBefore - amountIn);
        assertGt(ETHBalanceAfter, ETHBalanceBefore);

        vm.stopPrank();
    }

    function test_swapCorrectly() public {
        uint256 amountIn = 100 * 1e6;
        uint256 amountMinOut = 90 * 1e18;
        uint256 deadline = block.timestamp + 10 minutes;
        address[] memory path = new address[](2);
        path[0] = USDT;
        path[1] = DAI;

        vm.startPrank(arbUser);

        uint256 DAIBalanceBefore = IERC20(DAI).balanceOf(arbUser);
        uint256 USDTBalanceBefore = IERC20(USDT).balanceOf(arbUser);

        IERC20(USDT).approve(address(app), amountIn);
        app.swapTokens(amountIn, amountMinOut, path, deadline);

        uint256 DAIBalanceAfter = IERC20(DAI).balanceOf(arbUser);
        uint256 USDTBalanceAfter = IERC20(USDT).balanceOf(arbUser);

        assertGt(DAIBalanceAfter, DAIBalanceBefore);
        assertEq(USDTBalanceAfter, USDTBalanceBefore - amountIn);

        vm.stopPrank();
    }

    function test_AmountOutHelper() public {
        uint256 amountIn = 1 ether;
        address[] memory path = new address[](2);
        path[0] = WETH;
        path[1] = USDT;

        vm.startPrank(user);
        uint256 outputAmount = app.getAmountOutHelper(amountIn, path);

        assertGt(outputAmount, 0);
        vm.stopPrank();
    }
}
