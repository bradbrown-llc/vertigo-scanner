// SPDX-License-Identifier: 0BSD
pragma solidity 0.8.24;

contract ERC20 {

    function name() external pure returns (string memory) { return "DizzyHavoc"; }
    function symbol() external pure returns (string memory) { return "DZHV"; }
    function decimals() external pure returns (uint8) { return 18; }
    
    uint public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;

    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);
    event Burn(uint dest, address addr, uint val);

    function burn(uint dest, address addr, uint val) external {
        totalSupply -= val;
        balanceOf[msg.sender] -= val;
        emit Transfer(msg.sender, address(0), val);
        emit Burn(dest, addr, val);
    }

    function mint(address addr, uint val) payable external {
        balanceOf[addr] += val;
        totalSupply += val;
        emit Transfer(address(0), addr, val);
    }

    function transfer(address to, uint amount) external {
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
    }

    function transferFrom(address from, address to, uint amount) external {
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
    }

    function approve(address spender, uint amount) external {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
    }

}

608060405234801561001057600080fd5b50610cf3806100206000396000f3fe60806040526004361061009c5760003560e01c806340c10f191161006457806340c10f191461017457806370a082311461019057806395d89b41146101cd5780639eea5f66146101f8578063a9059cbb14610221578063dd62ed3e1461024a5761009c565b806306fdde03146100a1578063095ea7b3146100cc57806318160ddd146100f557806323b872dd14610120578063313ce56714610149575b600080fd5b3480156100ad57600080fd5b506100b6610287565b6040516100c39190610971565b60405180910390f35b3480156100d857600080fd5b506100f360048036038101906100ee9190610a2c565b6102c4565b005b34801561010157600080fd5b5061010a6103ae565b6040516101179190610a7b565b60405180910390f35b34801561012c57600080fd5b5061014760048036038101906101429190610a96565b6103b4565b005b34801561015557600080fd5b5061015e61055d565b60405161016b9190610b05565b60405180910390f35b61018e60048036038101906101899190610a2c565b610566565b005b34801561019c57600080fd5b506101b760048036038101906101b29190610b20565b61063e565b6040516101c49190610a7b565b60405180910390f35b3480156101d957600080fd5b506101e2610656565b6040516101ef9190610971565b60405180910390f35b34801561020457600080fd5b5061021f600480360381019061021a9190610b4d565b610693565b005b34801561022d57600080fd5b5061024860048036038101906102439190610a2c565b6107a7565b005b34801561025657600080fd5b50610271600480360381019061026c9190610ba0565b6108bc565b60405161027e9190610a7b565b60405180910390f35b60606040518060400160405280600a81526020017f44697a7a794861766f6300000000000000000000000000000000000000000000815250905090565b80600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925836040516103a29190610a7b565b60405180910390a35050565b60005481565b80600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546104409190610c0f565b9250508190555080600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546104969190610c0f565b9250508190555080600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546104ec9190610c43565b925050819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516105509190610a7b565b60405180910390a3505050565b60006012905090565b80600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546105b59190610c43565b92505081905550806000808282546105cd9190610c43565b925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516106329190610a7b565b60405180910390a35050565b60016020528060005260406000206000915090505481565b60606040518060400160405280600481526020017f445a485600000000000000000000000000000000000000000000000000000000815250905090565b806000808282546106a49190610c0f565b9250508190555080600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546106fa9190610c0f565b92505081905550600073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405161075f9190610a7b565b60405180910390a37fe1b6e34006e9871307436c226f232f9c5e7690c1d2c4f4adda4f607a75a9beca83838360405161079a93929190610c86565b60405180910390a1505050565b80600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546107f69190610c0f565b9250508190555080600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461084c9190610c43565b925050819055508173ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516108b09190610a7b565b60405180910390a35050565b6002602052816000526040600020602052806000526040600020600091509150505481565b600081519050919050565b600082825260208201905092915050565b60005b8381101561091b578082015181840152602081019050610900565b60008484015250505050565b6000601f19601f8301169050919050565b6000610943826108e1565b61094d81856108ec565b935061095d8185602086016108fd565b61096681610927565b840191505092915050565b6000602082019050818103600083015261098b8184610938565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006109c382610998565b9050919050565b6109d3816109b8565b81146109de57600080fd5b50565b6000813590506109f0816109ca565b92915050565b6000819050919050565b610a09816109f6565b8114610a1457600080fd5b50565b600081359050610a2681610a00565b92915050565b60008060408385031215610a4357610a42610993565b5b6000610a51858286016109e1565b9250506020610a6285828601610a17565b9150509250929050565b610a75816109f6565b82525050565b6000602082019050610a906000830184610a6c565b92915050565b600080600060608486031215610aaf57610aae610993565b5b6000610abd868287016109e1565b9350506020610ace868287016109e1565b9250506040610adf86828701610a17565b9150509250925092565b600060ff82169050919050565b610aff81610ae9565b82525050565b6000602082019050610b1a6000830184610af6565b92915050565b600060208284031215610b3657610b35610993565b5b6000610b44848285016109e1565b91505092915050565b600080600060608486031215610b6657610b65610993565b5b6000610b7486828701610a17565b9350506020610b85868287016109e1565b9250506040610b9686828701610a17565b9150509250925092565b60008060408385031215610bb757610bb6610993565b5b6000610bc5858286016109e1565b9250506020610bd6858286016109e1565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610c1a826109f6565b9150610c25836109f6565b9250828203905081811115610c3d57610c3c610be0565b5b92915050565b6000610c4e826109f6565b9150610c59836109f6565b9250828201905080821115610c7157610c70610be0565b5b92915050565b610c80816109b8565b82525050565b6000606082019050610c9b6000830186610a6c565b610ca86020830185610c77565b610cb56040830184610a6c565b94935050505056fea2646970667358221220066cd83975d34fe7bac954731806fbcaea9efff77ef93928f8c246d7759de0ef64736f6c63430008180033