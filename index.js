const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { promisify } = require("util");
const fs = require("fs");
const convert = require("heic-convert");

const PROT = 3000;
app.use(cors());
app.use(express.json());
const db = mysql.createConnection({
  host: "203.159.93.176",
  user: "gurucaic_vegshop",
  password: "vz3h5A%1",
  database: "gurucaic_vegshop",
});
db.connect(function (err) {
  if (err) {
    return console.error("error: " + err.message);
  }

  console.log("Connected to the MySQL server.");
});

app.get("/", (req, res) => {
  const ref_code = Date.now();
  var d = new Date(ref_code);
  var result_time =
    d.getFullYear() +
    ("00" + (d.getMonth() + 1)).slice(-2) +
    ("00" + d.getDate()).slice(-2) +
    ("00" + d.getHours()).slice(-2) +
    ("00" + d.getMinutes()).slice(-2) +
    ("00" + d.getSeconds()).slice(-2) +
    ("00" + d.getUTCMilliseconds()).slice(-2);
  // d.getUTCMilliseconds();
  console.log(result_time);

  res.send(result_time);
});

// ----------------------------  Product
app.get("/product", (req, res) => {
  db.query("SELECT * FROM `product`", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
app.get("/productCate/:id", (req, res) => {
  let id = req.params.id;
  db.query(
    "SELECT * FROM product WHERE product_cate = ?",
    id,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
app.get("/productCate/:id", (req, res) => {
  let id = req.params.id;
  db.query(
    "SELECT * FROM product WHERE product_cate = ?",
    id,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
// ---------------------------- USER
// login
app.post("/login", (req, res) => {
  const user_username = req.body.user_username;
  const user_password = req.body.user_password;
  console.log(user_username);
  console.log(user_password);
  db.query(
    "SELECT * FROM user WHERE user_username = ?",
    user_username,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        const ln = result.length;
        if (ln == 1 && result[0].user_password == user_password) {
          res.send([{ login: "ok", data: result }]);
        } else {
          res.send([{ login: "nok" }]);
        }
      }
    }
  );
});
app.post("/register", (req, res) => {
  const name = req.body.name;
  const user_username = req.body.user_username;
  const user_password = req.body.user_password;
  const addr = req.body.addr;
  console.log(name);
  console.log(user_username);
  console.log(user_password);
  var user_old = "";
  db.query(
    "SELECT * FROM user WHERE user_username = ?",
    user_username,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        const ln = result.length;
        if (ln == 1) {
          res.send([{ result: "nok" }]);
        } else {
          db.query(
            "INSERT INTO user (name, user_username, user_password,addr) VALUES (?,?,?,?)",
            [name, user_username, user_password, addr],
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.send([{ result: "ok", data: result }]);
              }
            }
          );
        }
      }
    }
  );
});
app.get("/user/:id", (req, res) => {
  let id = req.params.id;

  db.query("SELECT * FROM user WHERE user_id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
// ubdate pass_user
app.put("/updatepass", (req, res) => {
  const id = req.body.id;
  const old_password = req.body.old_password;
  const new_password = req.body.new_password;
  db.query("SELECT * FROM user WHERE user_id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      const ln = result.length;
      if (ln == 1 && old_password == result[0].user_password) {
        db.query(
          "UPDATE user SET user_password = ? WHERE user_id =?",
          [new_password, id],
          (error, results, fields) => {
            if (error) throw error;
            let message = "";
            if (results.changedRows === 0) {
              message = "data not found or data are same";
            } else {
              message = "data sucsessfully update";
            }
            return res.send({ result: "ok", data: results, message: message });
          }
        );
      } else {
        res.send([{ result: "nok" }]);
      }
    }
  });
});
// ubdate photo1
const convertImg1 = async (partImg, data) => {
  const inputBuffer = await promisify(fs.readFile)(
    "./upload/images/" + partImg + "/" + data
  );
  const images = await convert.all({
    buffer: inputBuffer, // the HEIC file buffer
    format: "JPEG", // output format
  });

  const heicUp = data.substring(0, data.length - 10);
  for (let idx in images) {
    const image = images[idx];
    const outputBuffer = await image.convert();
    await promisify(fs.writeFile)(
      `./upload/images/${partImg}/${heicUp}.jpg`,
      outputBuffer
    );
  }
  const paths = "./upload/images/" + partImg + "/" + data;
  try {
    fs.unlinkSync(paths);
    console.error("delete success!!");
  } catch (err) {
    console.error("delete flase!!");
    // console.error(err);
  }
};
const storage = multer.diskStorage({
  destination: "./upload/images/img1",
  filename: (req, file, cb) => {
    const id = req.body.id;
    const ref_code = Date.now();
    console.log("id : " + id);
    var d = new Date(ref_code);

    var result_time =
      d.getFullYear() +
      ("00" + (d.getMonth() + 1)).slice(-2) +
      ("00" + d.getDate()).slice(-2) +
      ("00" + d.getHours()).slice(-2) +
      ("00" + d.getMinutes()).slice(-2) +
      ("00" + d.getSeconds()).slice(-2) +
      ("00" + d.getUTCMilliseconds()).slice(-2);
    if (path.extname(file.originalname) == ".HEIC") {
      return cb(
        null,
        `${id}_1_${result_time}_heic${path.extname(file.originalname)}`
      );
    } else {
      return cb(
        null,
        `${id}_1_${result_time}${path.extname(file.originalname)}`
      );
    }
  },
});

const upload = multer({
  storage: storage,
});

app.use("/profile1", express.static("upload/images/img1"));
app.post("/upload1", upload.single("profile1"), (req, res) => {
  const id = req.body.id;
  db.query("SELECT * FROM user WHERE user_id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      const imgName = result[0].user_img1;
      console.log(result[0]);
      if (imgName != null) {
        let resultName = imgName.substring(imgName.length - 27, imgName.length);
        const paths = "./upload/images/img1/" + resultName;
        try {
          fs.unlinkSync(paths);
          console.error("delete success!!");
        } catch (err) {
          console.error("delete flase!!");
          // console.error(err);
        }
        console.log(req.file.filename);
      }

      const ln = result.length;
      var urlname = req.file.filename;

      var lastIm = urlname.split(".")[1];
      var fristIm = urlname.split(".")[0];
      var heicUp = fristIm;
      if (lastIm == "HEIC") {
        heicUp = fristIm.substring(0, fristIm.length - 5);
        lastIm = "jpg";
        console.log("HEIC : " + heicUp);
        convertImg1("img1",urlname);
        //
      }
      console.log("lastIm = " + heicUp);
      if (ln == 1) {
        db.query(
          "UPDATE user SET  user_img1 = ? WHERE user_id =?",
          [`https://vgtb.devcm.info/profile1/${heicUp}.${lastIm}`, id],
          (error, results, fields) => {
            if (error) throw error;
            let message = "";
            if (results.changedRows === 0) {
              res.send({
                result: "false",
                data: results,
                message: "data not found or data are same",
              });
            } else {
              res.send({
                result: "ok",
                data: results,
                message: "data  sucsessfully update",
              });
            }
          }
        );
      }
    }
  });
});
// end upload photo1

// ubdate photo2W
const storage2 = multer.diskStorage({
  destination: "./upload/images/img2",
  filename: (req, file, cb) => {
    const id = req.body.id;
    const ref_code = Date.now();
    console.log("id : " + id);
    var d = new Date(ref_code);

    var result_time =
      d.getFullYear() +
      ("00" + (d.getMonth() + 1)).slice(-2) +
      ("00" + d.getDate()).slice(-2) +
      ("00" + d.getHours()).slice(-2) +
      ("00" + d.getMinutes()).slice(-2) +
      ("00" + d.getSeconds()).slice(-2) +
      ("00" + d.getUTCMilliseconds()).slice(-2);
    if (path.extname(file.originalname) == ".HEIC") {
      return cb(
        null,
        `${id}_2_${result_time}_heic${path.extname(file.originalname)}`
      );
    } else {
      return cb(
        null,
        `${id}_2_${result_time}${path.extname(file.originalname)}`
      );
    }
  },
});

const upload2 = multer({
  storage: storage2,
});

app.use("/profile2", express.static("upload/images/img2"));
app.post("/upload2", upload2.single("profile2"), (req, res) => {
  const id = req.body.id;
  db.query("SELECT * FROM user WHERE user_id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      const imgName = result[0].user_img2;
      console.log(result[0]);
      if (imgName != null) {
        let resultName = imgName.substring(imgName.length - 27, imgName.length);
        const paths = "./upload/images/img2/" + resultName;
        try {
          fs.unlinkSync(paths);
          console.error("delete success!!");
        } catch (err) {
          console.error("delete flase!!");
          // console.error(err);
        }
        console.log(req.file.filename);
      }

      const ln = result.length;
      var urlname = req.file.filename;

      var lastIm = urlname.split(".")[1];
      var fristIm = urlname.split(".")[0];
      var heicUp = fristIm;
      if (lastIm == "HEIC") {
        heicUp = fristIm.substring(0, fristIm.length - 5);
        lastIm = "jpg";
        console.log("HEIC : " + heicUp);
        convertImg1("img2",urlname);
        //
      }
      console.log("lastIm = " + heicUp);
      if (ln == 1) {
        db.query(
          "UPDATE user SET  user_img2 = ? WHERE user_id =?",
          [`https://vgtb.devcm.info/profile2/${heicUp}.${lastIm}`, id],
          (error, results, fields) => {
            if (error) throw error;
            let message = "";
            if (results.changedRows === 0) {
              res.send({
                result: "false",
                data: results,
                message: "data not found or data are same",
              });
            } else {
              res.send({
                result: "ok",
                data: results,
                message: "data  sucsessfully update",
              });
            }
          }
        );
      }
    }
  });
});
// end upload photo1
app.listen(PROT, () => {
  console.log("Yey, your server is running on port " + PROT);
});
