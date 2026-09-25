import "dotenv/config";
import app from "./src/app.js";

const port = process.env.PORT || 3001;

app.listen(port, "0.0.0.0", () => {
  console.log(`API disponible sur le port ${port}`);
});