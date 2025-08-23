import type { RouteRecordRaw } from "vue-router";
import AuthLayout from "@/layouts/AuthLayout.vue";
import LoginPage from "@/pages/Login/LoginPage.vue";

export const authRoutes: RouteRecordRaw[] = [
    {
        path: "/auth",
        component: AuthLayout,
        children: [
            {
                path: "login",
                name: "login",
                component: LoginPage,
            },
            // otras rutas de auth (register, forgot-password, etc.)
        ],
    },
];
