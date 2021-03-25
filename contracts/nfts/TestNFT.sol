// SPDX-License-Identifier: MIT

pragma solidity 0.7.5;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TestNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(string => uint8) hashes;

    address public auction;
    string public metadata;

    modifier onlyAuction() {
        require(msg.sender == auction, "NFT: wrong minter");
        _;
    }

    constructor(address _auction, string memory _metadata)
        public
        ERC721("TestNFT", "tNFT")
    {
        auction = _auction;
        metadata = _metadata;
    }

    function mint(address _recipient)
        public
        onlyAuction
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(_recipient, newItemId);
        _setTokenURI(newItemId, metadata);
        return newItemId;
    }
}

