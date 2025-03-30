// SPDX-License-Identifier: MIT
pragma solidity >=0.8.7 <0.9.0;

contract Auth {
	uint public userCount = 0;
	string public name;

	mapping(string => User) public usersList;

	struct User {
		string username;
		string email;
		bytes32 hashedPassword;
	}

	string[] public userKeys;

	event UserCreated(string username, string email);

	constructor(string memory _name) {
		name = _name;
	}

	function isUserExisting(string memory _username) internal view returns (bool) {
		return bytes(usersList[_username].username).length > 0;
	}

	modifier onlyNotExistingUser(string memory _username) {
		require(!isUserExisting(_username), 'User already exists');
		_;
	}

	function hasher(string memory _password, string memory _username) internal pure returns (bytes32) {
		return keccak256(abi.encodePacked(_password, _username));
	}

	function createUser(
		string memory _username,
		string memory _email,
		string memory _password
	) public onlyNotExistingUser(_username) {
		userCount++;
		bytes32 _hashedPassword = hasher(_password, _username);
		usersList[_username] = User(_username, _email, _hashedPassword);
		userKeys.push(_username);
		emit UserCreated(_username, _email);
	}

	function verifyPassword(string memory _username, string memory _password) public view returns (bool) {
		bytes32 _hashedPassword = hasher(_password, _username);
		return usersList[_username].hashedPassword == _hashedPassword;
	}

	function change_password(string memory _username, string memory _oldPassword, string memory _newPassword) public {
		require(verifyPassword(_username, _oldPassword), 'Invalid old password');
		bytes32 _hashedNewPassword = hasher(_newPassword, _username);
		usersList[_username].hashedPassword = _hashedNewPassword;
	}

	struct ReturnedUser {
		string username;
		string email;
	}

	function get_users() public view returns (ReturnedUser[] memory) {
		ReturnedUser[] memory allUsers = new ReturnedUser[](userKeys.length);
		for (uint i = 0; i < userKeys.length; i++) {
			User storage user = usersList[userKeys[i]];
			allUsers[i] = ReturnedUser(user.username, user.email);
		}
		return allUsers;
	}

}
