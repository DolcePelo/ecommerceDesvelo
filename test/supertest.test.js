import supertest from "supertest";
import { expect } from "chai";

// const expect = chai.expect;
const requester = supertest("http://localhost:3000");

describe("Testing project ecommerce", () => {
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
                expect(result.ok).to.be.true;
                console.log("*******RESULTADO*******");
                console.log(result._body);
                console.log(result.statusCode);
                console.log(result.ok);
        })
    })
})