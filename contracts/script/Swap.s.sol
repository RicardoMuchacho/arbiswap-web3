// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import "../src/Swap.sol";

contract SwapAppScript is Script {
    address constant sepoliaRouter2 = 0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3;
    string constant SEPOLIA_RPC = "wss://ethereum-sepolia-rpc.publicnode.com";

    function run () external returns (SwapApp){
        uint256 privKey = vm.envUint("PRIVATE_KEY");

        // generally used for testing but also to ensure it connects to the network when deploying
        vm.createSelectFork(SEPOLIA_RPC);

        vm.startBroadcast(privKey);

        SwapApp app = new SwapApp(sepoliaRouter2);

        vm.stopBroadcast();

        return app;
    }
}