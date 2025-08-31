import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import Pagination from "@/components/layout/Pagination.vue";

// Stub que respeta clases/props/click
const ButtonStub = {
    template: `<button v-bind="$attrs" @click="$emit('click', $event)"><slot /></button>`,
};

// Íconos como stubs simples
const IconStub = { template: "<i />" };

function getNumberButtons(wrapper: any) {
    // Filtra solo los botones con texto numérico (1..N)
    return wrapper.findAll("button").filter((b: any) => /^\d+$/.test(b.text()));
}

function getAllButtons(wrapper: any) {
    return wrapper.findAll("button");
}

describe("Pagination.vue", () => {
    const mountFactory = (props = { page: 1, totalPages: 10 }) =>
        shallowMount(Pagination, {
            props,
            global: {
                stubs: {
                    Button: ButtonStub,
                    ChevronLeft: IconStub,
                    ChevronRight: IconStub,
                    ChevronsLeft: IconStub,
                    ChevronsRight: IconStub,
                },
            },
        });

    it("muestra 5 páginas visibles al inicio (1..5)", () => {
        const wrapper = mountFactory({ page: 1, totalPages: 10 });
        const nums = getNumberButtons(wrapper).map((b: any) => Number(b.text()));
        expect(nums).toEqual([1, 2, 3, 4, 5]);
    });

    it("muestra ventana centrada en el medio (p=5 -> 3..7)", async () => {
        const wrapper = mountFactory({ page: 5, totalPages: 10 });
        const nums = getNumberButtons(wrapper).map((b: any) => Number(b.text()));
        expect(nums).toEqual([3, 4, 5, 6, 7]);
    });

    it("muestra ventana al final (p=10 -> 6..10)", () => {
        const wrapper = mountFactory({ page: 10, totalPages: 10 });
        const nums = getNumberButtons(wrapper).map((b: any) => Number(b.text()));
        expect(nums).toEqual([6, 7, 8, 9, 10]);
    });

    it("deshabilita first/prev en la primera página", () => {
        const wrapper = mountFactory({ page: 1, totalPages: 10 });
        const buttons = getAllButtons(wrapper);
        const first = buttons[0];
        const prev = buttons[1];
        expect(first.attributes("disabled")).toBeDefined();
        expect(prev.attributes("disabled")).toBeDefined();
    });

    it("deshabilita next/last en la última página", () => {
        const wrapper = mountFactory({ page: 10, totalPages: 10 });
        const buttons = getAllButtons(wrapper);
        const next = buttons[buttons.length - 2];
        const last = buttons[buttons.length - 1];
        expect(next.attributes("disabled")).toBeDefined();
        expect(last.attributes("disabled")).toBeDefined();
    });

    it("emite goToPage(n) al hacer click en un número", async () => {
        const wrapper = mountFactory({ page: 1, totalPages: 10 });
        const btn4 = getNumberButtons(wrapper).find((b: any) => b.text() === "4")!;
        await btn4.trigger("click");
        expect(wrapper.emitted("goToPage")?.[0]).toEqual([4]);
    });

    it("emite prev y next en sus flechas", async () => {
        const wrapper = mountFactory({ page: 5, totalPages: 10 });
        const buttons = getAllButtons(wrapper);
        const prev = buttons[1];
        const next = buttons[buttons.length - 2];

        await prev.trigger("click");
        await next.trigger("click");

        expect(wrapper.emitted("prev")).toBeTruthy();
        expect(wrapper.emitted("next")).toBeTruthy();
    });

    it("emite goToPage(1) y goToPage(totalPages) en first/last", async () => {
        const wrapper = mountFactory({ page: 4, totalPages: 10 });
        const buttons = getAllButtons(wrapper);

        // buscar explícitamente por texto (si el stub de botón renderiza children)
        const firstBtn = buttons.find((b: any) => b.text().includes("«")) || buttons[0];
        const lastBtn = buttons.find((b: any) => b.text().includes("»")) || buttons[buttons.length - 1];

        await firstBtn.trigger("click");
        await lastBtn.trigger("click");

        const emits = wrapper.emitted("goToPage")!;
        expect(emits).toContainEqual([1]);
        expect(emits).toContainEqual([10]);
    });


    it("actualiza la ventana al cambiar props", async () => {
        const wrapper = mountFactory({ page: 2, totalPages: 10 });
        await wrapper.setProps({ page: 9 });
        const nums = getNumberButtons(wrapper).map((b: any) => Number(b.text()));
        expect(nums).toEqual([6, 7, 8, 9, 10]);
    });

    it("marca la página activa con la clase activa", () => {
        const wrapper = mountFactory({ page: 3, totalPages: 10 });
        const activeBtn = getNumberButtons(wrapper).find((b: any) => b.text() === "3")!;
        // Solo checo una de las clases clave para no atarme a todas
        expect(activeBtn.classes().some((c: string) => c.includes("bg-[#00AF75]"))).toBe(true);
    });
});
