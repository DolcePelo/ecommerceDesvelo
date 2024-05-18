export const helpers = {
    multiply: (price, quantity) => {
        return price * quantity;
    },
    total: (products) => {
        let total = 0;
        products.forEach(product => {
            total += product.product.price * product.quantity;
        });
        return total.toFixed(2);
    }
};
