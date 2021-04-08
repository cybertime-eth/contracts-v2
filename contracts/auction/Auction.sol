// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract CybertimeNFTAuction {
    using SafeMath for uint256; //add safeMath

    address public dev; // developer address
    address public team; // address of the team

    uint256 distribution; // distribution percentage between the DAO and the team

    IERC20 immutable public NFTL; // add ERC20 interface to NFTL address

    uint256 burnRate; // Burn NFTL on each sale

    struct Auction {
        uint256 originalQuantity; // quantity of the NFT's to give
        // uint256 basePrice; // base price of the asset
        uint256 minBidAmt; // minimum amount at which auction should increase
        uint256 incrementRate; // rate at which the big should increment
        uint256 startTime; // time at which the auction will start
        uint256 expiry; // expiry of the auction
        uint256 highestBidAmt; // store the higest bid amount
        uint256 totalBidders; // total number of bids
        uint256 totalBidAmt; // total bid amount
        mapping(address => uint256) bids; // mapping of all the bids with amount they staked
        mapping(address => uint256) bidderPosition;
    }

    // store the mapping of added NFTs for the sale
    mapping(address => Auction) public auctions;

    event Bid(
        address indexed asset,
        address indexed user,
        uint256 indexed amount
    );

    event Claim(
        address indexed asset,
        address indexed user,
        uint256 indexed tokenId
    );

    event NewAuction(address indexed asset);

    event IncrementRate(address indexed asset, uint256 indexed incrementRate);

    event ChangeSalesDistribution(uint256 indexed newDistributionRate);

    event ChangeBurnRate(uint256 indexed newBurnRate);


    modifier onlyDev() {
        require(msg.sender == dev, "auction: wrong developer");
        _;
    }

    constructor(IERC20 _nftlAddres, address _dev) {
        NFTL = _nftlAddres;
        dev = _dev;
    }

    /*
     * @dev A user can bid, he provide amount in ratio with minBidAmt
     * @param _asset Address of the auction asset
     * @param _amt Amount users want to bid
     */
    function bid(address _asset, uint256 _amt) public {
        Auction storage auction = auctions[_asset];

        require(_amt > 0, "auction: amount should be greater than zero");
        require(
            auction.expiry > block.timestamp,
            "Auction: Auction is not over yet"
        );
        require(
            auction.minBidAmt < _amt && // _amt should be > than last bidded price
                _amt.sub(auction.minBidAmt).mod(auction.incrementRate) == 0, // proposed bid is multiple of minimum bid amount
            "auction: invalid amount"
        );

        // update the amount user has staked
        uint256 newBidderAmt = auction.bids[msg.sender].add(_amt);
        auction.bids[msg.sender] = newBidderAmt;

        // update the highest bid amount
        if (auction.highestBidAmt < _amt.add(newBidderAmt)) {
            auction.highestBidAmt = _amt.add(newBidderAmt]);
        }

        // update last bid amount
        auction.minBidAmt = _amt;

        // update the totalBidAmt
        auction.totalBidAmt = auction.totalBidAmt.add(_amt);

        if (newBidderAmt != 0) {
            auction.totalBidders = auction.totalBidders.add(1);
        }

        // store index to distribute the reward
        auction.bidderPosition[msg.sender] = auction.bidderPosition[msg.sender]
            .add(auction.totalBidders);

        // transfer the tokens to contract
        NFTL.transferFrom(msg.sender, address(this), _amt);

        // emit bid event
        emit Bid(_asset, msg.sender, _amt);
    }

    /*
     * @dev After the auction has ended users can claim their NFTs or the NFTLs (in case they do not win)
     * @asset _asset on which the user wants to claim the price
     */
    function claim(address _asset) public {
        require(_asset != address(0), "auction: invalid asset");

        Auction storage auction = auctions[_asset];

        require(
            auction.expiry < block.timestamp,
            "Auction: Auction is not over yet"
        );

        if (auction.totalBidders.sub(auction.bidderPosition[msg.sender]) == 0) {
            uint256 tokenId = auction.totalBidders.sub(auction.bidderPosition[msg.sender]);
            IERC721(_asset).transferFrom(
                address(this),
                msg.sender,
                auction.totalBidders.sub(auction.bidderPosition[msg.sender])
            );
            emit Claim(_asset, msg.sender, tokenId);
        } else if (
            auction.totalBidders.sub(auction.bidderPosition[msg.sender]) <=
            auction.originalQuantity
        ) {
            uint256 tokenId = auction.totalBidders.sub(auction.bidderPosition[msg.sender]);
            IERC721(_asset).transferFrom(
                address(this),
                msg.sender,
                tokenId
            );
            emit Claim(_asset, msg.sender, auction.totalBidders.sub(auction.bidderPosition[msg.sender]));
        } else {
            NFTL.transfer(msg.sender, auction.bids[msg.sender]);
        }
    }

    /* 
    DEV FUNCTIONS
    */
    /*
     * @dev add new NFT for sale
     * @param _asset The address of the asset should be sold
     * @param _quantity The quantity of the asset should be sold
     * @param _basePrice The price at which the auction should start
     * @param _expiry Expiry of the NFT sale
     */
    function add(
        address _asset,
        uint256 _quantity,
        // uint256 _basePrice,
        uint256 _minBidAmt,
        uint256 _incrementRate,
        uint256 _expiry
    ) external onlyDev {
        require(_quantity > 0, "auction: _quantity should be greater than zero");
        require(_expiry > block.timestamp, "auction: _expiry should be a future block");
        require(_minBidAmt > 0, "auction: _minBidAmt should be greater than zero");
        Auction storage auction = auctions[_asset];
        // check if the asset is already added
        require(auction.minBidAmt == 0);
        auction.originalQuantity = _quantity;
        // auction.basePrice = _basePrice;
        auction.minBidAmt = _minBidAmt;
        auction.incrementRate = _incrementRate;
        auction.expiry = _expiry;
        emit NewAuction(_asset);
    }

    function changeIncrementRate(address _asset, uint256 _incrementRate)
        external
        onlyDev
    {
        require(_asset != address(0) && _incrementRate > 0, "auction: invalid inputs");
        Auction storage auction = auctions[_asset];
        auction.incrementRate = _incrementRate;
        emit IncrementRate(_asset, _incrementRate);
    }

    // set distribution percentage to DAO, in decimal of 4
    // eg. for 50% set value to be 50000
    function changeSalesDistribution(uint256 _newDistribution) external onlyDev {
        distribution = _newDistribution;
        emit ChangeSalesDistribution(_newDistribution);
    }

    // for 50% set value to be 50000
    function changeBurnRate(uint256 _newBurnRate) external onlyDev {
        burnRate = _newBurnRate;
        emit ChangeBurnRate(_newBurnRate);
    }

    function distributeSales(address _asset) external onlyDev {
        require(_asset != address(0), "auction: wrong address");
        Auction storage auction = auctions[_asset];
        require(
            auction.expiry <= block.timestamp,
            "auction: the auction isn't expired"
        );

        uint256 saleAmount;

        // burn tokens
        if (burnRate > 0) {
            uint256 burnAmount =
                auction.highestBidAmt.mul(burnRate).div(1000000);
            NFTL.transfer(address(0), burnAmount);
            saleAmount = auction.highestBidAmt.sub(burnAmount);
        } else {
            saleAmount = auction.highestBidAmt;
        }

        // distribute funds to developer w.r.t to already set distribution
        uint256 devShare = saleAmount.mul(distribution).div(1000000);
        NFTL.transfer(dev, devShare);
        // distribute remaining balance to the team
        NFTL.transfer(team, saleAmount.sub(devShare));
    }
}
