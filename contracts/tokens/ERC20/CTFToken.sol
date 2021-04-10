// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.7.5;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CyberTimeFinanceToken is ERC20 {
    address public farmingContract;
    address public owner;

    IERC20 private oldCTF;
    uint256 private deployedAt;

    event SetAddFarmingContract(
        address indexed farmingContractAddr,
        address indexed _admin
    );

    constructor(
        address _owner,
        address _initialReceiver,
        uint256 _initialMintAmt,
        address _oldCTFAddress
    ) ERC20("CyberTime Finance Token", "CTF") {
        owner = _owner;
        oldCTF = IERC20(_oldCTFAddress);
        _mint(_initialReceiver, _initialMintAmt);
        deployedAt = block.timestamp;
    }

    // mint tokens
    function mint(address _to, uint256 _amt) public {
        require(
            farmingContract == msg.sender,
            "CTFToken: You are not authorised to mint"
        );
        _mint(_to, _amt);
        require(totalSupply() <= 86000 * (10**18));
    }

    function addFarmingContract(address _farmingContractAddr) public {
        require(msg.sender == owner, "CTFToken: You're not owner");
        require(
            farmingContract == address(0),
            "Farming Contract Already Added"
        );
        farmingContract = _farmingContractAddr;
        emit SetAddFarmingContract(_farmingContractAddr, msg.sender);
    }

    // migrate from v1 to v2
    function migrate() public {
        uint256 oldBalance = oldCTF.balanceOf(msg.sender);
        require(
            deployedAt + 365 days >= block.timestamp,
            "CTFToken: Migration period is over"
        );
        // check if user has enough CTF tokens with old contract
        require(oldBalance > 0, "CTFToken: Not eligible to migrate");
        // burn the old CTF tokens
        oldCTF.transferFrom(msg.sender, 0x000000000000000000000000000000000000dEaD, oldBalance);
        _mint(msg.sender, oldBalance);
    }
}
