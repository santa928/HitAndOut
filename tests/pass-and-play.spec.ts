import { expect, test } from "@playwright/test";

test("home how to play guide stays readable before the match", async ({
  page,
}, testInfo) => {
  await page.goto("/");

  await page.screenshot({
    path: testInfo.outputPath(`${testInfo.project.name}-home.png`),
  });

  await page.getByRole("button", { name: "遊び方" }).click();

  const guide = page.getByRole("dialog", { name: "遊び方" });
  const guidePanel = guide.locator(".how-to-play__panel");
  const closeButton = guide.getByRole("button", { name: "とじる" });
  const guidePanelBox = await guidePanel.boundingBox();
  const closeButtonBox = await closeButton.boundingBox();
  const viewport = page.viewportSize();

  await expect(guide).toContainText("投手役がヒット位置を隠す");

  expect(guidePanelBox).not.toBeNull();
  expect(closeButtonBox).not.toBeNull();
  expect(viewport).not.toBeNull();

  if (!guidePanelBox || !closeButtonBox || !viewport) {
    throw new Error("遊び方モーダルの境界を取得できませんでした。");
  }

  expect(guidePanelBox.x).toBeGreaterThanOrEqual(0);
  expect(guidePanelBox.y).toBeGreaterThanOrEqual(0);
  expect(guidePanelBox.x + guidePanelBox.width).toBeLessThanOrEqual(
    viewport.width,
  );
  expect(guidePanelBox.y + guidePanelBox.height).toBeLessThanOrEqual(
    viewport.height,
  );
  expect(closeButtonBox.x).toBeGreaterThanOrEqual(guidePanelBox.x);
  expect(closeButtonBox.y).toBeGreaterThanOrEqual(guidePanelBox.y);
  expect(closeButtonBox.x + closeButtonBox.width).toBeLessThanOrEqual(
    guidePanelBox.x + guidePanelBox.width,
  );
  expect(closeButtonBox.y + closeButtonBox.height).toBeLessThanOrEqual(
    guidePanelBox.y + guidePanelBox.height,
  );

  await page.screenshot({
    path: testInfo.outputPath(`${testInfo.project.name}-how-to-play.png`),
  });
});

test("pitcher selection stays hidden before the batter guess", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "2人であそぶ" }).click();
  await page.getByRole("button", { name: "1塁に隠す" }).click();

  await expect(page.getByText("打者に端末をわたす")).toBeVisible();
  await expect(page.getByRole("button", { name: "1塁に隠す" })).toHaveCount(0);

  await page.getByRole("button", { name: "打者の画面へ" }).click();
  await expect(page.getByRole("button", { name: "1塁をねらう" })).toBeVisible();
});

test("batter keeps reading the same setup after an out", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await page.getByRole("button", { name: "2人であそぶ" }).click();
  await page.getByRole("button", { name: "1塁に隠す" }).click();
  await page.getByRole("button", { name: "打者の画面へ" }).click();
  await page.getByRole("button", { name: "2塁をねらう" }).click();

  await expect(page.getByText("OUT!")).toBeVisible();
  await page.getByRole("button", { name: "残りを読む" }).click();

  await expect(page.getByRole("button", { name: "1塁をねらう" })).toBeVisible();
  await expect(page.getByRole("button", { name: "2塁はアウト" })).toBeDisabled();

  await page.screenshot({
    path: testInfo.outputPath(`${testInfo.project.name}-out-lamp.png`),
  });
});

test("hit feedback leaves a pixel runner on the occupied base", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await page.getByRole("button", { name: "2人であそぶ" }).click();
  await page.getByRole("button", { name: "1塁に隠す" }).click();
  await page.getByRole("button", { name: "打者の画面へ" }).click();
  await page.getByRole("button", { name: "1塁をねらう" }).click();
  await expect(page.getByText("HIT!")).toBeVisible();

  await page.getByRole("button", { name: "次の勝負へ" }).click();
  await expect(page.getByAltText("1Bの走者")).toBeVisible();

  await page.screenshot({
    path: testInfo.outputPath(`${testInfo.project.name}-runner.png`),
  });
});

test("scoreboard and playfield HUD stay inside the game screen", async ({
  page,
}, testInfo) => {
  const outLampAnchors = [
    { x: 895 / 1200, y: 405 / 581 },
    { x: 970 / 1200, y: 405 / 581 },
    { x: 1045 / 1200, y: 405 / 581 },
  ];

  await page.goto("/");
  await page.getByRole("button", { name: "2人であそぶ" }).click();

  const gameScreen = page.getByLabel("ゲーム画面");
  const field = page.getByLabel("球場盤面");
  const scoreboard = field.getByLabel("スコアボード");
  const prompt = field.getByText("ヒットを隠す場所を選べ");
  const gameScreenBox = await gameScreen.boundingBox();
  const scoreboardBox = await scoreboard.boundingBox();
  const fieldBox = await field.boundingBox();
  const promptBox = await prompt.boundingBox();
  const outLamps = scoreboard.locator(".scoreboard__outs i");

  expect(gameScreenBox).not.toBeNull();
  expect(scoreboardBox).not.toBeNull();
  expect(fieldBox).not.toBeNull();
  expect(promptBox).not.toBeNull();

  if (!gameScreenBox || !scoreboardBox || !fieldBox || !promptBox) {
    throw new Error("ゲーム画面レイアウトの境界を取得できませんでした。");
  }

  expect(fieldBox.x).toBeGreaterThanOrEqual(gameScreenBox.x);
  expect(fieldBox.y).toBeGreaterThanOrEqual(gameScreenBox.y);
  expect(scoreboardBox.x).toBeGreaterThanOrEqual(fieldBox.x);
  expect(scoreboardBox.y).toBeGreaterThanOrEqual(fieldBox.y);
  expect(scoreboardBox.x + scoreboardBox.width).toBeLessThanOrEqual(
    fieldBox.x + fieldBox.width,
  );

  await expect(outLamps).toHaveCount(3);

  for (const [index, lamp] of (await outLamps.all()).entries()) {
    const lampBox = await lamp.boundingBox();
    expect(lampBox).not.toBeNull();

    if (!lampBox) {
      throw new Error("アウトランプの境界を取得できませんでした。");
    }

    expect(lampBox.x).toBeGreaterThanOrEqual(scoreboardBox.x);
    expect(lampBox.y).toBeGreaterThanOrEqual(scoreboardBox.y);
    expect(lampBox.x + lampBox.width).toBeLessThanOrEqual(
      scoreboardBox.x + scoreboardBox.width,
    );
    expect(lampBox.y + lampBox.height).toBeLessThanOrEqual(
      scoreboardBox.y + scoreboardBox.height,
    );

    const lampCenter = {
      x:
        (lampBox.x + lampBox.width / 2 - scoreboardBox.x) /
        scoreboardBox.width,
      y:
        (lampBox.y + lampBox.height / 2 - scoreboardBox.y) /
        scoreboardBox.height,
    };

    expect(lampCenter.x).toBeCloseTo(outLampAnchors[index].x, 2);
    expect(lampCenter.y).toBeCloseTo(outLampAnchors[index].y, 2);
  }

  expect(promptBox.x).toBeGreaterThanOrEqual(fieldBox.x);
  expect(promptBox.y + promptBox.height).toBeLessThanOrEqual(
    fieldBox.y + fieldBox.height,
  );

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
