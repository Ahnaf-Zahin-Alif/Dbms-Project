import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Homepage from "./pages/Homepage";
import MainLayout from "./layouts/MainLayout";

const router = createBrowserRouter([
  {
    path : "/",
    Component : MainLayout,
    children :[
      {
        index : true, 
        element : <Homepage/>
      }
      
       
      
    ]



  },
]);

function Router(){
  return(
    <RouterProvider router={router}/>
  )
}

export default Router;