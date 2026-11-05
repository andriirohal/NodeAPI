import "dotenv/config";

import { app } from "./app.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
});