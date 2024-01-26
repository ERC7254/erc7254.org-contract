// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./erc7254/ERC7254.sol";
import "./interface/IWETH.sol";

contract TokenRevenueSharing is ERC7254, ReentrancyGuard {

    address public WETH = 0x4200000000000000000000000000000000000023;
    constructor(string memory _name, string memory _symbol, address _tokenReward, uint256 _amount)  ERC7254(_name, _symbol, _tokenReward) {
        _mint(_msgSender(), _amount);
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    // UPDATE REWARD WITH ETH 
    function updateReward(address[] memory token, uint256[] memory amount) public  virtual override payable {
       require(token.length == amount.length, "ERC7254: token and amount length mismatch");
       address owner = _msgSender();
       if(totalSupply() != 0){
            for( uint256 i = 0; i < token.length; ++i){
                require(existsTokenReward(token[i]), "ERC7254: token reward is not approved");
                uint256 amountReward = 0;
                if(token[i] == WETH && msg.value != 0){
                    IWETH(WETH).deposit{value: msg.value}();
                    amountReward = msg.value;
                }else{
                    IERC20(token[i]).transferFrom(owner, address(this), amount[i]);
                    amountReward = amount[i];
                }
                _updateRewardPerShare(token[i], amountReward);
                emit UpdateReward(owner, amountReward);
            }
            
        }    
    }

    // GET REWARD WITH ETH 
    function getReward(address[] memory _token, address to) public nonReentrant virtual override {
        address owner = _msgSender();
        for( uint i = 0; i < _token.length; ++i){
            UserInformation memory user = informationOf(_token[i],owner);
            uint reward = balanceOf(owner) * getRewardPerShare(_token[i]) + user.inReward - user.withdraw - user.outReward;
            _withdraw(_token[i], owner, reward);
            if(reward / MAX > 0){
                if(_token[i] == WETH){
                    IWETH(WETH).withdraw(reward / MAX);
                    (bool success,) = to.call{value:reward / MAX}(new bytes(0));
                    require(success, 'TransferHelper: ETH_TRANSFER_FAILED');
                    // TransferHelper.safeTransferETH(_to, reward);
                }else{
                    // TransferHelper.safeTransfer(tokenReward, _to, reward); 
                    (bool success, bytes memory data) = _token[i].call(abi.encodeWithSelector(0xa9059cbb, to, reward / MAX));
                    require(success && (data.length == 0 || abi.decode(data, (bool))), 'TransferHelper: TRANSFER_FAILED');
                }
            }  
            emit GetReward(owner, to, reward / MAX);
        }
    }
}