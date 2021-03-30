// SPDX-License-Identifier: MIT

pragma solidity 0.7.5;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract CyberTimeEvangelist is ERC721 {
    using SafeMath for uint256; //add safeMath

    // address able to mint tokens
    address public dev;

    modifier onlyDev() {
        require(msg.sender == dev, "airdrop: wrong developer");
        _;
    }

    constructor(
        address _dev
    ) public ERC721("CyberTime NFT Airdrops", "NFTDROP") {
        dev = _dev;
    }

    function mintNFT(address _recipient, uint256 _tokenId, string memory _tokenURI) public onlyDev {
        _mint(_recipient, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);
    }
}
