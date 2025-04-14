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

    // Addresses from Arbitrum Mainnet
    address constant arbRouter2 = 0x4752ba5DBc23f44D87826276BF6Fd6b1C372aD24;
    address constant USDT = 0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9;
    address constant USDC = 0xaf88d065e77c8cC2239327C5EDb3A432268e5831;
    address constant WETH = 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1;
    address constant DAI = 0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1;
    address constant V2FactoryAddress = 0xf1D7CC64Fb4452F05c498126312eBE29f30Fbcf9;

    string constant ARBITRUM_RPC = "https://arb1.arbitrum.io/rpc";
    uint256 public constant FORK_BLOCK = 321250277;

    function setUp() public {
        vm.createSelectFork(ARBITRUM_RPC, FORK_BLOCK);
        app = new SwapApp(arbRouter2);
    }

    function test_isDeployedCorrectly() public view {
        assert(app.V2Router02Address() == arbRouter2);
    }

    function test_addLiquidityCorrectly() public {
        uint256 amountIn = 100 * 1e6; // 100 USDT
        uint256 amountOutMin = 45 * 1e6; // 45 USDC min swap
        uint256 deadline = block.timestamp + 10 minutes;
        address[] memory path = new address[](2);
        path[0] = USDT;
        path[1] = USDC;
        uint256 amountAMin = 0;
        uint256 amountBMin = 0;

        vm.startPrank(arbUser);
        IERC20(USDT).approve(address(app), amountIn);

        uint256 lpTokens = app.addLiquidityWithTokenA(amountIn, path, amountOutMin, amountAMin, amountBMin, deadline);

        assertGt(lpTokens, 0);

        vm.stopPrank();
    }

    function test_removeLiquidityCorrectly() public {
        uint256 amountIn = 100 * 1e6; // 100 USDT
        uint256 amountOutMin = 45 * 1e6; // 45 USDC min swap
        uint256 deadline = block.timestamp + 10 minutes;
        address[] memory path = new address[](2);
        path[0] = USDT;
        path[1] = USDC;
        // uint256 amountAMin = 30 * 1e6;
        // uint256 amountBMin = 30 * 1e6;
        address pairAddress = IUniswapV2Factory(V2FactoryAddress).getPair(USDT, USDC);

        vm.startPrank(arbUser);

        IERC20(USDT).approve(address(app), amountIn);
        uint256 lpTokens =
            app.addLiquidityWithTokenA(amountIn, path, amountOutMin, amountOutMin, amountOutMin, deadline);

        uint256 tokenABalanceBefore = IERC20(USDT).balanceOf(arbUser);
        uint256 tokenBBalanceBefore = IERC20(USDC).balanceOf(arbUser);
        uint256 lpTokensBefore = IERC20(pairAddress).balanceOf(arbUser);

        IERC20(pairAddress).approve(address(app), lpTokens);
        (uint256 amountA, uint256 amountB) = app.removeLiquidity(USDT, USDC, amountOutMin, amountOutMin, deadline);

        uint256 tokenABalanceAfter = IERC20(USDT).balanceOf(arbUser);
        uint256 tokenBBalanceAfter = IERC20(USDC).balanceOf(arbUser);
        uint256 lpTokensAfter = IERC20(pairAddress).balanceOf(arbUser);

        assertEq(lpTokensAfter, lpTokensBefore - lpTokens);
        assertEq(tokenABalanceAfter, tokenABalanceBefore + amountA);
        assertEq(tokenBBalanceAfter, tokenBBalanceBefore + amountB);

        vm.stopPrank();
    }
}
