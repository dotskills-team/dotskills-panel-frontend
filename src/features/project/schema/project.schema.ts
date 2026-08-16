// import { z } from "zod";

// import {
//   ProjectStatus,
//   ProjectType,
// } from "@/types/project.types";

// const statusValues = Object.values(
//   ProjectStatus,
// ) as [
//   ProjectStatus,
//   ...ProjectStatus[],
// ];

// const typeValues = Object.values(
//   ProjectType,
// ) as [
//   ProjectType,
//   ...ProjectType[],
// ];

// const objectIdSchema = z
//   .string()
//   .regex(
//     /^[0-9a-fA-F]{24}$/,
//     {
//       message: "Invalid selection.",
//     },
//   );

// export const createProjectFormSchema =
//   z.object({
//     name: z
//       .string({
//         message: "Project name is required.",
//       })
//       .trim()
//       .min(2, {
//         message:
//           "Project name must be at least 2 characters long.",
//       })
//       .max(150, {
//         message:
//           "Project name cannot exceed 150 characters.",
//       }),

//     description: z
//       .string()
//       .trim()
//       .max(2000, {
//         message:
//           "Description cannot exceed 2000 characters.",
//       })
//       .optional()
//       .or(z.literal("")),

//     type: z.enum(typeValues, {
//       message: "Please select a project type.",
//     }),

//     client: objectIdSchema,

//     projectManager: objectIdSchema,

//     developers: z
//       .array(objectIdSchema)
//       .optional()
//       .default([]),

//     budget: z.coerce
//       .number()
//       .min(0, {
//         message:
//           "Budget cannot be negative.",
//       })
//       .optional(),

//     startDate: z
//       .string({
//         message:
//           "Start date is required.",
//       })
//       .min(1, {
//         message:
//           "Start date is required.",
//       }),

//     endDate: z
//       .string()
//       .optional()
//       .or(z.literal("")),

//     technologies: z
//       .array(
//         z
//           .string()
//           .trim()
//           .min(1, {
//             message:
//               "Technology cannot be empty.",
//           }),
//       )
//       .min(1, {
//         message:
//           "At least one technology is required.",
//       }),

//     requirements: z
//       .string()
//       .trim()
//       .max(5000, {
//         message:
//           "Requirements cannot exceed 5000 characters.",
//       })
//       .optional()
//       .or(z.literal("")),

//     status: z
//       .enum(statusValues)
//       .optional(),

//     liveUrl: z
//       .string()
//       .trim()
//       .url({
//         message:
//           "Invalid live URL.",
//       })
//       .optional()
//       .or(z.literal("")),

//     developmentLiveUrl: z
//       .string()
//       .trim()
//       .url({
//         message:
//           "Invalid development URL.",
//       })
//       .optional()
//       .or(z.literal("")),

//     repositoryUrl: z
//       .string()
//       .trim()
//       .url({
//         message:
//           "Invalid repository URL.",
//       })
//       .optional()
//       .or(z.literal("")),
//   });

// export type CreateProjectFormValues =
//   z.infer<
//     typeof createProjectFormSchema
//   >;

// export const updateProjectFormSchema =
//   createProjectFormSchema.partial();

// export type UpdateProjectFormValues =
//   z.infer<
//     typeof updateProjectFormSchema
//   >;


// src/features/projects/schemas/project.schema.ts
// import { z } from "zod";
// import { ProjectStatus, ProjectType } from "@/types/project.types";

// const csvToArray = (val: string) =>
//   val
//     .split(",")
//     .map((item) => item.trim())
//     .filter(Boolean);

// export const createProjectFormSchema = z.object({
//   name: z.string().min(1, "Project name is required"),
//   description: z.string().optional(),
//   type: z.nativeEnum(ProjectType),
//   client: z.string().min(1, "Client is required"),
//   projectManager: z.string().min(1, "Project manager is required"),
//   developers: z
//     .string()
//     .optional()
//     .transform((val) => (val ? csvToArray(val) : [])),
//   budget: z.coerce.number().optional(),
//   startDate: z.string().min(1, "Start date is required"),
//   endDate: z.string().optional(),
//   technologies: z
//     .string()
//     .min(1, "Add at least one technology")
//     .transform(csvToArray),
//   requirements: z.string().optional(),
//   status: z.nativeEnum(ProjectStatus).optional(),
//   liveUrl: z.string().optional(),
//   developmentLiveUrl: z.string().optional(),
//   repositoryUrl: z.string().optional(),
// });

// // What the <input> fields actually hold (developers/technologies as comma string)
// export type CreateProjectFormValues = z.input<typeof createProjectFormSchema>;

// // What handleSubmit gives you after validation (developers/technologies as string[])
// export type CreateProjectFormOutput = z.output<typeof createProjectFormSchema>;

// src/features/projects/schemas/project.schema.ts
import { z } from "zod";
import { ProjectStatus, ProjectType } from "@/types/project.types";

const csvToArray = (val: string) =>
  val
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const createProjectFormSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  type: z.nativeEnum(ProjectType),
  client: z.string().min(1, "Client is required"),
  projectManager: z.string().min(1, "Project manager is required"),
  developers: z.array(z.string()).optional().default([]),
  budget: z.coerce.number().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  technologies: z
    .string()
    .min(1, "Add at least one technology")
    .transform(csvToArray),
  requirements: z.string().optional(),
  status: z.nativeEnum(ProjectStatus).optional(),
  liveUrl: z.string().optional(),
  developmentLiveUrl: z.string().optional(),
  repositoryUrl: z.string().optional(),
});

// What the form fields hold (technologies is still a comma string here)
export type CreateProjectFormValues = z.input<typeof createProjectFormSchema>;

// What handleSubmit gives you after validation (technologies is string[])
export type CreateProjectFormOutput = z.output<typeof createProjectFormSchema>;