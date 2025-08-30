import { describe, it, expect } from "vitest";
import type { Stock } from "../types";
import { mapStockToCardProps } from "./mapStock";

describe("mapStockToCardProps", () => {
    const baseStock: Stock = {
        ID: "1",
        Ticker: "MSFT",
        Company: "Microsoft",
        Brokerage: "Goldman Sachs",
        Action: "updated by",
        RatingFrom: "Hold",
        RatingTo: "Buy",
        TargetFrom: "$278.00",
        TargetTo: "$300.00",
        Time: "2025-08-18T19:30:05.000Z",
        CreatedAt: "2025-08-18T19:30:05.000Z",
        UpdatedAt: "2025-08-18T19:30:05.000Z",
    };

    it("maps stock correctly with upward trend", () => {
        const result = mapStockToCardProps(baseStock);
        expect(result).toEqual({
            Ticker: "MSFT",
            Company: "Microsoft",
            Brokerage: "Goldman Sachs",
            prevTarget: 278,
            currentTarget: 300,
            Trend: "up",
            Rating: "Buy",
        });
    });

    it("detects downward trend", () => {
        const stock = { ...baseStock, TargetFrom: "$300.00", TargetTo: "$250.00" };
        const result = mapStockToCardProps(stock);
        expect(result.Trend).toBe("down");
    });

    it("detects neutral trend when values are equal", () => {
        const stock = { ...baseStock, TargetFrom: "$500.00", TargetTo: "$500.00" };
        const result = mapStockToCardProps(stock);
        expect(result.Trend).toBe("neutral");
    });

    it("parses values with commas correctly", () => {
        const stock = { ...baseStock, TargetFrom: "$1,234.50", TargetTo: "$1,500.75" };
        const result = mapStockToCardProps(stock);
        expect(result.prevTarget).toBeCloseTo(1234.5);
        expect(result.currentTarget).toBeCloseTo(1500.75);
        expect(result.Trend).toBe("up");
    });

    it("handles missing rating gracefully", () => {
        const stock = { ...baseStock, RatingTo: "" };
        const result = mapStockToCardProps(stock);
        expect(result.Rating).toBe("");
    });
});
