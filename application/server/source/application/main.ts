import { application } from "./application";

application.listen(Number(process.env.SERVICE_SERVER_PORT), () => {
  console.log(
    `Server hosted on ${process.env.SERVICE_SERVER_URL} by Elysia.JS`,
  );
});
