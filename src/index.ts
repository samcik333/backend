import express, {Router} from "express";
import cookieParser from "cookie-parser";
import {Model} from "objection";
import Knex from "knex";
import routes from "./routes/index";
import bodyParser from "body-parser";
import cors from "cors";

var knexConfiig = require("../knexfile");
let knex;
let url: string | string[];
if (process.env.NODE_ENV == "production") {
	knex = Knex(knexConfiig.production);
	url = "https://sjsquad.herokuapp.com";
} else {
	knex = Knex(knexConfiig.development);
	url = "http://localhost:4200";
}

Model.knex(knex);

const PORT = process.env.PORT || 5005;
const app = express();
var distDir = __dirname + "/dist/";

app.set("trust proxy", 1); // trust first proxy
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", url); // update to match the domain you will make the request from
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept Authorization"
	);
	res.header("Access-Control-Allow-Credentials", "true");
	if (req.method === "OPTIONS") {
		res.header(
			"Access-Control-Allow-Methods",
			"POST, PUT, PATCH, GET, DELETE"
		);
		return res.status(200).json({});
	}

	next();
});
var corsOptions = {
	origin: url,
	optionsSuccessStatus: 200, // some legacy browsers, choke on 204
};
app.use(cors());

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(express.static(distDir));
app.use("/", routes);

app.listen(PORT, () => {
	console.log(`app running on port ${PORT}`);
});
