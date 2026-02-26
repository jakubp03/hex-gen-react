import { useEffect, useState } from 'react';
import SideNav from './SideNav';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [favColors, setFavColors] = useState([]);
  const [currentHex, setCurrentHex] = useState("");
  const [currentHexFavorite, setCurrentHexFavorite] = useState("");
  const [tooltiptext, setToolTipText] = useState("copy");
  let hex = "0123456789abcdef";

  // activates once on page load as start
  //generates initial random color
  //loads fav colors from local storage
  useEffect(() => {
    HandleHexGeneration();
    const storedColors = JSON.parse(localStorage.getItem("hexGen"));
    if (storedColors) {
      setFavColors((prevFavColors) => {
        return [...prevFavColors, ...storedColors];
      });
      //DEBUG console.log("stored colors: " + storedColors);
    }
  }, []);

  //generates hex
  function GenerateHex() {
    let generatedHex = "#";
    for (let i = 0; i < 6; i++) {
      let cislo = Math.floor(Math.random() * hex.length);
      generatedHex += hex[cislo];
    }
    return generatedHex;
  }

  //applies hex to background, text color and current state (hook)
  function HandleHexGeneration() {
    let hex = GenerateHex();
    setCurrentHex(hex);
    document.body.style.backgroundColor = hex;
    document.getElementById("textColor").style.color = hex;
    console.log("color: " + hex);
  }

  function HandleGenerateButtonClick() {
    HandleHexGeneration();
    setToolTipText("copy");
  }

  //we return boolean that indicates whether currently generated color is favorite 
  function IsIsntFavorite() {
    return favColors.some((favColor) => favColor.hex === currentHex);
  }

  //handles favorite side bar button click (on side)
  function HandleNavButtonClick() {
    setIsOpen(!isOpen);
  }

  //handles clicking on main part of the site when favorites side bar is open
  function HandleMainClick() {
    setIsOpen(false);
  }

  //handles adding generated color to favorites
  function HandleFavoriteClick(color2fav) {
    if (!currentHexFavorite) {
      setFavColors((prevFavColors) => [
        ...prevFavColors,
        { hex: color2fav, name: color2fav },
      ]);
      console.log(color2fav + "has been added to favorites");
    } else {
      RemoveColorFromFavorites(color2fav);
    }
  }

  //removes color from favorites (created as seperate function that way it can be used indempendently in child component)
  function RemoveColorFromFavorites(color2remove) {
    const newFavColors = favColors.filter((favColor) => {
      return favColor.hex !== color2remove;
    })
    setFavColors(newFavColors);
    console.log(color2remove + " has been removed from favorites");
  }

  //checks if currentHex is favorite
  //stores favorite colors to local storage when array changes
  useEffect(() => {
    setCurrentHexFavorite(IsIsntFavorite());
    localStorage.setItem("hexGen", JSON.stringify(favColors));
  }, [favColors, currentHex]);

  //copies to clipboard
  function CopyToClipboard(color2copy) {
    if (navigator.clipboard && window.isSecureContext) {
      //navigator API
      navigator.clipboard.writeText(color2copy);
    } else {
      //exec command API
      let textArea = document.createElement("textarea");
      textArea.value = color2copy;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((res, rej) => {
        document.execCommand('copy') ? res() : rej();
        textArea.remove();
      });
    }
    console.log(color2copy + " has been copied!");
  }

  //handles clicking on the outlined hex to copy 
  function HandleTextColorClick() {
    setToolTipText("copied!");
    CopyToClipboard(currentHex);
    setTimeout(() => {
      setToolTipText("copy")
    }, 500);
  }

  return (
    <>
      <SideNav isOpen={isOpen} favColors={favColors} setFavColors={setFavColors} copyFuc={CopyToClipboard} favFunc={RemoveColorFromFavorites} />
      {/* MAIN */}
      <div id='main' onClick={HandleMainClick} className={`flex items-center justify-center flex-row transition-all duration-500 p-5 h-screen ${isOpen ? "mr-0 sm:mr-[350px]" : "mr-0"}`}>
        <div id='container' className='flex items-center justify-center flex-col h-[70vh] uppercase'>
          <div id='text' className='inline p-3 bg-black/50 rounded-xl shadow-custom-shadow'>
            <div id='text1' className='inline text-white mr-3 select-none'>random color</div>
            <div id='tooltip' className='relative inline-block'>
              <div className='group'>
                <div id='textColor' onClick={HandleTextColorClick} className='text-[120%] font-bold p-1 rounded-lg relative hover:shadow-[inset_0_0_0_2px_white]'>{currentHex}</div>
                <span id='tooltiptext' className={`invisible w-max text-center text-[70%] bg-black text-white rounded-md p-2 absolute z-[1] bottom-[120%] left-2/4 ${tooltiptext === "copy" ? "-ml-5" : "-ml-[30px]"} after:absolute after:left-1/2 after:-translate-x-1/2 after:top-full after:border-8 after:border-solid after:border-black after:border-t-transparent after:border-r-transparent after:border-l-transparent after:rotate-180 group-hover:visible`}>{tooltiptext}</span>
              </div>
            </div>
          </div>
          {/* GENERATE BUTTON */}
          <div id='buttonGenerate' onClick={HandleGenerateButtonClick} className='inline p-2 bg-black/60 rounded-xl text-white mt-2 select-none shadow-[0_4px_8px_0_rgba(0,0,0,0.2),0_6px_20px_0_rgba(0,0,0,0.19)] hover:bg-[#545454]'>generate !</div>
        </div>
        <i id="setToFavStar" onClick={() => { HandleFavoriteClick(currentHex) }} className={`relative bottom-8 left-3 transition duration-300 ${currentHexFavorite ? "fa fa-star text-yellow-500" : "fa fa-star-o text-black hover:text-yellow-500"}`} aria-hidden="true"></i>
      </div>
      {/* SIDE BUTTON FAV */}
      <div className='absolute top-[70px] sm:top-[150px] flex flex-col right-0'>
        <div onClick={HandleNavButtonClick} className={`text-white p-5 bg-black/50 rounded-tl-[25px] rounded-bl-[25px] pl-5 relative transition-all duration-500 group ${isOpen ? "right-[70vw] sm:right-[350px]" : "right-0 hover:pl-12"}`}>
          <i className={`fa fa-star relative left-0 transition-all duration-500 text-yellow-500 ${isOpen ? "" : "group-hover:-left-[30px]"}`} aria-hidden="true"></i>
        </div>
      </div>
      {/* GITHUB LINK */}
      <div className='absolute bottom-5 left-5'>
        <a href="https://github.com/jakubp03/hex-gen-react" target="_blank" rel="noopener noreferrer" className='flex items-center gap-2 p-3 bg-black text-white rounded-lg shadow-custom-shadow transition-all duration-300 hover:bg-gray-800'>
          <i className="fa fa-github" aria-hidden="true"></i>
          <span className='text-sm'>GitHub</span>
        </a>
      </div>
    </>


  )
}

export default App
