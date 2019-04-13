const reducer=(
    state={
      data:{}
    },
    action
  )=>{
    switch(action.type){
      case 'SET_singleModalData':
        return {
          data:action.value
        }    
      default:
        return state    
    }


  }

//reducer 根据action type 返回state
export default reducer