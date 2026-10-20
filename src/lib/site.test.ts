import { describe, expect, it } from "vitest";
import { findRoute, mainNavigation, navigation } from "./site";

describe("site navigation", () => {
  it("keeps the six public sections in the required order", () => {
    expect(mainNavigation.map(({ label }) => label)).toEqual([
      "Accueil", "À propos", "Actions", "Publications", "Actualités", "Contact",
    ]);
  });

  it("contains unique links for each public section", () => {
    const links = navigation.flatMap((group) => [group.href, ...group.items.map((item) => item.href)]);
    expect(new Set(links).size).toBe(links.length);
  });

  it("resolves every listed route to its parent section", () => {
    for (const group of navigation) {
      expect(findRoute(group.href)?.group.label).toBe(group.label);
      for (const item of group.items) expect(findRoute(item.href)?.group.label).toBe(group.label);
    }
  });
});
