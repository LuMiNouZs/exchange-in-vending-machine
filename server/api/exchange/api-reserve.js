const express = require("express");
const router = express.Router();
const sql = require("./db");
const { v4: uuidv4 } = require("uuid");

const lockTable = () => {
  return new Promise((resolve, reject) => {
      const sqlQuery = "LOCK TABLES products WRITE";
      sql.query(sqlQuery,  (err, results) => {
        if (results) {
          resolve(results);
        } else {
          reject("can't lock table");
        }
      });
  });
};

const unlockTable = () => {
  return new Promise((resolve, reject) => {
      const sqlQuery = "UNLOCK TABLES ";
      sql.query(sqlQuery,  (err, results) => {
        if (results) {
          resolve(results);
        } else {
          reject("can't unlock table");
        }
      });
  });
};
//findUser()
const findUser = (userId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const sqlQuery = "SELECT * FROM `users` WHERE id = ? ";
      sql.query(sqlQuery, userId, (err, resultUser) => {
        if (resultUser) {
          resolve(resultUser[0]);
        } else {
          reject("User is not exit or reject duplicate request.");
        }
      });
    }, 200);
  });
};

const findProductAvailable = (productId, quantity) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const sqlQuery = "SELECT * FROM `products` WHERE id = ? and quantityAvailable >= ?  ";
      sql.query(sqlQuery, [productId, quantity], (err, results) => {
        if (results[0]) {
          resolve(results[0]);
        } else {
          reject("product unavalible");
        }
      });
    }, 200);
  });
};

const reserveProduct =  (updateQty, updateQtyReserve, updateAvalible, date, productId) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "UPDATE `products` SET `quantity` = ?, `quantityReserve` = ?, `quantityAvailable` = ?, `modified` = ? WHERE `id` = ?  ";
    sql.query(sqlQuery, [updateQty, updateQtyReserve, updateAvalible, date, productId], (err, results) => {
      if (results) {
        resolve(results)
      } else {
        reject("wrong reserved")
      } 
    });
  });
};

const createTransaction = async (userId,productId,quantity) =>{
  return new Promise((resolve, reject)=>{
    const transectionId = uuidv4();
    const sqlQuery = "INSERT INTO transections (`id`, `userId`, `productId`, `quantity`) VALUES (?, ?, ?, ?) "
    sql.query(sqlQuery,[transectionId, userId, productId, quantity],(err, results)=> {
      if(results){
        resolve(transectionId)
      }else {
        reject("can't create transaction")
      }
    })
  }).then((valueTransectionId)=>{
    return new Promise((resolve, reject)=>{
      const sqlQuery = "SELECT * FROM `transections` WHERE id = ? ";
      sql.query(sqlQuery, [valueTransectionId],(err, results)=> {
        if(results){
          resolve(results)
        }else{
          reject("can't find transaction")
        }
      })
    })
  })
}

router.use((req, res, next) => {
  next();
});

router.post("/bookProduct", async (req, res) => {
  try {
    const _userId = await req.body.userId;
    const _productId = await req.body.productId;
    const _qty = req.body.qty;
    findUser(_userId).then((value) => {
      console.log(value);
      //After Find User ==> Lock table for access 1 concurrent
      lockTable().then((value) => {
        findProductAvailable(_productId, _qty).then((valueProduct) => {
            console.log(valueProduct);
            //After product avalible
            const getQty = parseInt(valueProduct.quantity);
            const getQtyReserve = parseInt(valueProduct.quantityReserve);
            const updateQuantity = getQty - _qty;
            const updateReserve = getQtyReserve + _qty;
            const dateNow = new Date().toISOString().slice(0, 19).replace("T", " ");

            reserveProduct(updateQuantity, updateReserve, updateQuantity, dateNow, _productId).then((value)=>{
              //res.send({ message: "sucess", data: "reserved"});
              console.log(value);
              unlockTable().then((value) => {
                console.log("unlock table");
                //After update product reserve ==> Create transaction and release table products
                createTransaction(_userId, _productId, _qty).then((valueTrasaction)=>{
                  res.end(JSON.stringify({ message: "successful", data: valueTrasaction}));
                }).catch((err)=>{
                  console.log(err);
                  res.end(JSON.stringify({ message: "unsuccess", data: err }));
                })
              }).catch(()=>{
                console.log(err);
                res.end(JSON.stringify({ message: "unsuccess ", data: err }));
              })
    
            }).catch((err)=>{
              console.log(err);
              res.end(JSON.stringify({ message: "unsuccess", data: err }));
            })
          }).catch((err) => {
            //Error: product unavible
            console.log(err);
            res.end(JSON.stringify({ message: "unsuccess", data: err }));
          }).then(()=>{
            unlockTable().then((value) => {
              console.log("unlock table");
            })
          })
        }).catch((err) => {
          //Lock teble error
          console.log(err);
          res.end(JSON.stringify({ message: "unsuccess", data: err }));
        });
    }).catch((err) => {
      //Error : find user is not exit
      console.log(err);
      res.end(JSON.stringify({ message: "unsuccess", data: err }));
    });
  } catch (error) {
    console.log("error request");
    res.end(JSON.stringify({ message: "error request" }));
  }
});

router.get("/test", async (req, res) => {
  try {
    const sqlQuery = `CALL findUser(?)`;
    console.log(sql);
    sql.query(
      sqlQuery,
      ["c90e9bd6-e0b0-11ec-b1fd-005056b11d7d"],
      async (error, results) => {
        if (error) {
          return console.error(error.message);
        }
        console.log(results[0]);
        res.end(JSON.stringify({ message: results[0] }));
      }
    );

    sql.end();
  } catch (error) {
    console.log("error request");
    res.end(JSON.stringify({ message: "error request" }));
  }
});

module.exports = router;
