import { createRouter, createWebHistory } from "vue-router";
import { authRoutes } from "./authRoutes";
import { mainRoutes } from "./mainRoutes";

const routes = [
    ...authRoutes,
    ...mainRoutes,
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

