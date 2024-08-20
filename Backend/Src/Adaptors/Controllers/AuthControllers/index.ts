import registerController from './registerController'
export default (dependencies:any)=>{
    return {
   
        registerController:registerController(dependencies),
       
    }
   
   }
   