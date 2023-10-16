import { describe, expect, it } from "bun:test";
import {
  runTerraformApply,
  runTerraformInit,
  testRequiredVariables,
} from "../test";

describe("exoscale-instance-type", async () => {
  await runTerraformInit(import.meta.dir);

  testRequiredVariables(import.meta.dir, {});

  it("default output", async () => {
    const state = await runTerraformApply(import.meta.dir, {});
    expect(state.outputs.value.value).toBe("");
  });

  it("customized default", async () => {
    const state = await runTerraformApply(import.meta.dir, {
      default: "gpu3.huge",
      type_category: `["gpu", "cpu"]`,
    });
    expect(state.outputs.value.value).toBe("gpu3.huge");
  });

  it("fails because of wrong categroy definition", async () => {
    expect(async () => {
      await runTerraformApply(import.meta.dir, {
        default: "gpu3.huge",
        // type_category: ["standard"] is standard
      });
    }).toThrow('default value "gpu3.huge" must be defined as one of options');
  });
});
