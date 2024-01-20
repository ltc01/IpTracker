import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from '../public/images/icon-location.svg'

export function MapComponent({ latitude=28.6139, longitude=77.2090, city="New Delhi", country='IN', region="Delhi" }) {
  
  const [position, setPosition] = useState([latitude, longitude]);

  const customIcon = new L.Icon({
    iconUrl: markerIcon,
    iconSize: [30, 40], 
    iconAnchor: [16, 32],
  });

  useEffect(() => {
    setPosition([latitude, longitude]);
  }, [latitude, longitude]);

  return (
    <MapContainer center={[latitude, longitude]} zoom={10} scrollWheelZoom={false} style={{ width: '100%', height: '400px' }} >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} icon={customIcon}>
        <Popup >
          {city}, {region}, {country}
        </Popup>
      </Marker>
    </MapContainer>
  )
}

export function Record({ results }) {
  const tags = ["IP Address", "Location", "Timezone", "ISP"];

  return (
    <div className="flex w-[80%] max-sm:flex-col justify-evenly px-2 max-md:w-full max-sm:px-0 gap-4 max-sm:h-96 shadow-xl max-sm:py-2 rounded-xl py-6 bg-white h-40">
      {tags.map((items, index) => (
        <div key={index} className="pl-5 max-sm:py-1 flex-col max-sm:text-center font-semibold h-full">
          <h2 className="text-slate-600 max-sm:text-sm">{items}:</h2>
          <p className="py-4 max-sm:py-1 text-xl leading-6 h-full">
            {results && index === 0 && `${results.ip}`}
            {results && index === 1 && `${results.location.city} ${results.location.country}, ${results.location.postalCode}`}
            {results && index === 2 && `UTC${results.location.timezone}`}
            {results && index === 3 && `${results.isp}`}
          </p>
        </div>
      ))}
    </div>
  )
}
function App() {

  const [results, setResults] = useState(null);
  const [ipadress, setIpaddress] = useState('');
  const [error, setError] = useState(null);

  const handleInput = (e) => {
    setIpaddress(e.target.value);
  };

  const handleTrackIP = async () => {
    if (ipadress === "") {
      setError("No information found!! Please provide IP address to track.");
      setTimeout(()=>{
        setError(null)
      }, 3000)
      setResults(null);
    } else {
       try {
        const response = await axios.get(`https://geo.ipify.org/api/v2/country,city?apiKey=at_ed42rXWOd2y1u6AwR3XSr1RiXaaYg&ipAddress=${ipadress}`); 
        setResults(response.data);
        setError(null)
          
        } catch (error) {
          setResults(null);
          setError(`${error} Error fetching IP information. Please check your IP address..`)
          console.error(error);  
        } 
    }
   
  };
  
  return (
    <>
      <div className='bg-[url("/images/pattern-bg-desktop.png")]  max-sm:bg-[url("/images/pattern-bg-mobile.png")] max-sm:bg-contain bg-no-repeat flex flex-col items-center w-full h-screen'>
        {/* <img src="/public/images/icon-location.svg" alt=""/>
        
        <img src="/public/images/pattern-bg-mobile.png" alt=""/>  */}

        <div className="w-[80%] h-[60%] z-10  py-10 flex flex-col items-center">
          <h1 className="text-white text-3xl font-semibold">
            IP Address Tracker
          </h1>
          <div className="py-8">
            <input
              type="text"
              placeholder="Search for any IP address or domain"
              className="p-2 w-96 max-sm:w-60 rounded-l-lg"
              onChange={handleInput}
              value={ipadress}
            />
            <button onClick={handleTrackIP} className="w-12 h-10 align-bottom pl-4 bg-black rounded-r-lg">
              <img src="/images/icon-arrow.svg" alt="" />
            </button>
          </div>
          {error && <p className="text-white bg-red-500 rounded-lg px-5 py-1 w-[70%] font-semibold mt-2">{error}</p>}
          {results && <Record results={results}></Record>}
        </div>

        <div className="w-full z-0 fixed bottom-10 h-[50%]">
          {results ? 
          <MapComponent
          key={`${results.location.lat}-${results.location.lng}`}
            latitude={results.location.lat}
            longitude={results.location.lng}
            city={ results.location.city }
            country={ results.location.country }
            region={ results.location.region}
          /> : <MapComponent /> }
        </div>
      </div>

    </>
  );
}

export default App;
