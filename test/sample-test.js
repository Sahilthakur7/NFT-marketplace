const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('NFT Market', function () {
  it('Should create and execute sales', async function () {
    const Market = await ethers.getContractFactory('NFTMarket');
    const market = await Market.deploy();

    await market.deployed();
    const marketAddress = market.address;

    const NFT = await ethers.getContractFactory('NFT');
    const nft = await NFT.deploy(marketAddress);

    await nft.deployed();
    const nftAddress = nft.address;

    let listingPrice = await market.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits('100', 'ether');

    await nft.createToken('https://www.mylocation.com');
    await nft.createToken('https://www.mylocation2.com');

    await market.createMarketItem(nftAddress, 1, auctionPrice, {
      value: listingPrice,
    });
    await market.createMarketItem(nftAddress, 2, auctionPrice, {
      value: listingPrice,
    });

    const [_, buyerAddress] = await ethers.getSigners();

    await market
      .connect(buyerAddress)
      .createMarketSale(nftAddress, 2, { value: auctionPrice });

    const items = await market.fetchMarketItems();

    console.log('Items: ', items);
  });
});
