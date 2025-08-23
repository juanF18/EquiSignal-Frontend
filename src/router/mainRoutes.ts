import type { RouteRecordRaw } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import DashboardPage from "@/pages/Dashboard/DashboardPage.vue";

export const mainRoutes: RouteRecordRaw[] = [
    {
        path: "/",
        component: MainLayout,
        children: [
            {
                path: "",
                name: "dashboard",
                component: DashboardPage,
            },
            // otras rutas protegidas...
        ],
    },
];
