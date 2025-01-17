import {createContext, useContext, useEffect, useState} from "react";
import {fakeFetchCrypto, fetchAssets} from "../api.js";
import {recentDifference} from "../utils.js";
const CryptoContext=createContext({
    assets:[],
    crypto:[],
    loading:false,
})
export function CryptoContextProvider({children}){
    const [loading, setLoading]=useState(false);
    const [crypto,setCrypto]=useState([]);
    const [assets,setAssets]=useState([]);
    function mapAssets(assets,result){
        return assets.map(ass=>{
            const coin=result.find((c)=>c.id==ass.id)
            return{grow:ass.price<coin.price,
                totalAmount:ass.amount*coin.price,
                totalProfit:ass.amount*coin.price-ass.amount*ass.price,
                growPercent:recentDifference(ass.price,coin.price),
                name:coin.name,
                ...ass}
        })
    }
    useEffect(() => {
        setLoading(true)
        async function preload(){
            const {result}= await fakeFetchCrypto();
            const assets= await fetchAssets();
            console.log("assets use eff",assets)
            setAssets(mapAssets(assets,result));
            setCrypto(result);
            setLoading(false);
        }
        preload();
    }, []);

    function addAsset(newAsset){

        setAssets((prev)=>mapAssets([...prev,newAsset],crypto));
    }
    return <CryptoContext.Provider
        value={{loading,crypto,assets,addAsset}}>
           {children}
           </CryptoContext.Provider>
}
export default CryptoContext;
export function useCrypto(){
    return useContext(CryptoContext)
}