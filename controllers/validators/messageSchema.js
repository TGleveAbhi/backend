import { z } from "zod";

const COMMUNITY_MAP = {
  nifty: ["NF1", "NF2", "NF3", "NP1"],
  equity: ["EF1", "EF2", "EF3", "EP1"],
  commodity: ["CF1", "CF2", "CF3", "CP1"],
  "swing-trade": ["STF1", "STF2", "STF3", "STP1"],
};

export const messageSchema = z
  .object({
    communityName: z
      .string()
      .trim()
      .transform((val) => val.toLowerCase())
      .refine(
        (val) => ["equity", "commodity", "nifty", "swing-trade"].includes(val),
        {
          message:
            'Invalid option: expected one of "equity" | "commodity" | "nifty" | "swing-trade"',
        }
      ),

    subCommunityName: z
      .array(z.string().trim())
      .min(1, "At least one sub community required"),

    msgType: z
      .string()
      .trim()
      .transform((val) => val.toLowerCase())
      .refine(
        (val) =>
          ["trade", "promotion", "feedback", "followup", "flaunt"].includes(val),
        {
          message:
            'Invalid msgType: expected one of "trade" | "promotion" | "feedback" | "followup" | "flaunt"',
        }
      ),

    msgContent: z
      .string()
      .trim()
      .min(1, "Message content is required")
      .max(2000, "Message too long"),
  })

  // validate allowed subcommunity
  .refine(
    (data) => {
      const allowed = COMMUNITY_MAP[data.communityName];
      return data.subCommunityName.every((sub) => allowed.includes(sub));
    },
    {
      message: "One or more sub communities are invalid for the selected community",
      path: ["subCommunityName"],
    }
  )

  // prevent duplicates
  .refine(
    (data) => {
      return new Set(data.subCommunityName).size === data.subCommunityName.length;
    },
    {
      message: "Duplicate sub communities are not allowed",
      path: ["subCommunityName"],
    }
  );