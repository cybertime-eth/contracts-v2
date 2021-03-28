// SPDX-License-Identifier: MIT

pragma solidity 0.7.5;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract CyberTimeEvangelist is ERC721 {
    using SafeMath for uint256; //add safeMath
    // keep track of counters
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // store hashes
    string private legendary;
    string private epic;
    string private rare;

    // store total supply till date
    uint256 public legendarySupply;
    uint256 public epicSupply;
    uint256 public rareSupply;

    // address able to mint tokens
    address public dev;

    modifier onlyDev() {
        require(msg.sender == dev, "airdrop: wrong developer");
        _;
    }

    constructor(
        string memory _legendary,
        string memory _epic,
        string memory _rare,
        address _dev
    ) public ERC721("CyberTime NFT Airdrops", "NFTDROP") {
        legendary = _legendary;
        epic = _epic;
        rare = _rare;
        dev = _dev;
    }

    function mintLegendary(address _recipient) public onlyDev {
        require(legendarySupply.add(1) <= 20);
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(_recipient, newItemId);
        _setTokenURI(newItemId, legendary);
        legendarySupply = legendarySupply.add(1);
    }

    function mintEpic(address _recipient) public onlyDev {
        require(epicSupply.add(1) <= 60);
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(_recipient, newItemId);
        _setTokenURI(newItemId, epic);
        epicSupply = epicSupply.add(1);
    }

    function mintRare(address _recipient) public onlyDev {
        require(rareSupply.add(1) <= 250);
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(_recipient, newItemId);
        _setTokenURI(newItemId, rare);
        rareSupply = rareSupply.add(1);
    }
}
