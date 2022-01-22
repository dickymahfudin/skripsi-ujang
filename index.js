require("dotenv").config();
const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const path = require("path");
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.get("/", async (req, res, next) => {
  let { data, error } = await supabase.from("sensor").select("*");
  return res.render("monitoring", {
    data: data[0],
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
  });
});

app.get("/api", async (req, res, next) => {
  const { suhu, humi } = req.query;
  console.log({ suhu, humi });
  const { data, error } = await supabase
    .from("sensor")
    .update({ suhu, humi })
    .match({ id: 1 });
  return res.json(data);
});

app.listen(PORT, () =>
  console.info(`Server Running on : http://localhost:${PORT}`)
);
