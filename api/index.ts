import { createApp } from "./src/app";
import { createContainer } from "./src/container";

const container = createContainer();
const app = createApp(container);

export default app;