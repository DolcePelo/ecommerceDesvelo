export const generateProductErrorInfo = (product) => {
    return `One or more fields are missing or invalid in the user.
        List of required properties:
      * name: needs to be a string, received ${product.name}
      * price: needs to be a number, received ${product.price}
      * code: needs to be a number, received ${product.code}`;
};
