// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";


/// @title Vote - A secure voting contract with off-chain hashed signature verification
/// @notice Owner manages voting lifecycle; voters cast votes using off-chain signed messages
contract Vote is Ownable {
	using ECDSA for bytes32;

	string public voteName;
	bool public votingStarted;
	bool public votingEnded;
	uint64 public immutable minAge;
	uint64 public immutable maxAge;

	struct Candidate {
		string name;
		uint256 voteCount;
	}

	Candidate[] private candidates;
	mapping(address => bool) public hasVoted;
	mapping(address => uint256) public nonces;

	/// @dev Errors for efficient reverts
	error ErrorVotingNotStarted();
	error ErrorVotingEnded();
	error AlreadyVoted();
	error InvalidCandidate();
	error InvalidSignature();
	error InvalidAge();
	error InvalidNonce();

	/// @dev Emitted when voting starts
	event VotingStarted();
	/// @dev Emitted when voting ends
	event VotingEnded();
	/// @dev Emitted when a vote is cast
	event Voted(address indexed voter, uint256 indexed candidateIndex);

	/// @param _voteName Name of the vote
	/// @param candidateNames List of candidate names
	/// @param _minAge Minimum eligible age
	/// @param _maxAge Maximum eligible age (0 for no limit)
	constructor(
		string memory _voteName,
		string[] memory candidateNames,
		uint64 _minAge,
		uint64 _maxAge
	) Ownable(msg.sender) {
		require(bytes(_voteName).length > 0, "Vote name required");
		require(candidateNames.length > 0, "At least one candidate required");
		if (_maxAge != 0) require(_maxAge >= _minAge, "maxAge < minAge");

		voteName = _voteName;
		minAge = _minAge;
		maxAge = _maxAge;

		for (uint256 i; i < candidateNames.length; ++i) {
			require(bytes(candidateNames[i]).length > 0, "Candidate name required");
			candidates.push(Candidate(candidateNames[i], 0));
		}
	}

	modifier whenStarted() {
		if (!votingStarted) revert ErrorVotingNotStarted();
		_;
	}

	modifier whenNotEnded() {
		if (votingEnded) revert ErrorVotingEnded();
		_;
	}

	/// @notice Starts voting; only owner
	function startVoting() external onlyOwner {
		if (votingStarted) revert ErrorVotingNotStarted();
		votingStarted = true;
		emit VotingStarted();
	}

	/// @notice Ends voting; only owner
	function endVoting() external onlyOwner whenStarted whenNotEnded {
		votingEnded = true;
		emit VotingEnded();
	}

	/// @notice Cast a vote via off-chain signed message
	/// @param candidateIndex Index of chosen candidate
	/// @param age Voter's age
	/// @param nonce Unique nonce for replay protection
	/// @param signature Signer’s signature of the hashed payload
	function vote(
		uint256 candidateIndex,
		uint64 age,
		uint256 nonce,
		bytes calldata signature
	) external whenStarted whenNotEnded {
		if (nonce != nonces[msg.sender]) revert InvalidNonce();
		if (!isEligible(age)) revert InvalidAge();
		if (hasVoted[msg.sender]) revert AlreadyVoted();
		if (candidateIndex >= candidates.length) revert InvalidCandidate();

		// Recreate the message hash off-chain
		bytes32 messageHash = keccak256(
			abi.encodePacked(msg.sender, candidateIndex, age, nonce)
		);
		// prefix and hash per EIP‑191
		bytes32 ethSignedHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
		// recover signer
		address signer = ECDSA.recover(ethSignedHash, signature);
		if (signer != msg.sender) revert InvalidSignature();

		// Mark nonce used and record vote
		nonces[msg.sender]++;
		hasVoted[msg.sender] = true;
		candidates[candidateIndex].voteCount++;

		emit Voted(msg.sender, candidateIndex);
	}

	/// @notice Checks if age is within bounds
	function isEligible(uint64 age) public view returns (bool) {
		if (age < minAge) return false;
		if (maxAge != 0 && age > maxAge) return false;
		return true;
	}

	/// @notice Returns list of candidates
	function getCandidates() external view returns (Candidate[] memory) {
		return candidates;
	}

	/// @notice Returns list of candidate names
	function getCandidateNames() external view returns (string[] memory) {
		string[] memory names = new string[](candidates.length);
		for (uint i = 0; i < candidates.length; i++)
			names[i] = candidates[i].name;

		return names;
	}

	/// @notice Computes winners after voting ends
	/// @return winners Names of winners
	/// @return winningVoteCount Vote count of winners
	function getWinner() external view whenNotEnded returns (string[] memory winners, uint256 winningVoteCount)
	{
		if (!votingEnded) revert ErrorVotingNotStarted();

		uint256 len = candidates.length;
		uint256 maxVotes;
		uint256 count;

		for (uint256 i; i < len; ++i) {
			uint256 v = candidates[i].voteCount;
			if (v > maxVotes) maxVotes = v;
		}
		winningVoteCount = maxVotes;

		for (uint256 i; i < len; ++i) {
			if (candidates[i].voteCount == maxVotes) count++;
		}

		winners = new string[](count);
		for (uint256 i; i < len; ++i) {
			if (candidates[i].voteCount == maxVotes) {
				winners[--count] = candidates[i].name;
			}
		}
	}
}
