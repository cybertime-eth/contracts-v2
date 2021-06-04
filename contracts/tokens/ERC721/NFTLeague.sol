// SPDX-License-Identifier: MIT

pragma solidity 0.7.5;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract NFTLeague is ERC721 {
    using SafeMath for uint256; //add safeMath

    // address able to mint tokens
    address public auction;

    address public dev;

    uint256 public totalMinted;

    modifier onlyAuction() {
        require(msg.sender == auction, "NFTLeague: wrong contract");
        _;
    }

    modifier onlyDev() {
        require(msg.sender == dev, "auction: wrong developer");
        _;
    }

    constructor() public ERC721("CyberTime NFT League", "NFTLeague") {
        dev = msg.sender;
    }

    function mint(address _recipient, uint256 _tokenId, string memory _uri) external onlyAuction {
        _mint(_recipient, _tokenId);
        _setTokenURI(_tokenId, _uri);
        totalMinted += 1;
    }

    function addAuction(address _auctionAddress) public {
        require(msg.sender == dev, "NFTLeague: Wrong call");
        require(
            auction == address(0),
            "NFTLeague: Auction contract already added"
        );
        auction = _auctionAddress;
    }

    function changeDev(address _newDev) public onlyDev {
        dev  = _newDev;
    }
}
