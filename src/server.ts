import "dotenv/config";
import app from "./app";

const port = process.env.PORT || 5000;

const bootstrap = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

bootstrap();
