import { ref } from "vue";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useDebounce } from "@/composables/useDebounce";

describe("useDebounce composable", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("1) updates to new value after delay", async () => {
        const raw = ref("Hello");
        const debounced = useDebounce(raw, 300);
        expect(debounced.value).toBe("Hello");

        raw.value = "World";

        await vi.runAllTimersAsync();

        expect(debounced.value).toBe("World");
    });

    it("2) only last of quick changes is applied", async () => {
        const raw = ref("A");
        const debounced = useDebounce(raw, 200);

        raw.value = "B";
        raw.value = "C";
        raw.value = "D";

        await vi.runAllTimersAsync();

        expect(debounced.value).toBe("D");
    });

    it("3) handles spaced changes correctly", async () => {
        const raw = ref("X");
        const debounced = useDebounce(raw, 100);

        raw.value = "Y";
        await vi.advanceTimersByTimeAsync(100);
        expect(debounced.value).toBe("Y");

        raw.value = "Z";
        await vi.advanceTimersByTimeAsync(100);
        expect(debounced.value).toBe("Z");
    });

    it("4) cancels previous timeout when new value arrives", async () => {
        const raw = ref("Original");
        const debounced = useDebounce(raw, 400);

        raw.value = "Changed";
        await vi.advanceTimersByTimeAsync(200);
        expect(debounced.value).toBe("Original");

        raw.value = "Final";

        await vi.runAllTimersAsync();
        expect(debounced.value).toBe("Final");
    });

    it("5) uses default delay of 500ms when not specified", async () => {
        const raw = ref("Start");
        const debounced = useDebounce(raw);

        raw.value = "End";

        await vi.advanceTimersByTimeAsync(499);
        expect(debounced.value).toBe("Start");

        await vi.advanceTimersByTimeAsync(1);
        expect(debounced.value).toBe("End");
    });

    it("6) works with different data types", async () => {
        const numRef = ref(10);
        const debouncedNum = useDebounce(numRef, 100);
        numRef.value = 20;
        await vi.runAllTimersAsync();
        expect(debouncedNum.value).toBe(20);

        const objRef = ref({ name: "John" });
        const debouncedObj = useDebounce(objRef, 100);
        objRef.value = { name: "Jane" };
        await vi.runAllTimersAsync();
        expect(debouncedObj.value).toEqual({ name: "Jane" });

        const arrRef = ref([1, 2, 3]);
        const debouncedArr = useDebounce(arrRef, 100);
        arrRef.value = [4, 5, 6];
        await vi.runAllTimersAsync();
        expect(debouncedArr.value).toEqual([4, 5, 6]);
    });
});