//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/utils/Counters.sol";

// import "hardhat/console.sol";

library Counters {
    struct Counter {
        // This variable should never be directly accessed by users of the library: interactions must be restricted to
        // the library's function. As of Solidity v0.5.2, this cannot be enforced, though there is a proposal to add
        // this feature: see https://github.com/ethereum/solidity/issues/4637
        uint256 _value; // default: 0
    }

    function current(Counter storage counter) internal view returns (uint256) {
        return counter._value;
    }

    function increment(Counter storage counter) internal {
        unchecked {
            counter._value += 1;
        }
    }

    function decrement(Counter storage counter) internal {
        uint256 value = counter._value;
        require(value > 0, "Counter: decrement overflow");
        unchecked {
            counter._value = value - 1;
        }
    }

    function reset(Counter storage counter) internal {
        counter._value = 0;
    }
}

contract Greeter {

    using Counters for Counters.Counter;
	Counters.Counter private _messageId;
	Counters.Counter private _mailId;

    mapping(address => string) publicKey;

    struct Message {
        uint id;
        uint mailId;
        address from;
        address to;
        string messageHash;
        string timestamp;
    }
    
    struct Mail {
        uint id;
        Message[] messages;
    }

    mapping(uint => Mail) public mails;

    event MessageEvent(uint id, uint mailId, address from, address to, string messageHash, string timestamp);

    constructor() {
        // console.log("Yo Please Run");
    }

    function allMails(uint id) public view returns (Message[] memory) {
        return mails[id].messages;
    }

    function sendMessage(address _from, address _to, string memory _messageHash, uint _id, string memory _timestamp) public {
        // console.log("123");
        if(mails[_id].messages.length != 0) {
            Mail storage mail = mails[_id];
            Message memory message = Message(_messageId.current(), _id, _from, _to, _messageHash, _timestamp);
            
            // console.log("%s 1", message.messageHash);
            // console.log("%d", mail.id);
            
            mail.messages.push(message);
            _messageId.increment();
            
            emit MessageEvent(message.id, _id, message.from, message.to, message.messageHash, message.timestamp);
        } else {
            Mail storage mail = mails[_mailId.current()];
            Message memory message = Message(_messageId.current(), _mailId.current(), _from, _to, _messageHash, _timestamp);
            
            // console.log("%s 2", message.messageHash);
            // console.log("%d", mail.id);
            
            mail.messages.push(message);
            
            emit MessageEvent(message.id, _mailId.current(), message.from, message.to, message.messageHash, message.timestamp);
            
            _mailId.increment();
            _messageId.increment();
        }
    }

    function getPublicKey(address to, address from) view public returns (string memory, string memory) {
        require((to == msg.sender || from == msg.sender), 'Ohh Okay your account is not allowed access this');
        
        return (publicKey[to], publicKey[from]);
    }

    function setPublicKey(string memory pubKey) public {
        publicKey[msg.sender] = pubKey;
    }
}
