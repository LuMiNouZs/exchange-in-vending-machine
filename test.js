const axios = require("axios");

const user = [
  "7e2b0910-e107-11ec-b1fd-005056b11d7d",
  "7e2b1419-e107-11ec-b1fd-005056b11d7d",
  "7e2b1c0a-e107-11ec-b1fd-005056b11d7d",
  "c90e9198-e0b0-11ec-b1fd-005056b11d7d",
  "c90e9bd6-e0b0-11ec-b1fd-005056b11d7d",
];
for (i = 1; i <=  1000; i++) {
  axios({
    method: "post",
    url: "http://192.168.20.240:8081/vending-machine/api/v1/bookProduct",

    data: {
      userId: user[Math.floor(Math.random() * 4)],
      productId: "af0209d9-dda0-11ec-b1fd-005056b11d7d",
      qty: 1,
    },
  })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}
