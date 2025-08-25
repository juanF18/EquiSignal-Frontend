import type { RouteRecordRaw } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import DashboardPage from "@/pages/Dashboard/DashboardPage.vue";
import AnalysisPage from "@/pages/Analysis/AnalysisPage.vue";

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
            {
                path: "/analysis",
                name: "analysis",
                component: AnalysisPage,
            },
            // otras rutas protegidas...
        ],
    },
];
