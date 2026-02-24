import dotenv from "dotenv";
import path from "path";

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { createApp } from "./app";
import { createContainer } from "./src/container";

const PORT = process.env.PORT || 3001;

// 1. Create dependency container (Real dependencies are instantiated here)
const container = createContainer();

// 2. Create application with dependencies
const app = createApp(container);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
