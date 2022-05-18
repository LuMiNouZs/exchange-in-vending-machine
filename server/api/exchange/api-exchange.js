const express = require("express");
const router = express.Router();

const calculateExchangePayment = (amountToPay, customerPayment) => {
  const moneyExchangeType = [1000, 500, 100, 50, 20, 10, 5, 2, 1];
  let resultPayment = customerPayment - amountToPay;
  let totalMoneyExchange = [];
  let elementResult = {};
  let result = {};
  if (resultPayment < 0) {
    return { message: "จำนวนเงินไม่เพียงพอ." };
  } else if (resultPayment == 0) {
    return { message: "เงินทอน 0 บาท." };
  } else {
    moneyExchangeType.forEach((ele) => {
      while (resultPayment >= ele) {
        totalMoneyExchange.push(ele);
        resultPayment = resultPayment - ele;
      }
    });
    totalMoneyExchange.forEach((eleExchange) => {
      elementResult[eleExchange] = (elementResult[eleExchange] || 0) + 1;
    });

    for (const key in elementResult) {
      if (parseInt(key) >= 20) {
        //result += (` {แบงค์ ${key} จำนวน:${elementResult[key]}}`);
        result[`แบงค์ ${key}`] = `จำนวน ${elementResult[key]} ใบ`;
      } else {
        //result += (` {เหรียญ ${key} จำนวน:${elementResult[key]}}`);
        result[`เหรียญ ${key}`] = `จำนวน ${elementResult[key]} เหรียญ`;
      }
    }
    return { message: "OK", ทอนเงินด้วย: [result] };
  }
};

router.post("/moneyExchange", async (req, res) => {
  try {
    const balanceToBePaid = await req.body.balanceToBePaid;
    const payment = await req.body.payment;
    //res.json({ message: "OK" });
    res.json(calculateExchangePayment(balanceToBePaid, payment));
  } catch (error) {
    console.log("Error");
    res.json({ message: "Error" });
  }
});

router.get("/moneyExchange", async (req, res) => {
  res.json({ message: "Ok" });
});
module.exports = router;
