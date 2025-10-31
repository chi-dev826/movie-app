import app from "./app";

const port = 3000;
const HOST = "0.0.0.0";

app.listen(port, HOST, () => {
  console.log(`Server is running on http://${HOST}:${port}`);
});
