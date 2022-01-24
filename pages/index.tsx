export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">payout_calculator</div>

      <div className="p-2"></div>

      <div className=" flex p-1 my-1 rounded">
        <div className=" flex p-2 text-gray-600 rounded w-20 h-6 mx-1 justify-center">Name</div>
        <div className=" flex p-2 text-gray-600 rounded w-20 h-6 mx-1 justify-center">Out</div>
        <div className=" flex p-2 text-gray-600 rounded w-20 h-6 mx-1 justify-center">In</div>
        <div className=" flex p-2 text-gray-600 rounded w-20 h-6 mx-1 justify-center">Net</div>
      </div>

      {/* A player element */}
      <div className=" flex bg-gray-700 p-1 my-2 rounded">
        <input className=" bg-gray-600 p-2  rounded w-20 h-6 mx-1"></input>
        <input className=" bg-gray-600 p-2  rounded w-20 h-6 mx-1"></input>
        <input className=" bg-gray-600 p-2  rounded w-20 h-6 mx-1"></input>
        <div className=" bg-gray-400 p-2  rounded w-20 h-6 mx-1"></div>
      </div>
      <div className=" flex bg-gray-700 p-1 my-2 rounded">
        <input className=" bg-gray-600 p-2  rounded w-20 h-6 mx-1"></input>
        <input className=" bg-gray-600 p-2  rounded w-20 h-6 mx-1"></input>
        <input className=" bg-gray-600 p-2  rounded w-20 h-6 mx-1"></input>
        <div className=" bg-gray-400 p-2  rounded w-20 h-6 mx-1"></div>
      </div>
      <div className=" flex bg-gray-700 p-1 my-2 rounded">
        <input className=" bg-gray-600 p-2  rounded w-20 h-6 mx-1"></input>
        <input className=" bg-gray-600 p-2  rounded w-20 h-6 mx-1"></input>
        <input className=" bg-gray-600 p-2  rounded w-20 h-6 mx-1"></input>
        <div className=" bg-gray-400 p-2  rounded w-20 h-6 mx-1"></div>
      </div>
      <div className=" flex bg-gray-700 p-1 my-2 rounded">
        <input className=" bg-gray-600 p-2  rounded w-20 h-6 mx-1"></input>
        <input className=" bg-gray-600 p-2  rounded w-20 h-6 mx-1"></input>
        <input className=" bg-gray-600 p-2  rounded w-20 h-6 mx-1"></input>
        <div className=" bg-gray-400 p-2  rounded w-20 h-6 mx-1"></div>
      </div>
      <div className=" flex bg-gray-700 p-1 my-2 rounded">
        <input className=" bg-gray-600 p-2  rounded w-20 h-6 mx-1"></input>
        <input className=" bg-gray-600 p-2  rounded w-20 h-6 mx-1"></input>
        <input className=" bg-gray-600 p-2  rounded w-20 h-6 mx-1"></input>
        <div className=" bg-gray-400 p-2  rounded w-20 h-6 mx-1"></div>
      </div>
      

      <div className="p-2"></div>

      <button className="p-2 flex border bg-gray-600 font-medium rounded hover:font-bold active:text-gray-400 active: border-gray-400">
        CALCULATE
      </button>
    </div>
  );
}
