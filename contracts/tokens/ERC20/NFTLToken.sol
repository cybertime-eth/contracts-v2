// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NFTLToken is ERC20 {
    address public farmingContract;
    address public owner;

    IERC20 internal oldNFTL;

    constructor(
        address _owner,
        address _initialReceiver,
        uint256 _initialMintAmt,
        address _oldNFTLAddress
    ) ERC20("NFTL Token", "NFTL") {
        owner = _owner;
        oldNFTL = IERC20(_oldNFTLAddress);
        _mint(_initialReceiver, _initialMintAmt);
    }

    // mint tokens
    function mint(address _to, uint256 _amt) public {
        require(
            farmingContract == msg.sender,
            "CTFToken: You are not authorised to mint"
        );
        _mint(_to, _amt);
    }

    function addFarmingContract(address _farmingContractAddr) public {
        require(msg.sender == owner, "CTFToken: You're not owner");
        require(
            farmingContract == address(0),
            "Farming Contract Already Added"
        );
        farmingContract = _farmingContractAddr;
    }

    function migrate() public {
        uint256 oldBalance = oldNFTL.balanceOf(msg.sender);
        // check if user has enough CTF tokens with old contract
        require(oldBalance > 0, "NFTLToken: Not eligible to migrate");
        // burn the old CTF tokens
        oldNFTL.transferFrom(msg.sender, address(0), oldBalance);
        // mint new tokens to the user
        _mint(msg.sender, oldBalance);
    }
}
