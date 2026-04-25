require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const logger = require("./src/utils/logger");

const PORT = Number(process.env.PORT) || 5000;

async function bootstrap() {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`NHIS backend running on port ${PORT}`);
  });
}

bootstrap().catch((error) => {
  logger.error("Failed to start server", { error: error.message });
  process.exit(1);
});
