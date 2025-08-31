import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import AppSpinner from "@/components/layout/AppSpinner.vue";

describe("AppSpinner.vue", () => {
    it("renders when loading is true", () => {
        const wrapper = mount(AppSpinner, { props: { loading: true } });
        expect(wrapper.find("span").exists()).toBe(true);
    });

    it("does not render when loading is false", () => {
        const wrapper = mount(AppSpinner, { props: { loading: false } });
        expect(wrapper.isVisible()).toBe(false);
    });


    it("applies small size classes when size='sm'", () => {
        const wrapper = mount(AppSpinner, { props: { size: "sm" } });
        const spinner = wrapper.find("span");
        expect(spinner.classes()).toContain("w-4");
        expect(spinner.classes()).toContain("h-4");
        expect(spinner.classes()).toContain("border-2");
    });

    it("applies medium size classes by default", () => {
        const wrapper = mount(AppSpinner);
        const spinner = wrapper.find("span");
        expect(spinner.classes()).toContain("w-8");
        expect(spinner.classes()).toContain("h-8");
        expect(spinner.classes()).toContain("border-4");
    });

    it("applies large size classes when size='lg'", () => {
        const wrapper = mount(AppSpinner, { props: { size: "lg" } });
        const spinner = wrapper.find("span");
        expect(spinner.classes()).toContain("w-12");
        expect(spinner.classes()).toContain("h-12");
        expect(spinner.classes()).toContain("border-4");
    });

    it("applies inline wrapper by default", () => {
        const wrapper = mount(AppSpinner);
        const div = wrapper.find("div");
        expect(div.classes()).toContain("inline-flex");
        expect(div.classes()).toContain("items-center");
    });

    it("applies center wrapper when position='center'", () => {
        const wrapper = mount(AppSpinner, { props: { position: "center" } });
        const div = wrapper.find("div");
        expect(div.classes()).toContain("flex");
        expect(div.classes()).toContain("justify-center");
        expect(div.classes()).toContain("h-full");
    });

    it("applies fullscreen wrapper when position='fullscreen'", () => {
        const wrapper = mount(AppSpinner, { props: { position: "fullscreen" } });
        const div = wrapper.find("div");
        expect(div.classes()).toContain("fixed");
        expect(div.classes()).toContain("inset-0");
        expect(div.classes()).toContain("bg-white/70");
    });

    it("applies custom border color", () => {
        const wrapper = mount(AppSpinner, { props: { color: "red" } });
        const spinner = wrapper.find("span");
        expect(spinner.attributes("style")).toContain("border-color: red");
    });
});
