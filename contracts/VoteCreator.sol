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

	function createAuth(string memory _authName) public payable {
		require(msg.value >= authCreationFee, 'Insufficient payment');

		Auth auth = new Auth(_authName);
		address authAddress = address(auth);
		authContracts[msg.sender].push(authAddress);
	}

	function createVote(address _authAddress, string memory _voteName, string[] memory candidateNames) public payable {
		require(msg.value >= voteCreationFee, 'Insufficient payment');

		Vote vote = new Vote(_authAddress, _voteName, candidateNames);
		address voteAddress = address(vote);
		voteContracts[msg.sender].push(voteAddress);
		add(msg.sender);
		
	}

	function getAuthContracts() public view returns (address[] memory) {
		return authContracts[msg.sender];
	}

	function getVoteContracts() public view returns (address[] memory) {
		return voteContracts[msg.sender];
	}

	function getAllVoteContracts() public view returns (address[] memory) {
		uint256 count = 0;
		address[] memory allVoteContracts;
		uint256 index = 0;

		for (uint k = 0; k < voteUsers.values.length; ++k) {
			address sender = voteUsers.values[k];
			for (uint256 i = 0; i < authContracts[sender].length; i++) {
				if (count == 0) {
					allVoteContracts = new address[](authContracts[sender].length);
				} else {
					address[] memory temp = new address[](count + authContracts[sender].length);
					for (uint256 j = 0; j < count; j++) {
						temp[j] = allVoteContracts[j];
					}
					allVoteContracts = temp;
				}
				allVoteContracts[index] = authContracts[sender][i];
				index++;
				count++;
			}
		}
		return allVoteContracts;
	}
}
