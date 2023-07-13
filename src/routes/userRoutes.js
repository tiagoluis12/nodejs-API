const { Router } = require("express");
const fetch = require("node-fetch");

const userRouter = Router();

const baseUrl = "http://api.weatherapi.com/v1";
const currentMethod = "/current.json";

userRouter.get("/", async (request, response) => {
  const dataCity = await fetch(
    `${baseUrl}${currentMethod}?` +
      new URLSearchParams({
        key: process.env.NODE_API_KEY,
        q: request.body.cidade,
      })
  );

  const dataResponse = await dataCity.json();
  const responseString = `A temperatura da ${dataResponse.location.name} buscada é: ${dataResponse.current.temp_c}`;
  response.status(200).send(responseString);
});

module.exports = { userRouter };
// pocess.env.NODE_API_KEY
// 0739b76521c74aeda07202903231307

// ?key=0739b76521c74aeda07202903231307&q=Galway
