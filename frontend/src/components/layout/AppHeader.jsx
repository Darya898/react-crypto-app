import {Button, Drawer, Layout, Modal, Select, Space} from "antd";
import {useCrypto} from "../../context/crypto-context.jsx";
import {useEffect, useState} from "react";
import CoinInfoMadal from "../CoinInfoModal.jsx";
import AddAssetForm from "../AddAssetForm.jsx";

const headerStyle = {
    width:'100%',
    textAlign: 'center',
    height: 60,
    padding:'1rem',
    display:'flex',
    justifyContent:'space-between',
    alignItems:'center',
};
// const options = [
//     {
//         label: 'China',
//         value: 'china',
//         emoji: '🇨🇳',
//         desc: 'China (中国)',
//     },
//     {
//         label: 'USA',
//         value: 'usa',
//         emoji: '🇺🇸',
//         desc: 'USA (美国)',
//     },
//     {
//         label: 'Japan',
//         value: 'japan',
//         emoji: '🇯🇵',
//         desc: 'Japan (日本)',
//     },
//     {
//         label: 'Korea',
//         value: 'korea',
//         emoji: '🇰🇷',
//         desc: 'Korea (韩国)',
//     },
// ];
export default function AppHeader(){
    const [select,setSelect]=useState(false);
    const [coin,setCoin]=useState(null);
    const [modal,setModal]=useState(false);
    const [drawer,setDrawer]=useState(false);
    const {crypto}=useCrypto();
    useEffect(()=>{
        const keypress=(event)=>{
            if(event.key==='/'){
                setSelect((prev)=>!prev)
            }
        }
        document.addEventListener('keypress',keypress);
        return ()=>document.removeEventListener('keypress',keypress);
    },[])
    function handleSelect(value){
        setCoin(crypto.find((c)=>c.id==value))
       setModal(true)
    }

    return ( <Layout.Header style={headerStyle}>
        <Select
            onClick={()=>setSelect(prev=>!prev)}
            open={select}
            style={{ width: '250px' }}
            value="press/to open"
            onSelect={handleSelect}
            options={crypto.map(coin=>({
                label:coin.name,
                value:coin.id,
                icon:coin.icon,
            }))}
            optionRender={(option) =>
                (
                <Space>
       <img
           style={{width:20}}
           src={option.data.icon} alt={option.data.label}/>{option.data.label}
                </Space>
            )}
        />
        <Button type="primary" onClick={()=>setDrawer(true)}>Add asset</Button>
        <Modal open={modal}
               footer={null}
               onCancel={()=>{setModal(false)}}>
  <CoinInfoMadal coin={coin}></CoinInfoMadal>
        </Modal>
        <Drawer title="Add Asset" onClose={()=>setDrawer(false)} open={drawer} destroyOnClose>
         <AddAssetForm onClose={()=>setDrawer(false)}></AddAssetForm>
        </Drawer>
    </Layout.Header>)
}