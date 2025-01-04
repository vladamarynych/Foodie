import path from "path";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "./.env") });

const port = process.env.PORT;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const pizzas = [
  {
    name: "Broccoli Pizza",
    img: "/assets/img/pizza-broccoli.jpg",
    description: "Fresh broccoli, mozzarella cheese, and a savory sauce.",
    price: "$12.99",
  },
  {
    name: "Ham Pizza",
    img: "/assets/img/pizza-ham.jpg",
    description: "Delicious ham, cheese, and a touch of tomato sauce.",
    price: "$10.99",
  },
  {
    name: "Mozzarella Pizza",
    img: "/assets/img/pizza-mozzarella.jpg",
    description: "Classic mozzarella cheese pizza with a crispy crust.",
    price: "$9.99",
  },
  {
    name: "Olive Pizza",
    img: "/assets/img/pizza-olive.jpg",
    description: "Black olives, mozzarella cheese, and a tasty sauce.",
    price: "$11.99",
  },
  {
    name: "Pepperoni",
    img: "/assets/img/pizza-pepperoni.jpg",
    description: "Spicy pepperoni, mozzarella cheese, and a tomato base.",
    price: "$13.99",
  },
  {
    name: "Tomato Pizza",
    img: "/assets/img/pizza-tomato.jpg",
    description: "Juicy tomatoes, mozzarella cheese, and aromatic herbs.",
    price: "$8.99",
  },
];

const sushi = [
  {
    name: "Avocado Sushi",
    img: "/assets/img/sushi-avocado.jpg",
    description: "Fresh avocado slices wrapped in seasoned rice and seaweed.",
    price: "$5.99",
  },
  {
    name: "Cucumber Sushi",
    img: "/assets/img/sushi-cucumber.jpg",
    description: "Crisp cucumber wrapped with sushi rice and nori.",
    price: "$4.99",
  },
  {
    name: "Green Dragon",
    img: "/assets/img/sushi-green-dragon.jpg",
    description: "Avocado-topped roll with eel, cucumber, and spicy sauce.",
    price: "$12.99",
  },
  {
    name: "Philadelphia",
    img: "/assets/img/sushi-philadelphia.jpg",
    description:
      "Cream cheese, smoked salmon, and cucumber wrapped in rice and seaweed.",
    price: "$11.99",
  },
  {
    name: "Salmon Sushi",
    img: "/assets/img/sushi-salmon.jpg",
    description: "Fresh salmon sashimi over sushi rice with a hint of wasabi.",
    price: "$6.99",
  },
  {
    name: "Tuna Sushi",
    img: "/assets/img/sushi-tuna.jpg",
    description: "Premium tuna slices on seasoned sushi rice.",
    price: "$7.99",
  },
];

const tacos = [
  {
    name: "Beef Taco",
    img: "/assets/img/taco-meat.jpg",
    description:
      "Seasoned beef with lettuce, tomato, and cheese in a crispy shell.",
    price: "$3.99",
  },
  {
    name: "Corn Taco",
    img: "/assets/img/taco-corn.jpg",
    description:
      "Grilled corn with avocado, salsa, and lime in a soft tortilla.",
    price: "$4.49",
  },
  {
    name: "Jalapeno Taco",
    img: "/assets/img/taco-jalapeno.jpg",
    description: "Spicy jalapenos, chicken, and cheese topped with hot sauce.",
    price: "$4.99",
  },
  {
    name: "Cheese Taco",
    img: "/assets/img/taco-cheese.jpg",
    description: "Melted cheese blend with beans, salsa, and guacamole.",
    price: "$3.49",
  },
  {
    name: "Black Taco",
    img: "/assets/img/taco-black.jpg",
    description: "Black beans, rice, and pico de gallo with a tangy sauce.",
    price: "$3.79",
  },
];

const desserts = [
  {
    name: "Berries Cheesecake",
    img: "/assets/img/cake-berries.jpg",
    description: "Creamy cheesecake topped with fresh berries and berry sauce.",
    price: "$6.99",
  },
  {
    name: "Brownie",
    img: "/assets/img/cake-chocolate.jpg",
    description:
      "Rich chocolate brownie served with a drizzle of chocolate sauce.",
    price: "$4.99",
  },
  {
    name: "Orange Cake",
    img: "/assets/img/cake-orange.jpg",
    description: "Light and fluffy orange-flavored cake with citrus glaze.",
    price: "$5.49",
  },
  {
    name: "Macarons",
    img: "/assets/img/cake-macarons.jpg",
    description: "Assorted French macarons with creamy fillings.",
    price: "$7.99",
  },
  {
    name: "Orange Lemonade",
    img: "/assets/img/lemonade-orange.jpg",
    description: "Refreshing orange-infused lemonade with ice.",
    price: "$3.49",
  },
  {
    name: "Chia Lemonade",
    img: "/assets/img/lemonade-chia.jpg",
    description: "Healthy lemonade with chia seeds and a hint of honey.",
    price: "$3.99",
  },
];

const items = [...pizzas, ...sushi, ...tacos, ...desserts];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

app.get("/", (req, res) => {
  const randomItems = {
    pizza: getRandomItem(pizzas),
    sushi: getRandomItem(sushi),
    taco: getRandomItem(tacos),
    dessert: getRandomItem(desserts),
  };

  res.render("mainPage", { randomItems });
});

app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  // Conveyor settings
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Letter options
  const mailOptions = {
    from: email,
    to: process.env.EMAIL_NAME,
    subject: "New Contact Form Message",
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully!");
    console.log("Email sent successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending email.");
    console.log("Error sending email.");
  }
});

app.get("/about", (req, res) => {
  res.render("aboutUsPage");
});

app.get("/menu/:category", (req, res) => {
  const { category } = req.params;
  let items = [];
  const cart = req.session.cart || [];

  switch (category) {
    case "pizza":
      items = pizzas;
      break;
    case "sushi":
      items = sushi;
      break;
    case "tacos":
      items = tacos;
      break;
    case "desserts":
      items = desserts;
      break;
    default:
      items = [];
  }

  res.render("menu", { items, cart });
});

app.post("/cart/add", (req, res) => {
  const { name } = req.body;
  if (!req.session.cart) req.session.cart = [];

  const cart = req.session.cart || [];
  const item = items.find((item) => item.name === name);

  if (item) {
    const existingItem = cart.find((cartItem) => cartItem.name === name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
  }

  res.json({ cart, count: cart.reduce((acc, item) => acc + item.quantity, 0) });
});

app.get("/cart", (req, res) => {
  const cart = req.session.cart || [];
  res.render("cart", { cart });
});

app.post("/cart/remove", (req, res) => {
  const { name } = req.body;
  const cart = req.session.cart || [];
  if (req.session.cart) {
    req.session.cart = req.session.cart.filter((item) => item.name !== name);
  }
  res.json({ success: true, cart });
});

app.get("/checkout", (req, res) => {
  res.render("checkout");
});

app.post("/checkout", (req, res) => {
  const { cardNumber, expiry, cvv } = req.body;

  const cardNumberPattern = /^[0-9]{16}$/;
  const expiryDatePattern = /^(0[1-9]|1[0-2])\/(\d{2})$/;
  const cvvPattern = /^[0-9]{3,4}$/;

  if (
    cardNumberPattern.test(cardNumber) &&
    expiryDatePattern.test(expiry) &&
    cvvPattern.test(cvv)
  ) {
    (req.session.cart = []),
      res.json({
        success: true,
        message:
          "Payment successful! You will receive a notification about the waiting time in the mail.",
      });
  } else {
    res.json({
      success: false,
      message: "Invalid payment details. Please check and try again.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
