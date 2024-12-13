import server from "./server";
import colors from "colors";
import "./utils/cron";

const port = process.env.PORT || 4000;

server.listen(port, () => {
    console.log(colors.cyan.bold(`Server running on port ${port}`));
});
