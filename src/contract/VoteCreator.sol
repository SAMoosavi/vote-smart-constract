// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7 <0.9.0;

import './Auth.sol';
import './Vote.sol';

contract VoteCreator {
    struct Set {
        address[] values;
        mapping(address => bool) is_in;
    }

    function add(address user) internal {
        if (!voteUsers.is_in[user]) {
            voteUsers.values.push(user);
            voteUsers.is_in[user] = true;
        }
    }

    Set private voteUsers;

    uint256 public authCreationFee = 1 ether;
    uint256 public voteCreationFee = 0.5 ether;

    mapping(address => address[]) public authContracts;
    mapping(address => address[]) public voteContracts;

    function createAuth(string memory _authName) internal returns (address) {
        Auth auth = new Auth(_authName);
        address authAddress = address(auth);
        authContracts[msg.sender].push(authAddress);
        return authAddress;
    }

    function createVote(
        address _authAddress,
        string memory _voteName,
        string[] memory candidateNames
    ) internal returns (address) {
        Vote vote = new Vote(_authAddress, _voteName, candidateNames);
        address voteAddress = address(vote);
        voteContracts[msg.sender].push(voteAddress);
        add(msg.sender);
        return voteAddress;
    }

    function createAuthAndVote(
        string memory _authName,
        string memory _voteName,
        string[] memory candidateNames
    ) public payable returns (address, address) {
        require(msg.value >= authCreationFee + voteCreationFee, 'Insufficient payment');

        address authAddress = createAuth(_authName);
        address voteAddress = createVote(authAddress, _voteName, candidateNames);

        return (authAddress, voteAddress);
    }

    function createVoteWithExistingAuth(
        address _authAddress,
        string memory _voteName,
        string[] memory candidateNames
    ) public payable returns (address) {
        require(msg.value >= voteCreationFee, 'Insufficient payment');

        return createVote(_authAddress, _voteName, candidateNames);
    }

    function getAuthContracts() public view returns (address[] memory) {
        return authContracts[msg.sender];
    }

    function getVoteContracts() public view returns (address[] memory) {
        return voteContracts[msg.sender];
    }

    function getAllAuthContracts() public view returns (address[] memory) {
        uint256 count = 0;
        address[] memory allAuthContracts;
        uint256 index = 0;

        for (uint k = 0; k < voteUsers.values.length; ++k) {
            address sender = voteUsers.values[k];
            for (uint256 i = 0; i < authContracts[sender].length; i++) {
                if (count == 0) {
                    allAuthContracts = new address[](authContracts[sender].length);
                } else {
                    address[] memory temp = new address[](count + authContracts[sender].length);
                    for (uint256 j = 0; j < count; j++) {
                        temp[j] = allAuthContracts[j];
                    }
                    allAuthContracts = temp;
                }
                allAuthContracts[index] = authContracts[sender][i];
                index++;
                count++;
            }
        }
        return allAuthContracts;
    }
}
