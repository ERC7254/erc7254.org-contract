// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TokenRevenueSharing.sol";

contract FactoryTokenRevenueSharing {

    address[] public allRevenueSharingTokens;
    event Create(
        address owner,
        address token,
        uint256 totalSupply
    );

    function create(string memory _name, string memory _symbol, address _tokenReward, uint256 _totalSupply) external {
        TokenRevenueSharing token = new TokenRevenueSharing(_name, _symbol, _tokenReward, msg.sender, _totalSupply);
        allRevenueSharingTokens.push(address(token));
        emit Create(msg.sender, address(token), _totalSupply);
    }

    function addRevenueSharingTokenLength() external view returns(uint){
        return allRevenueSharingTokens.length;
    }
}