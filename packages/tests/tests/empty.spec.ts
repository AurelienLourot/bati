import { describeBati } from "@batijs/tests-utils";

export const matrix = [];

await describeBati(({ test, expect, fetch }) => {
  test("home", async () => {
    const res = await fetch("/");
    expect(res.status).toBe(200);
  });
});