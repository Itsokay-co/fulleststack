import createRouter from "@/api/lib/create-router";

import * as handlers from "./password-reset.handlers";
import * as routes from "./password-reset.routes";

const router = createRouter()
  .openapi(routes.requestReset, handlers.requestReset)
  .openapi(routes.confirmReset, handlers.confirmReset);

export default router;
