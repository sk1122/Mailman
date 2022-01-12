//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract Greeter {

    using Counters for Counters.Counter;
	Counters.Counter private _messageId;
	Counters.Counter private _mailId;

    mapping(address => string) publicKey;

    struct Message {
        uint id;
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

    event MessageEvent(Message message);
    event MailEvent(Mail mail);

    constructor() {
        console.log("Yo Please Run");
    }

    function sendMessage(address _from, address _to, string memory _messageHash, uint _id, string memory _timestamp) public {
        console.log("123");
        if(mails[_id].messages.length != 0) {
            Mail storage mail = mails[_id];
            Message memory message = Message(_messageId.current(), _from, _to, _messageHash, _timestamp);
            
            console.log("%s 1", message.messageHash);
            console.log("%d", mail.id);
            
            mail.messages.push(message);
            _messageId.increment();
            
            emit MessageEvent(message);
            emit MailEvent(mail);
        } else {
            Mail storage mail = mails[_mailId.current()];
            Message memory message = Message(_messageId.current(), _from, _to, _messageHash, _timestamp);
            
            console.log("%s 2", message.messageHash);
            console.log("%d", mail.id);
            
            mail.messages.push(message);
            
            emit MessageEvent(message);
            emit MailEvent(mail);
            
            _mailId.increment();
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
