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

	struct AuthData {
		address authAddress;
		string name;
	}

	struct VoteData {
		address voteAddress;
		string name;
		address authAdd;
	}

	mapping(address => AuthData[]) public authContracts;
	mapping(address => VoteData[]) public voteContracts;

	function createAuth(string memory _authName) public payable {
		require(msg.value >= authCreationFee, 'Insufficient payment');

		Auth auth = new Auth(_authName);
		address authAddress = address(auth);
		authContracts[msg.sender].push(AuthData(authAddress, _authName));
	}

	function createVote(address _authAddress, string memory _voteName, string[] memory candidateNames) public payable {
		require(msg.value >= voteCreationFee, 'Insufficient payment');

		Vote vote = new Vote(_authAddress, _voteName, candidateNames);
		address voteAddress = address(vote);
		voteContracts[msg.sender].push(VoteData(voteAddress, _voteName, _authAddress));
		add(msg.sender);
	}

	function getAuthContracts() public view returns (AuthData[] memory) {
		return authContracts[msg.sender];
	}

	function getVoteContracts() public view returns (VoteData[] memory) {
		return voteContracts[msg.sender];
	}

	function getAllVoteContracts() public view returns (VoteData[] memory) {
		uint256 count = 0;
		VoteData[] memory allVoteContracts;
		uint256 index = 0;

		for (uint k = 0; k < voteUsers.values.length; ++k) {
			address sender = voteUsers.values[k];
			for (uint256 i = 0; i < voteContracts[sender].length; i++) {
				if (count == 0) {
					allVoteContracts = new VoteData[](voteContracts[sender].length);
				} else {
					VoteData[] memory temp = new VoteData[](count + voteContracts[sender].length);
					for (uint256 j = 0; j < count; j++) {
						temp[j] = allVoteContracts[j];
					}
					allVoteContracts = temp;
				}
				allVoteContracts[index] = voteContracts[sender][i];
				index++;
				count++;
			}
		}
		return allVoteContracts;
	}

	function AccessToAuth(address _authAddress) public view returns (bool) {
		AuthData[] memory auths = authContracts[msg.sender];
		for (uint i = 0; i < auths.length; i++) {
			if (auths[i].authAddress == _authAddress) {
				return true;
			}
		}
		return false;
	}

	function AccessToVote(address _voteAddress) public view returns (bool) {
		VoteData[] memory auths = voteContracts[msg.sender];
		for (uint i = 0; i < auths.length; i++) {
			if (auths[i].voteAddress == _voteAddress) {
				return true;
			}
		}
		return false;
	}
}
