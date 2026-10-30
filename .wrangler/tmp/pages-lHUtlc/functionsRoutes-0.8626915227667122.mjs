import { onRequestGet as __api_order_js_onRequestGet } from "C:\\Projects\\rai_rybaka_shop_landing\\functions\\api\\order.js"
import { onRequestPost as __api_order_js_onRequestPost } from "C:\\Projects\\rai_rybaka_shop_landing\\functions\\api\\order.js"

export const routes = [
    {
      routePath: "/api/order",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_order_js_onRequestGet],
    },
  {
      routePath: "/api/order",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_order_js_onRequestPost],
    },
  ]