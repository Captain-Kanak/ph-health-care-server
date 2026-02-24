import app from "./app";
import { env } from "./config/env";

const port = env.PORT;

const startServer = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

startServer();
