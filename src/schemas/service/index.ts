import { Type } from "@prisma/client";
import { z } from "zod";

const putServices = z.object({
  youtube: z.object({
    id: z.enum(["youtube", "tiktok", "twitter"]),
    url: z.string().url("Invalid URL").min(1, "Required"),
    type: z.nativeEnum(Type),
  }),
  tiktok: z.object({
    id: z.enum(["youtube", "tiktok", "twitter"]),
    url: z.string().url("Invalid URL").min(1, "Required"),
    type: z.nativeEnum(Type),
  }),
  twitter: z.object({
    id: z.enum(["youtube", "tiktok", "twitter"]),
    url: z.string().url("Invalid URL").min(1, "Required"),
    type: z.nativeEnum(Type),
  }),
  facebook: z.object({
    id: z.enum(["youtube", "tiktok", "twitter", "facebook"]),
    url: z.string().url("Invalid URL").min(1, "Required"),
    type: z.nativeEnum(Type),
  }),
});

const ServiceSchema = {
  putServices,
};

export default ServiceSchema;
