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
      maxTemperature: dataResponse.forecast.forecastday[0].day.maxtemp_c, //aqui
      minTemperature: dataResponse.forecast.forecastday[0].day.mintemp_c, //aqui
    });
  } catch (error) {
    response.status(500).send({
      success: false,
      message: `Erro no servidor: ${error}`,
    });
  }
});

userRouter.get("/capitais", async (request, response) => {
  try {
    const capitais = [
      { name: "Rio Branco" },
      { name: "Maceió" },
      { name: "Macapá" },
      { name: "Manaus" },
      { name: "Salvador" },
      { name: "Fortaleza" },
      { name: "Brasília" },
      { name: "Vitória" },
      { name: "Goiânia" },
      { name: "São Luís" },
      { name: "Cuiabá" },
      { name: "Campo Grande" },
      { name: "Belo Horizonte" },
      { name: "Belém" },
      { name: "João Pessoa" },
      { name: "Curitiba" },
      { name: "Recife" },
      { name: "Teresina" },
      { name: "Rio de Janeiro" },
      { name: "Natal" },
      { name: "Porto Alegre" },
      { name: "Porto Velho" },
      { name: "Boa Vista" },
      { name: "Florianópolis" },
      { name: "São Paulo" },
      { name: "Aracaju" },
      { name: "Palmas" },
    ];

    const dataPromises = capitais.map(async (capital) => {
      const dataCity = await fetch(
        `${baseUrl}${currentMethod}?` +
          new URLSearchParams({
            key: process.env.NODE_API_KEY,
            q: `${capital.name}`,
          })
      );

      const dataResponse = await dataCity.json();
      if (dataResponse.error) {
        response.status(404).send({
          success: false,
          message: dataResponse.error.message,
        });
      }

      return {
        name: capital.name,
        temperatura: dataResponse.current.temp_c,
        maxTemperature: dataResponse.forecast.forecastday[0].day.maxtemp_c, //aqui
        minTemperature: dataResponse.forecast.forecastday[0].day.mintemp_c, //aqui
      };
    });

    const result = await Promise.all(dataPromises);

    response.status(200).send({
      success: true,
      message: result,
    });
  } catch (error) {
    response.status(500).send({
      success: false,
      message: `Erro no servidor: ${error}`,
    });
  }
});
// Lista de capitais para consulta
// const capitais = [
//   { nome: "Rio de Janeiro", id: 3451190 },
//   { nome: "São Paulo", id: 3448439 },
//   { nome: "Brasília", id: 3469058 },
// ];

// userRouter.get("/capitais", async (request, response) => {
//   try {
//     const dataPromises = capitais.map(async (capital) => {
//       const response = await fetch("http://api.weatherapi.com/v1/current.json");
//       const temperaturaMaxima =
//         response.data.forecast.forecastday[0].day.maxtemp_c;
//       const temperaturaMinima =
//         response.data.forecast.forecastday[0].day.mintemp_c;
//       const temperaturaMedia = (temperaturaMaxima + temperaturaMinima) / 2;

//       return {
//         nome: capital.nome,
//         temperaturaMaxima,
//         temperaturaMinima,
//         temperaturaMedia,
//       };
//     });

//     const result = await Promise.all(dataPromises);

//     res.json(result);
//   } catch (error) {
//     console.error("Erro ao obter dados:", error.message);
//     res.status(500).json({ error: "Erro ao obter dados." });
//   }
// });

module.exports = { userRouter };
