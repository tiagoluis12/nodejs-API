const { Router } = require("express");
const fetch = require("node-fetch");

const userRouter = Router();

const baseUrl = "http://api.weatherapi.com/v1";
const currentMethod = "/current.json";

userRouter.get("/", async (request, response) => {
  try {
    if (!request.body.cidade || typeof request.body.cidade != "string") {
      response.status(400).send({
        success: false,
        message: "Não existe uma cidade no corpo da requisição",
      });
      return;
    }

    const dataCity = await fetch(
      `${baseUrl}${currentMethod}?` +
        new URLSearchParams({
          key: process.env.NODE_API_KEY,
          q: `${request.body.cidade}`,
        })
    );

    const dataResponse = await dataCity.json();
    if (dataResponse.error) {
      response.status(404).send({
        success: false,
        message: dataResponse.error.message,
      });
    }

    const responseString = `A temperatura da ${dataResponse.location.name} buscada é: ${dataResponse.current.temp_c}`;
    response.status(200).send({
      success: true,
      message: responseString,
    });
  } catch (error) {
    response.status(500).send({
      success: false,
      message: `Erro no servidor: ${error}`,
    });
  }
});
module.exports = { userRouter };
