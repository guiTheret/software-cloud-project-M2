const express = require("express");
const router = express.Router();
var mysql = require("mysql");
var connection = require("../db");

router.get("/available/:idCleaner/:year/:month", (req, res) => {
  if (!req.user)
    return res.status(401).json({ message: "You are not authenticate" });
  const string =
    "SELECT cleanersSchedule.* FROM cleanersSchedule JOIN users ON cleanersSchedule.idCleaner = users.id WHERE users.id = ? AND cleanersSchedule.year = ? AND cleanersSchedule.month = ?;";
  const inserts = [
    parseInt(req.params.idCleaner),
    req.params.year,
    req.params.month,
  ];
  const sql = mysql.format(string, inserts);
  connection.query(sql, async (error, results) => {
    if (error) throw error;
    res.status(200).json({ data: results });
  });
});

router.post("/setAvailable", (req, res, next) => {
  if (!req.user)
    return res.status(401).json({ message: "You are not authenticated" });
  if (req.user.isCleaner !== 1)
    return res.status(403).json({ message: "You are not allowed to do that" });
  const userId = parseInt(req.user.id);
  req.body.availableDate.forEach((value) => {
    const string =
      "SELECT cleanersSchedule.* FROM cleanersSchedule WHERE cleanersSchedule.idCleaner = ? AND cleanersSchedule.day = ?;";
    const date = new Date(value.date);
    const inserts = [userId, date];
    const sql = mysql.format(string, inserts);
    connection.query(sql, async (error, results) => {
      if (error) throw error;
      if (value.isSelected && results.length === 0) {
        const insertString =
          "INSERT INTO cleanersSchedule(day, idCleaner, month, year) VALUES (?,?,?,?)";
        connection.query(
          insertString,
          [date, userId, date.getMonth(), date.getFullYear()],
          async (err, res2, fields) => {
            if (err) throw err;
          }
        );
      } else if (!value.isSelected && results.length > 0) {
        const insertString =
          "DELETE FROM cleanersSchedule WHERE day = ? AND idCleaner = ?";
        connection.query(
          insertString,
          [date, userId],
          async (err, res2, fields) => {
            if (err) throw err;
          }
        );
      }
    });
  });
});

router.get("/seeAllCleaners", (req, res) => {
  if (!req.user)
    return res.status(401).json({ message: "You are not authenticate" });
  connection.query(
    `SELECT users.username , users.firstName, users.lastName, users.id, users.city, users.bio, users.joinDate, users.profilPicture, users.rayon FROM users WHERE users.isCleaner=1`,
    async (error, results) => {
      if (error) throw error;
      res.send(results);
    }
  );
});

router.get("/getCleanerByNameOrUsername/:value", (req, res) => {
  if (!req.user)
    return res.status(401).json({ message: "You are not authenticate" });
  const value = req.params.value + "%";
  connection.query(
    `SELECT users.username , users.firstName, users.lastName FROM users WHERE (users.firstName LIKE ? OR users.lastName LIKE ?) AND users.isCleaner=1`,
    [value, value],
    async (error, results) => {
      if (error) throw error;
      res.send(results);
    }
  );
});

router.post("/addCleanerStatus/:city/:id", (req, res) => {
  if (!req.user)
    return res.status(401).json({ message: "You are not authenticate" });
  const stringSelect = "SELECT users.isCleaner FROM users WHERE users.id = ? ;";
  const stringUpdate =
    "UPDATE users SET users.isCleaner=1 WHERE users.id = ? ;";
  const inserts = [req.params.id];
  const sqlSelect = mysql.format(stringSelect, inserts);
  const sqlUpdate = mysql.format(stringUpdate, inserts);
  connection.query(sqlSelect, async (error, results) => {
    if (error) throw error;
    if (results.length == 0) {
      return res.status(409).json({ message: "User doesnt exist" });
    } else {
      connection.query(sqlUpdate, async (err, results2) => {
        return res.send({ message: "Cleaner Status added" });
      });
    }
  });
});

