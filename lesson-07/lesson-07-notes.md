# Solidity with example - Voting:

Ballot is voting system with delegation, allowing an organizer (contract creator), to create a list of proposals then let users vote on them. Users can either vote or delegate their voting power to other users.



## Understanding the codebase:

After understanding the logic behind the contract, now let's dive deep into the code. For the purpose of this walkthrough, I believe it would be very useful to over explain certain lines by keeping the conversation as verbose as possible.

Personally, I learn by teaching others and explaining concepts I thought I understood. //TODO







```solidity
struct Voter {
    uint weight;
    bool voted;
    address delegate;
    uint vote;
}
```

`Voter` struct represents a voter, which includes:

- `weight`: this is the voting power of the user that can increase if others delegated their voting rights to him.
- `voted` : boolean to track whether the user has voted or not.
- `delegate` : the address of the person this current voter delegated their voting rights to.
- `vote` : the index of the proposal the user voted for. The proposals are in an array accessed by its index.

What is `struct`: Custom data type that allows you to group multiple variables into a single entity. Useful if you want to store multiple attributes about a single entity.



```solidity
struct Proposal {
    bytes32 name;
    uint voteCount;
}
```



`Proposal` struct representing a proposal, which includes:

- `name` : a short name for the proposal (up to 32 bytes)
- `voteCount` :  # of votes accumulated by this proposal



State Variables :

```solidity
address public chairperson;
```

- Stores the address of the person who deploys the contract. 
- He can give other users voting rights. (20 bytes value: Ethereum address).
- Visibility modifier set to `public` which means the function will be accessible from outside the contract via the automatically generated "getter" function.

```solidity
mapping(address => Voter) public voters;
```

- `(address => Voter)` specifies the type of the key and the value for this mapping
- So, each key in the `voters` mapping is going to be an Ethereum address.
- And, each value in the mapping is going to point to a `Voter` struct that holds the details of a particular vote. 

```solidity
```



- `proposals` : array of `proposal` structs to hold all proposals.

Constructor: 

```solidity
constructor(bytes32[] memory proposalNames) {
    chairperson = msg.sender;
    voters[chairperson].weight = 1;
    
    for (uint i = 0; i < proposalNames.length; i++) {
        proposals.push(Proposal({
            name: proposalNames[i],
            voteCount: 0
        }));
    }
}
```

- Executed only once at the time of deploying the contract.
- It's sole responsibility is to initialize the contract with certain information.
- Sets the deployer (`msg.sender`, the address of the account that deploys the contract) as the `chairperson`.
- `voters` is a mapping that associates an address with a `Voter` struct.
- `voters[chairperson].weight = 1;`, assigns a voting `weight` of 1 to `chairperson`. This allows the chairman to also participate in voting or delegating their voting rights.





Full comments code

```solidity
import { expect } from "chai";
import { toHex, hexToString } from "viem";
import { viem } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

async function deployContract() {
  const publicClient = await viem.getPublicClient();
  const [deployer, otherAccount] = await viem.getWalletClients();
  const ballotContract = await viem.deployContract("Ballot", [
    PROPOSALS.map((prop) => toHex(prop, { size: 32 })),
  ]);
  return { publicClient, deployer, otherAccount, ballotContract };
}

describe("Ballot", async () => {
  // Test suite for scenarios when the contract is deployed
  describe("when the contract is deployed", async () => {
    // Test case to verify that the contract has the correct proposals
    it("has the provided proposals", async () => {
      // Load the deployed contract fixture
      const { ballotContract } = await loadFixture(deployContract);

      // Iterate over each proposal index
      for (let index = 0; index < PROPOSALS.length; index++) {
        // Retrieve the proposal from the contract using the index
        // The proposal is retrieved from the 'proposals' array in the contract
        // and is returned in a hexadecimal format.
        const proposal = await ballotContract.read.proposals([BigInt(index)]);
        // Convert the proposal from hex to string and compare it with the expected proposal
        expect(hexToString(proposal[0], { size: 32 })).to.eq(PROPOSALS[index]);
      }
    });
    it("has zero votes for all proposals", async () => {
      const { ballotContract } = await loadFixture(deployContract);
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.read.proposals([BigInt(index)]);
        expect(proposal[1]).to.eq(0n);
      }
    });

    it("sets the deployer address as chairperson", async () => {
      const { ballotContract, deployer } = await loadFixture(deployContract);
      const chairperson = await ballotContract.read.chairperson();
      expect(chairperson.toLowerCase()).to.eq(deployer.account.address);
    });

    it("sets the voting weight for the chairperson as 1", async () => {
      const { ballotContract } = await loadFixture(deployContract);
      const chairperson = await ballotContract.read.chairperson();
      const chairpersonVoter = await ballotContract.read.voters([chairperson]);
      expect(chairpersonVoter[0]).to.eq(1n);
    });
  });

  describe("when the chairperson interacts with the giveRightToVote function in the contract", async () => {
    it("gives right to vote for another address", async () => {
      // TODO
      throw Error("Not implemented");
    });
    it("can not give right to vote for someone that has voted", async () => {
      // TODO
      throw Error("Not implemented");
    });
    it("can not give right to vote for someone that has already voting rights", async () => {
      // TODO
      throw Error("Not implemented");
    });
  });

  describe("when the voter interacts with the vote function in the contract", async () => {
    // TODO
    it("should register the vote", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when the voter interacts with the delegate function in the contract", async () => {
    // TODO
    it("should transfer voting power", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when an account other than the chairperson interacts with the giveRightToVote function in the contract", async () => {
    // TODO
    it("should revert", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when an account without right to vote interacts with the vote function in the contract", async () => {
    // TODO
    it("should revert", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when an account without right to vote interacts with the delegate function in the contract", async () => {
    // TODO
    it("should revert", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interacts with the winningProposal function before any votes are cast", async () => {
    // TODO
    it("should return 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interacts with the winningProposal function after one vote is cast for the first proposal", async () => {
    // TODO
    it("should return 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interacts with the winnerName function before any votes are cast", async () => {
    // TODO
    it("should return name of proposal 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interacts with the winnerName function after one vote is cast for the first proposal", async () => {
    // TODO
    it("should return name of proposal 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interacts with the winningProposal function and winnerName after 5 random votes are cast for the proposals", async () => {
    // TODO
    it("should return the name of the winner proposal", async () => {
      throw Error("Not implemented");
    });
  });
});

```



















