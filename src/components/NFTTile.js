import axie from "../tile.jpeg";
import {
    BrowserRouter as Router,
    Link,
} from "react-router-dom";
import { GetIpfsUrlFromPinata } from "../utils";
import "./test.css";

function NFTTile(data) {
    const newTo = {
        pathname: "/nftPage/" + data.data.tokenId
    }

    const IPFSUrl = GetIpfsUrlFromPinata(data.data.image);  //  get the url of image from pinata ipfs 

    return (
        <Link to={newTo}>
            <div className="border-2 ml-12 mt-5 mb-12 flex flex-col items-center rounded-lg w-48 md:w-72 shadow-2xl">
                <img
                    src={IPFSUrl}
                    alt=""
                    className={`w-72 h-80 rounded-lg object-cover ${data.data.state === 'Rented' ? 'red-shadow' : 'green-blink'}`}
                    crossOrigin="anonymous"
                />

                <div className="text-white w-full p-2 bg-gradient-to-t from-[#454545] to-transparent rounded-lg pt-5 -mt-20">
                    <strong className="text-xl">{data.data.name}</strong>
                    <p className="display-inline">{data.data.duration + ' Minutes'}</p>
                </div>
            </div>

        </Link>
    )
}

export default NFTTile;
