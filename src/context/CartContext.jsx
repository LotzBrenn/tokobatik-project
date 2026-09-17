// src/context/CartContext.jsx
'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const savedCart = localStorage.getItem('griya_cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart:', e);
            }
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('griya_cart', JSON.stringify(cart));
        }
    }, [cart, isMounted]);

    const addToCart = (product, selectedSize = 'L') => {
        setCart((prevCart) => {
            const existingIndex = prevCart.findIndex(
                (item) => item.id === product.id && item.size === selectedSize
            );

            if (existingIndex > -1) {
                const updated = [...prevCart];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    qty: updated[existingIndex].qty + 1,
                };
                return updated;
            }

            return [
                ...prevCart,
                {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    size: selectedSize,
                    qty: 1,
                },
            ];
        });

        setIsOpen(true);
    };

    // Fungsi untuk mengubah ukuran item di keranjang
    const updateItemSize = (index, newSize) => {
        setCart((prev) => {
            const updated = [...prev];
            updated[index].size = newSize;
            return updated;
        });
    };

    // Fungsi untuk mengubah jumlah item
    const updateItemQty = (index, newQty) => {
        if (newQty < 1) return;
        setCart((prev) => {
            const updated = [...prev];
            updated[index].qty = newQty;
            return updated;
        });
    };

    const removeFromCart = (index) => {
        setCart((prev) => prev.filter((_, i) => i !== index));
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider
            value={{
                cart,
                isOpen,
                setIsOpen,
                addToCart,
                updateItemSize,
                updateItemQty,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);