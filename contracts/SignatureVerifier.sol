// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract SignatureVerifier {
    using ECDSA for bytes32;

    /**
     * @notice Returns the keccak256 hash of the original message.
     * @param _message The original message to sign.
     */
    function getMessageHash(string memory _message) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_message));
    }

    /**
     * @notice Returns an Ethereum Signed Message hash.
     * This recreates the hash that would have been signed by the wallet.
     * @param _messageHash The hash of the original message.
     */
    function getEthSignedMessageHash(bytes32 _messageHash) public pure returns (bytes32) {
        // Note: The "\n32" indicates that the original message hash is 32 bytes long.
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash));
    }

    /**
     * @notice Verifies that a given signature is valid for the provided message and signer.
     * @param _message The original message that was signed.
     * @param signature The signature generated off-chain.
     * @return True if the signature is valid and was signed by _signer, false otherwise.
     */
    function verify(
        string memory _message,
        bytes memory signature
    ) public view returns (bool) {
        bytes32 messageHash = getMessageHash(_message);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        // Recover the signer address using the signature and the Ethereum-signed message hash
        address recoveredSigner = ethSignedMessageHash.recover(signature);
        return recoveredSigner == msg.sender;
    }
}
