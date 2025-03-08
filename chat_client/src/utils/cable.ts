import { createConsumer } from "@rails/actioncable";
import Cookies from "js-cookie";

const token = JSON.parse(Cookies.get("auth") || "{}").token;

const consumer = createConsumer(`ws://localhost:3000/cable?token=${token}`);

export default consumer;
