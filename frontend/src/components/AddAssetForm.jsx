import {useRef, useState} from "react";
import {Divider, Flex, InputNumber, Select, Space, Typography, Form, Button, DatePicker, Result} from "antd";
import {useCrypto} from "../context/crypto-context.jsx";
import CoinInfo from "./CoinInfo.jsx";

const validateMessages = {
    required: '${label} is required!',
    types:{
        number:'${label} is not valid number',
    },
    number:{
        range:'${label} must be between ${min} and ${max}'},
    // ...
};

export default function AddAssetForm({onClose}){
    const [form]=Form.useForm()
    const {crypto,addAsset}=useCrypto();
    const [coin,setCoin]=useState(null);
    const [select,setSelect]=useState(false);
    const [submitted,setSubmitted]=useState(false);
    const assetRef=useRef();
  if(submitted){
      return(
          <Result
              status="success"
              title="Successfully Purchased Cloud Server ECS!"
              subTitle={`Added ${assetRef.current.amount} of ${coin.name} 
              by price ${assetRef.current.price}`}
              extra={[
                  <Button type="primary" key="console" onClick={onClose}>
                    Close
                  </Button>,

              ]}
          />
      )
  }

    if(!coin){
        return(
            <Select
            onSelect={(v)=>setCoin(crypto.find((c)=>c.id==v))}
            style={{ width: '100%' }}
            placeholder="select coin"
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
        )
    }
    else {
        function onFinish(values) {
            console.log("values",values)
            console.log(form.getFieldValue());
            const newAsset={
                id:coin.id,
                amount:values.amount,
                price:values.price,
                date:values.date?.$d??new Date(),
            }
            console.log("newAsset",newAsset)

            assetRef.current=newAsset;
            setSubmitted(true);
            addAsset(newAsset)
            console.log("assetRef.current",assetRef.current)
        }
        function handleAmountChange(value){
           const price=form.getFieldValue('price');
           form.setFieldsValue({
               total:+(value*coin.price).toFixed(2)
           })
        }
        function handlePriceChange(value){
            const amount=form.getFieldValue('amount');
            form.setFieldsValue({
                total:+(value*amount).toFixed(2)
            })
        }

        return (
            <Form
                form={form}
                validateMessages={validateMessages}
                name="basic"
                labelCol={{
                span: 6,
            }}
            wrapperCol={{
                span: 10,
            }}
            style={{
                maxWidth: 800,
            }}
            initialValues={{price:+coin.price.toFixed(2)}}
            onFinish={onFinish}
        >

                <CoinInfo coin={coin}></CoinInfo>
            <Divider/>
            <Form.Item
                label="Amount"
                name="amount"
                rules={[
                    {
                        required: true,
                        type: 'number',
                        min: 0,
                        message: 'Please input your username!',
                    },
                ]}
            >
                <InputNumber
                    onChange={handleAmountChange}
                    style={{width:'100%'}}/>
            </Form.Item>

            <Form.Item
                label="Price"
                name="price"
            >
                <InputNumber onChange={handlePriceChange} style={{width:'100%'}}/>
            </Form.Item>
                <Form.Item
                    label="Total"
                    name="total"
                >
                    <InputNumber disabled style={{width:'100%'}}/>
                </Form.Item>
                <Form.Item
                    label="Date & time"
                    name="date"
                >
                    <DatePicker showTime></DatePicker>
                </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit"
                        >
                    Add Asset
                </Button>
            </Form.Item>
        </Form>
        )
    }


}