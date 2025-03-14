// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './Auth.sol';

contract Vote {
    Auth private auth;
    address private immutable owner;
    string public voteName;
    bool public votingStarted;
    bool public votingEnded;

    struct Candidate {
        string name;
        uint voteCount;
    }

    Candidate[] private candidates;
    mapping(bytes32 => bool) public hasVoted;

    event VotingStarted();
    event VotingEnded();
    event VoteCasted(address indexed voter, uint candidateIndex);

    constructor(address _authAddress, string memory _voteName, string[] memory candidateNames) {
        auth = Auth(_authAddress);
        voteName = _voteName;
        owner = msg.sender;
        for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate({name: candidateNames[i], voteCount: 0}));
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner, 'Only owner can call this function');
        _;
    }

    modifier whenStarted() {
        require(votingStarted, 'Voting has not started yet');
        _;
    }

    modifier whenNotEnded() {
        require(!votingEnded, 'Voting has ended');
        _;
    }

    function startVoting() external onlyOwner {
        require(!votingStarted, 'Voting has already started');
        votingStarted = true;
        emit VotingStarted();
    }

    function endVoting() external onlyOwner whenStarted whenNotEnded {
        votingEnded = true;
        emit VotingEnded();
    }

    function verifyUser(
        string memory _username,
        string memory _password
    ) private view returns (bool) {
        return auth.verifyPassword(_username, _password);
    }

    modifier onlyAuthenticated(string memory _username, string memory _password) {
        require(verifyUser(_username, _password), 'Invalid credentials');
        _;
    }

    function vote(
        uint candidateIndex,
        string memory _username,
        string memory _password
    ) external whenStarted whenNotEnded onlyAuthenticated(_username, _password) {
        bytes32 _hashedPassword = keccak256(abi.encodePacked(_password, _username));

        require(!hasVoted[_hashedPassword], 'You have already voted');
        require(candidateIndex < candidates.length, 'Invalid candidate index');

        hasVoted[_hashedPassword] = true;
        candidates[candidateIndex].voteCount++;
        emit VoteCasted(msg.sender, candidateIndex);
    }

    function getWinner() external view returns (string[] memory winners, uint winningVoteCount) {
        require(votingEnded, 'Voting has not ended yet');
        uint candidateCount = candidates.length;
        // Temporary array allocated with maximum possible size.
        string[] memory tempWinners = new string[](candidateCount);
        uint count = 0;
        winningVoteCount = 0;

        // Loop once over the candidates to determine the winning vote count and record winners.
        for (uint i = 0; i < candidateCount; ) {
            uint votes = candidates[i].voteCount;
            if (votes > winningVoteCount) {
                winningVoteCount = votes;
                count = 0; // Reset count if a new high is found.
                tempWinners[count] = candidates[i].name;
                unchecked {
                    count = 1;
                }
            } else if (votes == winningVoteCount) {
                tempWinners[count] = candidates[i].name;
                unchecked {
                    count++;
                }
            }
            unchecked {
                i++;
            }
        }

        // Allocate a new array with the exact size of winners.
        winners = new string[](count);
        for (uint i = 0; i < count; ) {
            winners[i] = tempWinners[i];
            unchecked {
                i++;
            }
        }

        return (winners, winningVoteCount);
    }

    // Get the total number of candidates.
    function getCandidateCount() external view returns (uint) {
        return candidates.length;
    }

    // Retrieve all candidates.
    function getCandidates() external view returns (Candidate[] memory) {
        return candidates;
    }
}
