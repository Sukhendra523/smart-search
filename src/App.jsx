import { RouterProvider, createBrowserRouter, useSearchParams } from 'react-router-dom'
import './App.css'
import SmartSearch from './components/SmartSearch'

function App() {


  const fetchData = async (query) =>{
    const response = await fetch(
      `https://dummyjson.com/recipes/search?q=${query}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    return result.recipes;
  }

  // const staticData = [
  //   "apple",
  //   "banana",
  //   "berrl",
  //   "orange",
  //   "grape",
  //   "mango",
  //   "melon",
  //   "berry",
  //   "peach",
  //   "cherry",
  //   "plum",
  // ]

  const router= createBrowserRouter([
    {
      element:<SmartSearch 
      fetchData={fetchData} 
      // staticData={staticData}
      dataKey={'name'} 
      customLoading={<h1>Loading....</h1>} 
      // onBlur={} onChange={} onFocus={} onSelect={}
      />,
      path:'/',

    }
  ])

  return (
    <div>
      <RouterProvider router={router}/>


    </div>
  )
}

export default App
