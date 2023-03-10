pragma solidity ^0.5.0;

import "./RWD.sol";
import "./Tether.sol";

contract DecentralBank {
    string public name = "Decentral Bank";
    address public owner;
    Tether public tether;
    RWD public rwd;

    constructor(RWD _rwd, Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
    }

    address[] public stakers;

    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    function depositTokens(uint256 _amount) public {
        require(_amount > 0, "amount can not be zero");
        // transfer tether tokens to this contract addressing  for staking
        tether.transferFrom(msg.sender, address(this), _amount);

        stakingBalance[msg.sender] += _amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // update staking information
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }
}
