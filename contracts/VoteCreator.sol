// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./Vote.sol";

/// @title VoteCreator - A factory for deploying Vote contracts
/// @notice Users can create Vote instances by paying a fee; owner can manage fees and withdraw proceeds.
contract VoteCreator is Ownable {
	using EnumerableSet for EnumerableSet.AddressSet;

	/// @dev Tracks addresses of users who have created votes
	EnumerableSet.AddressSet private _creators;

	/// @notice Fee required to create a new Vote contract
	uint256 public voteCreationFee;

	/// @notice Total number of Vote contracts created
	uint64 public totalVotes;

	/// @notice Details of a created Vote
	struct VoteData {
		address voteAddress;
		string voteName;
	}

	/// @dev Maps creator address to their VoteData[]
	mapping(address => VoteData[]) private _votesByCreator;

	/// @dev Thrown when payment is insufficient
	error InsufficientPayment(uint256 required, uint256 provided);
	/// @dev Thrown when no votes exist
	error NoVotesCreated();

	/// @notice Emitted when a new Vote is deployed
	event VoteCreated(address indexed creator, address voteAddress, string voteName);
	/// @notice Emitted when the creation fee is updated
	event VoteCreationFeeUpdated(uint256 oldFee, uint256 newFee);
	/// @notice Emitted when accumulated fees are withdrawn
	event FeesWithdrawn(address indexed to, uint256 amount);

	/// @param _initialFee Initial fee to create votes
	constructor(uint256 _initialFee) Ownable(msg.sender) {
		voteCreationFee = _initialFee;
	}

	/// @notice Updates the fee required to create a Vote
	/// @param newFee The new creation fee (in wei)
	function setVoteCreationFee(uint256 newFee) external onlyOwner {
		emit VoteCreationFeeUpdated(voteCreationFee, newFee);
		voteCreationFee = newFee;
	}

	/// @notice Deploys a new Vote contract
	/// @param voteName The name of the vote
	/// @param candidateNames Array of candidate names
	/// @param minAge Minimum eligible age
	/// @param maxAge Maximum eligible age (0 for no upper limit)
	function createVote(
		string calldata voteName,
		string[] calldata candidateNames,
		uint64 minAge,
		uint64 maxAge
	) external payable {
		if (msg.value < voteCreationFee) {
			revert InsufficientPayment({required: voteCreationFee, provided: msg.value});
		}

		Vote vote = new Vote(voteName, candidateNames, minAge, maxAge, msg.sender);
		address voteAddr = address(vote);

		_votesByCreator[msg.sender].push(VoteData(voteAddr, voteName));
		_creators.add(msg.sender);
		unchecked { totalVotes++; }

		emit VoteCreated(msg.sender, voteAddr, voteName);
	}

	/// @notice Returns Vote contracts created by caller
	/// @return Array of VoteData structs
	function getMyVotes() external view returns (VoteData[] memory) {
		return _votesByCreator[msg.sender];
	}

	/// @notice Returns all Vote contracts created by all users
	/// @dev Iterates over creators and aggregates their votes
	/// @return allVotes Array of VoteData
	function getAllVotes() external view returns (VoteData[] memory allVotes) {
		uint64 count = totalVotes;
		if (count == 0) revert NoVotesCreated();

		allVotes = new VoteData[](count);
		uint256 idx;

		for (uint256 i = 0; i < _creators.length(); ++i) {
			address creator = _creators.at(i);
			VoteData[] storage creatorVotes = _votesByCreator[creator];
			for (uint256 j = 0; j < creatorVotes.length; ++j) {
				allVotes[idx++] = creatorVotes[j];
			}
		}
	}

	/// @notice Allows owner to withdraw collected fees
	/// @param to Destination address for withdrawal
	function withdrawFees(address payable to) external onlyOwner {
		uint256 balance = address(this).balance;
		if (balance == 0) revert NoVotesCreated();
		to.transfer(balance);
		emit FeesWithdrawn(to, balance);
	}

	/// @notice Checks if a user created a specific Vote contract
	/// @param voteAddress The address of the vote contract to check
	/// @return True if the caller created the Vote contract
	function AccessToVote(address voteAddress) external view returns (bool) {
		VoteData[] storage creatorVotes = _votesByCreator[msg.sender];
		for (uint256 i = 0; i < creatorVotes.length; ++i) {
			if (creatorVotes[i].voteAddress == voteAddress) {
				return true;
			}
		}
		return false;
	}

	/// @notice Returns the total number of Vote contracts created
	/// @return The total number of Vote contracts
	function getNumberOfVotes() external view returns (uint64) {
		return totalVotes;
	}

	/// @notice Returns the number of Vote contracts created by the caller
	/// @return The number of votes created by the caller
	function getNumberOfMyVotes() external view returns (uint256) {
		return _votesByCreator[msg.sender].length;
	}
}
