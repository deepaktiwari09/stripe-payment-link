import { file } from "bun";
import server from "bunrest";
import bodyParser from "body-parser";

const stripe = require("stripe")(
  "sk_test_51OCbJySHdOUmIottiQClsvS8qBINe6t4sg1EAkHa1M2C674kyfnctw5qwW2W0kvdvpcDUpNxezStMyT0JSBZB3ZE00Jz6Fo5xK"
);

const app = server();

app.get("/", (req, res) => {
  return res.send(file("index.html"));
});

app.post("/create-payment-link", async (req, res) => {
  const paymentLink = await stripe.paymentLinks.create({
    line_items: [
      {
        price: "price_1OCbOWSHdOUmIottnC8v5GQs",
        quantity: 1,
      },
    ],
    after_completion: {
      type: "redirect",
      redirect: {
        url: "https://www.scorebookstore.com/",
      },
    },
  });

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  if (paymentLink.url) {
    res.status(200).json({
      url: paymentLink.url,
    });
  } else {
    res.status(500).json({
      error: "something went wrong",
    });
  }
});

app.get("/payment-link-details", async (req, res) => {
  let item = req.query;
  console.log(item);
  const lineItems = await stripe.paymentLinks.listLineItems(item.id);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.status(200).json({
    res: lineItems.data,
  });
});

app.post("/webhook", (req, res) => {
  if (req.body) {
    console.log("Got payload:", req.body);
  }

  res.status(200).send("Payload received successfully.");
});

app.listen(3000, () => {
  console.log("app started");
});
