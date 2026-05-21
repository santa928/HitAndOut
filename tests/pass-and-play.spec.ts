import { expect, test } from "@playwright/test";

test("pitcher selection stays hidden before the batter guess", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "2人であそぶ" }).click();
  await page.getByRole("button", { name: "1塁に隠す" }).click();

  await expect(page.getByText("打者に端末をわたす")).toBeVisible();
  await expect(page.getByRole("button", { name: "1塁に隠す" })).toHaveCount(0);

  await page.getByRole("button", { name: "打者の画面へ" }).click();
  await expect(page.getByRole("button", { name: "1塁をねらう" })).toBeVisible();
});

test("scoreboard and field keep their anchored layout", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByRole("button", { name: "2人であそぶ" }).click();

  const scoreboard = page.getByLabel("スコアボード");
  const field = page.getByLabel("球場盤面");
  const scoreboardBox = await scoreboard.boundingBox();
  const fieldBox = await field.boundingBox();

  expect(scoreboardBox).not.toBeNull();
  expect(fieldBox).not.toBeNull();

  if (!scoreboardBox || !fieldBox) {
    throw new Error("盤面レイアウトの境界を取得できませんでした。");
  }

  expect(scoreboardBox.y + scoreboardBox.height).toBeLessThan(fieldBox.y);

  for (const button of await field.getByRole("button").all()) {
    const buttonBox = await button.boundingBox();
    expect(buttonBox).not.toBeNull();

    if (!buttonBox) {
      throw new Error("ベースボタンの境界を取得できませんでした。");
    }

    expect(buttonBox.x).toBeGreaterThanOrEqual(fieldBox.x);
    expect(buttonBox.y).toBeGreaterThanOrEqual(fieldBox.y);
    expect(buttonBox.x + buttonBox.width).toBeLessThanOrEqual(
      fieldBox.x + fieldBox.width,
    );
    expect(buttonBox.y + buttonBox.height).toBeLessThanOrEqual(
      fieldBox.y + fieldBox.height,
    );
  }

  await page.screenshot({
    path: testInfo.outputPath(`${testInfo.project.name}-field.png`),
  });
});
