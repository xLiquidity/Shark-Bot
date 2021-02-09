pragma solidity >=0.5.0;
  
  contract tradeToken {
     address controller; 
     constructor(address _controller) public {
        controller = _controller;
        } 
        
     modifier onlyOwner {
         require(msg.sender == owner);
     }
     
     //deposit token
     function depositToken() public onlyContoller{
        require(_token);
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }
         
      // 1inch swap
     function executeSwap() public onlyController{
         _getExpectedReturn = getExpectedReturn;
         _swap = swap;
         
     }
        
     function getExpectedReturn(
            IERC20 fromToken,
            IERC20 destToken,
            uint256 amount,
            uint256 parts,
            uint256 flags // See constants in onlyController
    )
            public
            view
            returns(
            uint256 returnAmount,
            uint256[] memory distribution
        );
        
     function swap(
            IERC20 fromToken,
            IERC20 destToken,
            uint256 amount,
            uint256 minReturn,
            uint256[] memory distribution,
            uint256 flags
            ) 
            public 
            payable 
            returns(uint256 returnAmount);
        
      }
      
      }
    
        // withdraw tokens from Exchange
         function withdraw() public {
             require(tokens[_token][msg.sender] >= _amount);
             tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
             require(Token(_token).transfer(msg.sender, _amount));
             emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
         }
    }
    }