router.post("/deleteCleanerStatus/:id", (req, res) => {
  if (!req.user)
    return res.status(401).json({ message: "You are not authenticate" });
  const stringSelect = "SELECT users.isCleaner FROM users WHERE users.id = ? ;";
  const stringUpdate =
    "UPDATE users SET users.isCleaner=0 WHERE users.id = ? ;";
  const inserts = [req.params.id];
  const sqlSelect = mysql.format(stringSelect, inserts);
  const sqlUpdate = mysql.format(stringUpdate, inserts);
  connection.query(sqlSelect, async (error, results) => {
    if (error) throw error;
    if (results.length == 0) {
      return res.status(409).json({ message: "User doesnt exist" });
    } else {
      connection.query(sqlUpdate, async (err, results2) => {
        return res.send({ message: "Cleaner Status removed" });
      });
    }
  });
});

router.post("/updateUserCity/:city/:id", (req, res) => {
  if (!req.user)
    return res.status(401).json({ message: "You are not authenticate" });
  connection.query(
    "UPDATE users SET users.city= ? WHERE users.id = ? ;",
    [req.params.city, req.params.id],
    async (error, results) => {
      return res.send({ message: "User city updated" });
    }
  );
});

router.get("/getCleanerByCity/:city", (req, res) => {
  if (!req.user)
    return res.status(401).json({ message: "You are not authenticate" });
  const city = req.params.city + "%";
  connection.query(
    `SELECT users.username , users.firstName, users.lastName, users.id, users.city, users.bio, users.joinDate, users.profilPicture, users.rayon FROM users WHERE (users.isCleaner=1 AND users.city LIKE ? )`,
    [city],
    async (error, results) => {
      if (error) throw error;
      return res.send(results);
    }
  );
});

router.post("/updateUserCity/:city/:id", (req, res) => {
  if (!req.user)
    return res.status(401).json({ message: "You are not authenticate" });
  connection.query(
    "UPDATE users SET users.city= ? WHERE users.id = ? ;",
    [req.params.city, req.params.id],
    async (error, results) => {
      return res.status(200).json({ message: "User city updated" });
    }
  );
});

/*router.post('/createProposal/:id', (req, res) => {
    connection.query(`SELECT users.isCleaner FROM users WHERE users.id = ? ;`, [req.params.id], async (err, results, fields) => {
        if (err) { return res.status(409).json({ message: 'User cant book a cleaner has he/she has cleaner status' }) }
        else {
            const idCleaner = req.body.idCleaner;
            const idDay = req.body.idDay;
            const address = req.body.address;
            const StartDateTime = req.body.StartDateTime;
            const EndDateTime = req.body.EndDateTime;

            if (idCleaner.length == 0) {
                return res.status(409).json({ message: 'Il manque un cleaner' })
            }
            if (idDay.length == 0) {
                return res.status(409).json({ message: 'Il manque un jour' })
            }
            if (address.length == 0) {
                return res.status(409).json({ message: 'Il manque une adresse' })
            }
            if (StartDateTime.length == 0) {
                return res.status(409).json({ message: 'Il manque une heure de début' })
            }
            if (EndDateTime.length == 0) {
                return res.status(409).json({ message: 'Il manque une  heure de fin' })
            }

            connection.query(`INSERT INTO acceptedProposal (idUser, idCleaner, idDay, address, StartDateTime , EndDateTime) VALUES(?,?,?,?,?,?)`, [req.params.id, idCleaner, idDay, address, StartDateTime, EndDateTime], async (err, results2, fields) => {
                res.send(results2)
                console.log({ message: 'Proposal added' })
                return results2
            })
        }
    })
})*/

router.delete("/deleteProposal/:idProposal", (req, res) => {
  if (!req.user)
    return res.status(401).json({ message: "You are not authenticated" });
  connection.query(
    `DELETE FROM acceptedProposal WHERE acceptedProposal.idProposal= ?`,
    [req.params.idProposal],
    async (err, results, fields) => {
      return res.status(200).json({ message: "Proposal removed" });
    }
  );
});

