import React, {useState} from 'react';
import './ProductList.css';
import {ProductItem} from "./ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";
import {useCallback, useEffect} from "react";

const products = [
    {id: '1', name: 'Пицца', price: 299 , description: 'Пицца пепперони,', img: 'https://sushi-storm.ru/image/cache/catalog/3Storm/pizza/new/peperoni-600x600.jpg'},
    {id: '1', name: 'Пицца', price: 299 , description: 'Пицца сырная,',  img: 'https://xn--24-mlcaas9bch7e.xn--p1ai/wa-data/public/shop/products/34/00/34/images/83/83.750.jpg'},
    {id: '1', name: 'Пицца', price: 452 , description: 'Пицца жюльен,', img: 'https://www.povarenok.ru/data/cache/2017oct/14/39/2147211_78888-710x550x.jpg '},
    {id: '1', name: 'Пицца', price: 419 , description: 'Пицца гавайская', img: 'https://cdn.lifehacker.ru/wp-content/uploads/2021/01/1_1611130322-e1611130395948-1280x640.jpg'},
    {id: '1', name: 'Пицца', price: 519 , description: 'Пицца цыпленок барбекю', img: 'https://ristesto.ru/upload/iblock/023/023869218a0275ce956865a703ede816.JPG'},
    {id: '1', name: 'Пицца', price: 639 , description: 'Пицца маргарита', img: 'https://static.1000.menu/img/content-v2/ef/27/10853/picca-margarita-v-domashnix-usloviyax_1608783820_4_max.jpg'},
    {id: '1', name: 'Пицца', price: 519 , description: 'Пицца диабло', img: 'https://amigos51.ru/nuber/images/shop/product/d3ed4bf1-6797-4e1b-a665-b0a5a0e1041a/d08f03ef-95f6-4541-85ad-ff12beb3e83f.jpg'},
    {id: '1', name: 'Пицца', price: 419 , description: 'Пицца ветчина и грибы', img: 'https://fabrikavkysa.ru/assets/images/products/170/vetchina-gribyi.jpg'},
    {id: '1', name: 'Пицца', price: 469 , description: 'Пицца мясная', img: 'https://donsamurai.ru/d/299084_452qmdga.jpg'},
    {id: '1', name: 'Чай',   price: 120 , description: 'Чай петрушевый', img: 'https://masterpiecer-images.s3.yandex.net/e0d9a8388bdc11eebc37b646b2a0ffc1:upscaled'}
]


const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.price
    }, 0)
}

export const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);

    const {tg, queryId, onClose} = useTelegram();

    const onSendData = useCallback(() => {
        
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('http://85.119.146.179:8000/web-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        
    }, [addedItems])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if(alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if(newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
            tg.onClose()
        }
    }

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
        </div>
    );
};
 