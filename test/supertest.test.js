import supertest from "supertest";
import { expect } from "chai";

// const expect = chai.expect;
const requester = supertest("http://localhost:3000");

describe("Testing project ecommerce", () => {
    let productId;

    describe("Testing products", () => {
        it("El endpoint POST /api/products debe crear un producto", async () => {
            const product = {
                name: "Remera de prueba",
                description: "Remera blanca lisa de algodon",
                price: 1000,
                code: "PR001",
                category: "Remeras",
                Stock: 5
            }

            const result = await requester.post("/api/products").send(product);
            // validamos q se creo el prod de forma correcta sólo con el payload
            expect(result.ok).to.be.true;
            productId = result._body._id;
            console.log("*******RESULTADO*******");
            console.log(result._body);
            console.log(result.statusCode);
            console.log(result.ok);
            console.log(result._body.price);
        });

        it("El endpoint GET /api/products/:id debe retornar el producto creado", async () => {
            console.log(`El id de productId ${productId}`)
            const checkResult = await requester.get(`/api/products/${productId}`).send();
            expect(checkResult.statusCode).to.equal(200)
            expect(checkResult._body._id).to.equal(productId);
        });

        it("El endpoint PUT /api/products/:id debe poder modificar un campo", async () => {
            const product = {
                name: "Remera de prueba modificada con el PUT",
                description: "Remera negra lisa de algodon",
                price: 980,
                code: "PR002",
            }
            const result = await  requester.put(`/api/products/${productId}`).send(product);
            expect(product.price).to.equal(980); //se podría condicionar el resto de los campos también

        });

        it("El endpoint DELETE /api/products/:id debe eliminar el producto", async () => {
            const response = await requester.del(`/api/products/${productId}`).send() ;
            expect(response.statusCode).to.be.equal(200);
        });
    });
});