router.get("/getAllProposals", (req, res) => {
  if (!req.user)
    return res.status(401).json({ message: "You are not authenticated" });
  if (req.user.isCleaner === 0)
    return res.status(401).json({ message: "Not allowed" });

  connection.query(
    "SELECT acceptedProposal.*, users.lastName, users.firstName, users.city, users.profilPicture, users.address  FROM acceptedProposal JOIN users ON users.id = acceptedProposal.idUser WHERE idCleaner=? ORDER BY acceptedProposal.StartDateTime ASC;",
    [req.user.id],
    async (err, results, fields) => {
      return res.status(200).json(results);
    }
  );
});

router.get("/getClientProposals", (req, res) => {
  if (!req.user)
    return res.status(401).json({ message: "You are not authenticated" });
  connection.query(
    "SELECT acceptedProposal.*, users.lastName, users.firstName, users.city, users.profilPicture, users.address FROM acceptedProposal JOIN users ON users.id = acceptedProposal.idCleaner WHERE idUser=? ORDER BY acceptedProposal.StartDateTime ASC;",
    [req.user.id],
    async (err, results, fields) => {
      return res.status(200).json(results);
    }
  );
});

// permet de récuperer les dispos d'un cleaner
router.get("/getAvailableByDay/:idCleaner/:year/:month/:day", (req, res) => {
  if (!req.user)
    return res.status(401).json({ message: "You are not authenticated" });
  const newDate = new Date(req.params.year, req.params.month, req.params.day);
  newDate.setHours(8, 0, 0);
  connection.query(
    `SELECT * from cleanersSchedule WHERE day=? AND idCleaner=? `,
    [newDate, req.params.idCleaner],
    async (err, results, fields) => {
      if (err) throw err;
      // le cleaner est pas dispo on return direct
      //8 8.30 9 9.30 10 10.30 11 11.30 13 13.30 14 14.30 15 15.30 16 16.30 17 17.30
      if (results.length === 0) return res.status(200).json(results);
      connection.query(
        "SELECT StartDateTime from acceptedProposal WHERE idCleaner=? AND idDay=?",
        [req.params.idCleaner, newDate],
        async (err, results2, fields) => {
          if (err) throw err;
          const arrayAvailableDate = [];
          for (let index = 0; index < 18; index++) {
            let newDatePlus30;
            if (index === 0) {
              newDatePlus30 = newDate;
            } else {
              newDatePlus30 = new Date(
                arrayAvailableDate[index - 1].date.getTime() + 30 * 60000
              );
            }
            const returnDate = {
              date: newDatePlus30,
              available: true,
            };
            results2.forEach((bookedDate) => {
              if (
                bookedDate.StartDateTime.getTime() === newDatePlus30.getTime()
              ) {
                returnDate.available = false;
              }
            });
            arrayAvailableDate.push(returnDate);
          }
          return res.status(200).json(arrayAvailableDate);
        }
      );
    }
  );
});
//SELECT * FROM cleanersSchedule WHERE day LIKE '2022-10-01 __:__:__'

router.post("/bookCleaner", async (req, res) => {
  if (!req.user)
    return res.status(401).json({ message: "You are not authenticated" });
  const selectedDate = req.body.arrayDate;
  if (selectedDate.length === 0)
    return res.status(401).json({ message: "Did you book anything ?" });
  const firstDate = new Date(selectedDate[0]);
  firstDate.setHours(8, 0, 0);
  const allPromises = selectedDate.map((bookedDate) => {
    //théoriquement il faudrait recheck que ca n'existe pas déja
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO acceptedProposal (idCleaner,idDay,idUser,StartDateTime) VALUES(?,?,?,?)",
        [req.body.idCleaner, firstDate, req.user.id, new Date(bookedDate)],
        (err, res, fields) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  });
  await Promise.all(allPromises)
    .then(() => {
      res.status(200).json({ message: "Booked sucessfully !" });
    })
    .catch((err) => {
      res.status(200).json({ message: "Error please try again" });
    });

  //connection.query("INSERT INTO acceptedProposal (idCleaner,idDay,adress,StartDateTime) VALUES(?,?,?,?)",)
});

const mailValidation = (mail) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  if (reg.test(mail) === false) {
    return false;
  }
  return true;
};

module.exports = router;
