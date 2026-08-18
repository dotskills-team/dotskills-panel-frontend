// // src/features/projects/components/project-form-dialog.tsx
// "use client";

// import { useEffect } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { Loader2 } from "lucide-react";
// import { toast } from "sonner";

// import { Button } from "@/components/ui/button";
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// import type { IProject } from "@/types/project.types";
// import { CreateProjectFormOutput, createProjectFormSchema, CreateProjectFormValues } from "@/features/project/schema/project.schema";
// import { PROJECT_STATUS_OPTIONS, PROJECT_TYPE_OPTIONS } from "@/features/project/constants/project.constants";
// import { useProjectMutations } from "@/features/project/hooks";
// import { useAssignableUsers } from "@/features/users/hooks/useAssignableUsers";
// import { DeveloperMultiSelect } from "./DeveloperMultiselect";
// import { getUserFullName } from "@/features/users/utils/user.utils";
// import { useClients } from "@/features/clients/hooks";

// interface ProjectFormDialogProps {
//     mode: "create" | "edit";
//     project?: IProject;
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
// }

// const EMPTY_VALUES: CreateProjectFormValues = {
//     name: "",
//     description: "",
//     type: PROJECT_TYPE_OPTIONS[0].value,
//     client: "",
//     projectManager: "",
//     developers: [],
//     budget: undefined,
//     startDate: "",
//     endDate: "",
//     technologies: "",
//     requirements: "",
//     status: PROJECT_STATUS_OPTIONS[0].value,
//     liveUrl: "",
//     developmentLiveUrl: "",
//     repositoryUrl: "",
// };

// const projectToFormValues = (project: IProject): CreateProjectFormValues => ({
//   name: project.name,
//   description: project.description ?? "",
//   type: project.type,
//   client: project.client?._id ?? "",
//   projectManager: project.projectManager?._id ?? "",
//   developers: project.developers?.map((dev) => dev._id) ?? [],
//   budget: project.budget,
//   startDate: project.startDate?.slice(0, 10) ?? "",
//   endDate: project.endDate?.slice(0, 10) ?? "",
//   technologies: project.technologies?.join(", ") ?? "",
//   requirements: project.requirements ?? "",
//   status: project.status,
//   liveUrl: project.liveUrl ?? "",
//   developmentLiveUrl: project.developmentLiveUrl ?? "",
//   repositoryUrl: project.repositoryUrl ?? "",
// });


// export function ProjectFormDialog({ mode, project, open, onOpenChange }: ProjectFormDialogProps) {
//     const { createProject, updateProject } = useProjectMutations();
//     const { data: usersResponse } = useAssignableUsers();
//     const {data: clients} = useClients();

//     const users = usersResponse?.data ?? [];
//     const form = useForm<CreateProjectFormValues, unknown, CreateProjectFormOutput>({
//         resolver: zodResolver(createProjectFormSchema),
//         defaultValues: mode === "edit" && project ? projectToFormValues(project) : EMPTY_VALUES,
//     });

//     useEffect(() => {
//         if (open) {
//             form.reset(mode === "edit" && project ? projectToFormValues(project) : EMPTY_VALUES);
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [open, project, mode]);

//     const isSubmitting = createProject.isPending || updateProject.isPending;

//     const onSubmit = form.handleSubmit((values) => {
//         const payload = {
//             ...values,
//             description: values.description || undefined,
//             endDate: values.endDate || undefined,
//             requirements: values.requirements || undefined,
//             liveUrl: values.liveUrl || undefined,
//             developmentLiveUrl: values.developmentLiveUrl || undefined,
//             repositoryUrl: values.repositoryUrl || undefined,
//         };

//         if (mode === "create") {
//             createProject.mutate(payload, {
//                 onSuccess: () => {
//                     toast.success("Project created successfully.");
//                     onOpenChange(false);
//                 },
//                 onError: () => toast.error("Failed to create project."),
//             });
//         } else if (project) {
//             updateProject.mutate(
//                 { id: project._id, payload },
//                 {
//                     onSuccess: () => {
//                         toast.success("Project updated successfully.");
//                         onOpenChange(false);
//                     },
//                     onError: () => toast.error("Failed to update project."),
//                 },
//             );
//         }
//     });

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent className="max-w-2xl overflow-y-auto bg-gray-100 dark:bg-slate-950">
//                 <ScrollArea className="max-h-[80vh] pr-2">
//                     <form onSubmit={onSubmit} className="flex flex-col gap-6">
//                         <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                             <Field label="Project Name" error={form.formState.errors.name?.message}>
//                                 <Input {...form.register("name")} placeholder="Insurance Portal Revamp" />
//                             </Field>
//                             <Field label="Client" error={form.formState.errors.client?.message}>
//                                 <Select
//                                     value={form.watch("client")}
//                                     onValueChange={(value) => form.setValue("client", value)}
//                                 >
//                                     <SelectTrigger>
//                                         <SelectValue placeholder="Select client" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {clients?.map((client) => (
//                                             <SelectItem key={client._id} value={client._id}>
//                                                 {getUserFullName(client)}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </Field>

//                             <Field
//                                 label="Project Leader"
//                                 error={form.formState.errors.projectManager?.message}
//                             >
//                                 <Select
//                                     value={form.watch("projectManager")}
//                                     onValueChange={(value) => form.setValue("projectManager", value)}
//                                 >
//                                     <SelectTrigger>
//                                         <SelectValue placeholder="Select project leader" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {users.map((user) => (
//                                             <SelectItem key={user._id} value={user._id}>
//                                                 {getUserFullName(user)}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </Field>

//                             <Field label="Developers">
//                                 <DeveloperMultiSelect
//                                     users={users}
//                                     value={form.watch("developers") ?? []}
//                                     onChange={(value) => form.setValue("developers", value)}
//                                 />
//                             </Field>
//                             <Field label="Type" error={form.formState.errors.type?.message}>
//                                 <Select
//                                     value={form.watch("type")}
//                                     onValueChange={(value) =>
//                                         form.setValue("type", value as CreateProjectFormValues["type"])
//                                     }
//                                 >
//                                     <SelectTrigger>
//                                         <SelectValue placeholder="Select type" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {PROJECT_TYPE_OPTIONS.map((option) => (
//                                             <SelectItem key={option.value} value={option.value}>
//                                                 {option.label}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </Field>
//                             <Field label="Status">
//                                 <Select
//                                     value={form.watch("status")}
//                                     onValueChange={(value) =>
//                                         form.setValue("status", value as CreateProjectFormValues["status"])
//                                     }
//                                 >
//                                     <SelectTrigger>
//                                         <SelectValue placeholder="Select status" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {PROJECT_STATUS_OPTIONS.map((option) => (
//                                             <SelectItem key={option.value} value={option.value}>
//                                                 {option.label}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </Field>
//                             <Field label="Budget ($)">
//                                 <Input type="number" min={0} {...form.register("budget")} />
//                             </Field>
//                             <Field label="Start Date" error={form.formState.errors.startDate?.message}>
//                                 <Input type="date" {...form.register("startDate")} />
//                             </Field>
//                             <Field label="End Date">
//                                 <Input type="date" {...form.register("endDate")} />
//                             </Field>
//                         </section>

//                         <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                             <Field label="Live URL">
//                                 <Input {...form.register("liveUrl")} placeholder="https://example.com" />
//                             </Field>
//                             <Field label="Development URL">
//                                 <Input
//                                     {...form.register("developmentLiveUrl")}
//                                     placeholder="https://dev.example.com"
//                                 />
//                             </Field>
//                             <Field label="Repository URL">
//                                 <Input
//                                     {...form.register("repositoryUrl")}
//                                     placeholder="https://github.com/org/repo"
//                                 />
//                             </Field>
//                             <Field
//                                 label="Technologies (comma separated)"
//                                 error={form.formState.errors.technologies?.message}
//                             >
//                                 <Input
//                                     {...form.register("technologies")}
//                                     placeholder="Next.js, Node.js, MongoDB"
//                                 />
//                             </Field>
//                         </section>

//                         <section className="grid grid-cols-1 gap-4">
//                             <Field label="Description">
//                                 <Textarea
//                                     rows={3}
//                                     {...form.register("description")}
//                                     placeholder="Project overview..."
//                                 />
//                             </Field>
//                             <Field label="Requirements">
//                                 <Textarea
//                                     rows={3}
//                                     {...form.register("requirements")}
//                                     placeholder="Scope, deliverables, constraints..."
//                                 />
//                             </Field>
//                         </section>

//                         <DialogFooter>
//                             <Button
//                                 type="button"
//                                 variant="outline"
//                                 onClick={() => onOpenChange(false)}
//                                 disabled={isSubmitting}
//                             >
//                                 Cancel
//                             </Button>
//                             <Button
//                                 type="submit"
//                                 disabled={isSubmitting}
//                                 variant="default"
//                                 className="gap-2 text-white bg-indigo-600 transition-transform duration-500 ease-in-out hover:scale-105 hover:cursor-pointer hover:bg-cyan-800"
//                             >
//                                 {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
//                                 {mode === "create" ? "Create Project" : "Save Changes"}
//                             </Button>
//                         </DialogFooter>
//                     </form>
//                     <ScrollBar orientation="vertical" />
//                 </ScrollArea>
//             </DialogContent>
//         </Dialog>
//     );
// }

// function Field({
//     label,
//     error,
//     children,
// }: {
//     label: string;
//     error?: string;
//     children: React.ReactNode;
// }) {
//     return (
//         <div className="flex flex-col gap-1.5">
//             <Label>{label}</Label>
//             {children}
//             {error && <span className="text-xs text-destructive">{error}</span>}
//         </div>
//     );
// }



// v2

// src/features/projects/components/project-form-dialog.tsx
// "use client";

// import { useEffect } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useFieldArray, useForm } from "react-hook-form";
// import { Loader2, Plus, Trash2 } from "lucide-react";
// import { toast } from "sonner";

// import { Button } from "@/components/ui/button";
// import {
//     Dialog,
//     DialogContent,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import { Separator } from "@/components/ui/separator";

// import type { IProject } from "@/types/project.types";
// import { PaymentStatus } from "@/types/project.types";
// import { CreateProjectFormOutput, createProjectFormSchema, CreateProjectFormValues } from "@/features/project/schema/project.schema";
// import { PAYMENT_STATUS_OPTIONS, PROJECT_STATUS_OPTIONS, PROJECT_TYPE_OPTIONS } from "@/features/project/constants/project.constants";
// import { useProjectMutations } from "@/features/project/hooks";
// import { useAssignableUsers } from "@/features/users/hooks/useAssignableUsers";
// import { DeveloperMultiSelect } from "./DeveloperMultiselect";
// import { getUserFullName } from "@/features/users/utils/user.utils";
// import { useClients } from "@/features/clients/hooks";

// interface ProjectFormDialogProps {
//     mode: "create" | "edit";
//     project?: IProject;
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
// }

// const EMPTY_VALUES: CreateProjectFormValues = {
//     name: "",
//     description: "",
//     type: PROJECT_TYPE_OPTIONS[0].value,
//     client: "",
//     projectManager: "",
//     developers: [],
//     budget: undefined,
//     startDate: "",
//     endDate: "",
//     technologies: "",
//     documents: [],
//     status: PROJECT_STATUS_OPTIONS[0].value,
//     paymentStatus: PaymentStatus.DUE,
//     payments: [],
//     nextPaymentDate: "",
//     priority: undefined,
//     liveUrl: "",
//     developmentLiveUrl: "",
//     repositoryUrl: "",
// };

// const projectToFormValues = (project: IProject): CreateProjectFormValues => ({
//   name: project.name,
//   description: project.description ?? "",
//   type: project.type,
//   client: project.client?._id ?? "",
//   projectManager: project.projectManager?._id ?? "",
//   developers: project.developers?.map((dev) => dev._id) ?? [],
//   budget: project.budget,
//   startDate: project.startDate?.slice(0, 10) ?? "",
//   endDate: project.endDate?.slice(0, 10) ?? "",
//   technologies: project.technologies?.join(", ") ?? "",
//   documents: project.documents?.map((doc) => ({
//     requirement: doc.requirement,
//     link: doc.link,
//   })) ?? [],
//   status: project.status,
//   paymentStatus: project.paymentStatus ?? PaymentStatus.DUE,
//   payments: project.payments?.map((p) => ({
//     amount: p.amount,
//     date: p.date?.slice(0, 10) ?? "",
//     status: p.status,
//     note: p.note ?? "",
//   })) ?? [],
//   nextPaymentDate: project.nextPaymentDate?.slice(0, 10) ?? "",
//   priority: project.priority,
//   liveUrl: project.liveUrl ?? "",
//   developmentLiveUrl: project.developmentLiveUrl ?? "",
//   repositoryUrl: project.repositoryUrl ?? "",
// });


// export function ProjectFormDialog({ mode, project, open, onOpenChange }: ProjectFormDialogProps) {
//     const { createProject, updateProject } = useProjectMutations();
//     const { data: usersResponse } = useAssignableUsers();
//     const {data: clients} = useClients();

//     const users = usersResponse?.data ?? [];
//     const form = useForm<CreateProjectFormValues, unknown, CreateProjectFormOutput>({
//         resolver: zodResolver(createProjectFormSchema),
//         defaultValues: mode === "edit" && project ? projectToFormValues(project) : EMPTY_VALUES,
//     });

//     const documentsArray = useFieldArray({
//         control: form.control,
//         name: "documents",
//     });

//     const paymentsArray = useFieldArray({
//         control: form.control,
//         name: "payments",
//     });

//     useEffect(() => {
//         if (open) {
//             form.reset(mode === "edit" && project ? projectToFormValues(project) : EMPTY_VALUES);
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [open, project, mode]);

//     const isSubmitting = createProject.isPending || updateProject.isPending;

//     const onSubmit = form.handleSubmit((values) => {
//         const payload = {
//             ...values,
//             description: values.description || undefined,
//             endDate: values.endDate || undefined,
//             liveUrl: values.liveUrl || undefined,
//             developmentLiveUrl: values.developmentLiveUrl || undefined,
//             repositoryUrl: values.repositoryUrl || undefined,
//             nextPaymentDate: values.nextPaymentDate || undefined,
//             documents: values.documents?.filter((doc) => doc.requirement && doc.link),
//             payments: values.payments?.filter((p) => p.amount !== undefined && p.date),
//         };

//         if (mode === "create") {
//             createProject.mutate(payload, {
//                 onSuccess: () => {
//                     toast.success("Project created successfully.");
//                     onOpenChange(false);
//                 },
//                 onError: () => toast.error("Failed to create project."),
//             });
//         } else if (project) {
//             updateProject.mutate(
//                 { id: project._id, payload },
//                 {
//                     onSuccess: () => {
//                         toast.success("Project updated successfully.");
//                         onOpenChange(false);
//                     },
//                     onError: () => toast.error("Failed to update project."),
//                 },
//             );
//         }
//     });

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent className="max-w-2xl overflow-y-auto bg-gray-100 dark:bg-slate-950">
//                 <DialogHeader>
//                     <DialogTitle>{mode === "create" ? "Add Project" : "Edit Project"}</DialogTitle>
//                 </DialogHeader>
//                 <ScrollArea className="max-h-[80vh] pr-2">
//                     <form onSubmit={onSubmit} className="flex flex-col gap-6">
//                         <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                             <Field label="Project Name" error={form.formState.errors.name?.message}>
//                                 <Input {...form.register("name")} placeholder="Insurance Portal Revamp" />
//                             </Field>
//                             <Field label="Client" error={form.formState.errors.client?.message}>
//                                 <Select
//                                     value={form.watch("client")}
//                                     onValueChange={(value) => form.setValue("client", value)}
//                                 >
//                                     <SelectTrigger>
//                                         <SelectValue placeholder="Select client" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {clients?.map((client) => (
//                                             <SelectItem key={client._id} value={client._id}>
//                                                 {getUserFullName(client)}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </Field>

//                             <Field
//                                 label="Project Leader"
//                                 error={form.formState.errors.projectManager?.message}
//                             >
//                                 <Select
//                                     value={form.watch("projectManager")}
//                                     onValueChange={(value) => form.setValue("projectManager", value)}
//                                 >
//                                     <SelectTrigger>
//                                         <SelectValue placeholder="Select project leader" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {users.map((user) => (
//                                             <SelectItem key={user._id} value={user._id}>
//                                                 {getUserFullName(user)}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </Field>

//                             <Field label="Developers">
//                                 <DeveloperMultiSelect
//                                     users={users}
//                                     value={form.watch("developers") ?? []}
//                                     onChange={(value) => form.setValue("developers", value)}
//                                 />
//                             </Field>
//                             <Field label="Type" error={form.formState.errors.type?.message}>
//                                 <Select
//                                     value={form.watch("type")}
//                                     onValueChange={(value) =>
//                                         form.setValue("type", value as CreateProjectFormValues["type"])
//                                     }
//                                 >
//                                     <SelectTrigger>
//                                         <SelectValue placeholder="Select type" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {PROJECT_TYPE_OPTIONS.map((option) => (
//                                             <SelectItem key={option.value} value={option.value}>
//                                                 {option.label}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </Field>
//                             <Field label="Status">
//                                 <Select
//                                     value={form.watch("status")}
//                                     onValueChange={(value) =>
//                                         form.setValue("status", value as CreateProjectFormValues["status"])
//                                     }
//                                 >
//                                     <SelectTrigger>
//                                         <SelectValue placeholder="Select status" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {PROJECT_STATUS_OPTIONS.map((option) => (
//                                             <SelectItem key={option.value} value={option.value}>
//                                                 {option.label}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </Field>
//                             <Field label="Project Value ($)">
//                                 <Input type="number" min={0} {...form.register("budget")} />
//                             </Field>
//                             <Field label="Priority" error={form.formState.errors.priority?.message}>
//                                 <Input
//                                     type="number"
//                                     min={1}
//                                     step={1}
//                                     {...form.register("priority")}
//                                     placeholder="e.g. 1 = highest"
//                                 />
//                             </Field>
//                             <Field label="Start Date" error={form.formState.errors.startDate?.message}>
//                                 <Input type="date" {...form.register("startDate")} />
//                             </Field>
//                             <Field label="End Date">
//                                 <Input type="date" {...form.register("endDate")} />
//                             </Field>
//                         </section>

//                         <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                             <Field label="Live URL">
//                                 <Input {...form.register("liveUrl")} placeholder="https://example.com" />
//                             </Field>
//                             <Field label="Development URL">
//                                 <Input
//                                     {...form.register("developmentLiveUrl")}
//                                     placeholder="https://dev.example.com"
//                                 />
//                             </Field>
//                             <Field label="Repository URL">
//                                 <Input
//                                     {...form.register("repositoryUrl")}
//                                     placeholder="https://github.com/org/repo"
//                                 />
//                             </Field>
//                             <Field
//                                 label="Technologies (comma separated)"
//                                 error={form.formState.errors.technologies?.message}
//                             >
//                                 <Input
//                                     {...form.register("technologies")}
//                                     placeholder="Next.js, Node.js, MongoDB"
//                                 />
//                             </Field>
//                         </section>

//                         <section className="grid grid-cols-1 gap-4">
//                             <Field label="Description">
//                                 <Textarea
//                                     rows={3}
//                                     {...form.register("description")}
//                                     placeholder="Project overview..."
//                                 />
//                             </Field>
//                         </section>

//                         <Separator />

//                         {/* Documents / Access Credentials */}
//                         <section className="flex flex-col gap-3">
//                             <div className="flex items-center justify-between">
//                                 <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
//                                     Documents &amp; Access Credentials
//                                 </h3>
//                                 <Button
//                                     type="button"
//                                     size="sm"
//                                     variant="outline"
//                                     className="gap-1"
//                                     onClick={() => documentsArray.append({ requirement: "", link: "" })}
//                                 >
//                                     <Plus className="h-3.5 w-3.5" />
//                                     Add
//                                 </Button>
//                             </div>

//                             {documentsArray.fields.length === 0 && (
//                                 <p className="text-xs text-muted-foreground">
//                                     No documents added yet.
//                                 </p>
//                             )}

//                             <div className="flex flex-col gap-3">
//                                 {documentsArray.fields.map((field, index) => (
//                                     <div
//                                         key={field.id}
//                                         className="grid grid-cols-1 gap-2 rounded-md border bg-background p-3 sm:grid-cols-[1fr_1fr_auto]"
//                                     >
//                                         <Field label="Document Title">
//                                             <Input
//                                                 {...form.register(`documents.${index}.requirement` as const)}
//                                                 placeholder="e.g. Server Access, Domain Login"
//                                             />
//                                         </Field>
//                                         <Field label="Link">
//                                             <Input
//                                                 {...form.register(`documents.${index}.link` as const)}
//                                                 placeholder="https://..."
//                                             />
//                                         </Field>
//                                         <div className="flex items-end">
//                                             <Button
//                                                 type="button"
//                                                 variant="ghost"
//                                                 size="icon"
//                                                 className="text-destructive hover:bg-destructive/10"
//                                                 onClick={() => documentsArray.remove(index)}
//                                             >
//                                                 <Trash2 className="h-4 w-4" />
//                                             </Button>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </section>

//                         <Separator />

//                         {/* Payment */}
//                         <section className="flex flex-col gap-3">
//                             <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
//                                 Payment
//                             </h3>

//                             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                                 <Field label="Payment Status">
//                                     <Select
//                                         value={form.watch("paymentStatus")}
//                                         onValueChange={(value) =>
//                                             form.setValue("paymentStatus", value as CreateProjectFormValues["paymentStatus"])
//                                         }
//                                     >
//                                         <SelectTrigger>
//                                             <SelectValue placeholder="Select payment status" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {PAYMENT_STATUS_OPTIONS.map((option) => (
//                                                 <SelectItem key={option.value} value={option.value}>
//                                                     {option.label}
//                                                 </SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </Field>
//                                 <Field label="Next Payment Date">
//                                     <Input type="date" {...form.register("nextPaymentDate")} />
//                                 </Field>
//                             </div>

//                             <div className="flex items-center justify-between">
//                                 <span className="text-xs text-muted-foreground">Payment History</span>
//                                 <Button
//                                     type="button"
//                                     size="sm"
//                                     variant="outline"
//                                     className="gap-1"
//                                     onClick={() =>
//                                         paymentsArray.append({
//                                             amount: undefined as unknown as number,
//                                             date: "",
//                                             status: PaymentStatus.DUE,
//                                             note: "",
//                                         })
//                                     }
//                                 >
//                                     <Plus className="h-3.5 w-3.5" />
//                                     Add Payment
//                                 </Button>
//                             </div>

//                             {paymentsArray.fields.length === 0 && (
//                                 <p className="text-xs text-muted-foreground">
//                                     No payments recorded yet.
//                                 </p>
//                             )}

//                             <div className="flex flex-col gap-3">
//                                 {paymentsArray.fields.map((field, index) => (
//                                     <div
//                                         key={field.id}
//                                         className="grid grid-cols-1 gap-2 rounded-md border bg-background p-3 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]"
//                                     >
//                                         <Field label="Amount ($)">
//                                             <Input
//                                                 type="number"
//                                                 min={0}
//                                                 {...form.register(`payments.${index}.amount` as const)}
//                                             />
//                                         </Field>
//                                         <Field label="Date">
//                                             <Input
//                                                 type="date"
//                                                 {...form.register(`payments.${index}.date` as const)}
//                                             />
//                                         </Field>
//                                         <Field label="Status">
//                                             <Select
//                                                 value={form.watch(`payments.${index}.status`)}
//                                                 onValueChange={(value) =>
//                                                     form.setValue(
//                                                         `payments.${index}.status`,
//                                                         value as PaymentStatus,
//                                                     )
//                                                 }
//                                             >
//                                                 <SelectTrigger>
//                                                     <SelectValue placeholder="Status" />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     {PAYMENT_STATUS_OPTIONS.map((option) => (
//                                                         <SelectItem key={option.value} value={option.value}>
//                                                             {option.label}
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                         </Field>
//                                         <Field label="Note">
//                                             <Input
//                                                 {...form.register(`payments.${index}.note` as const)}
//                                                 placeholder="Optional note"
//                                             />
//                                         </Field>
//                                         <div className="flex items-end">
//                                             <Button
//                                                 type="button"
//                                                 variant="ghost"
//                                                 size="icon"
//                                                 className="text-destructive hover:bg-destructive/10"
//                                                 onClick={() => paymentsArray.remove(index)}
//                                             >
//                                                 <Trash2 className="h-4 w-4" />
//                                             </Button>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </section>

//                         <DialogFooter>
//                             <Button
//                                 type="button"
//                                 variant="outline"
//                                 onClick={() => onOpenChange(false)}
//                                 disabled={isSubmitting}
//                             >
//                                 Cancel
//                             </Button>
//                             <Button
//                                 type="submit"
//                                 disabled={isSubmitting}
//                                 variant="default"
//                                 className="gap-2 text-white bg-indigo-600 transition-transform duration-500 ease-in-out hover:scale-105 hover:cursor-pointer hover:bg-cyan-800"
//                             >
//                                 {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
//                                 {mode === "create" ? "Create Project" : "Save Changes"}
//                             </Button>
//                         </DialogFooter>
//                     </form>
//                     <ScrollBar orientation="vertical" />
//                 </ScrollArea>
//             </DialogContent>
//         </Dialog>
//     );
// }

// function Field({
//     label,
//     error,
//     children,
// }: {
//     label: string;
//     error?: string;
//     children: React.ReactNode;
// }) {
//     return (
//         <div className="flex flex-col gap-1.5">
//             <Label>{label}</Label>
//             {children}
//             {error && <span className="text-xs text-destructive">{error}</span>}
//         </div>
//     );
// }

// v3

"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import type { IProject } from "@/types/project.types";
import { PaymentStatus } from "@/types/project.types";
import { CreateProjectFormOutput, createProjectFormSchema, CreateProjectFormValues } from "@/features/project/schema/project.schema";
import { PAYMENT_STATUS_OPTIONS, PROJECT_STATUS_OPTIONS, PROJECT_TYPE_OPTIONS } from "@/features/project/constants/project.constants";
import { useProjectMutations } from "@/features/project/hooks";
import { useAssignableUsers } from "@/features/users/hooks/useAssignableUsers";
import { DeveloperMultiSelect } from "./DeveloperMultiselect";
import { getUserFullName } from "@/features/users/utils/user.utils";
import { useClients } from "@/features/clients/hooks";
import { formatCurrency } from "@/features/project/utils/project.utils";

interface ProjectFormDialogProps {
    mode: "create" | "edit";
    project?: IProject;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const EMPTY_VALUES: CreateProjectFormValues = {
    name: "",
    description: "",
    type: PROJECT_TYPE_OPTIONS[0].value,
    client: "",
    projectManager: "",
    developers: [],
    budget: undefined,
    startDate: "",
    endDate: "",
    technologies: "",
    documents: [],
    status: PROJECT_STATUS_OPTIONS[0].value,
    paymentStatus: PaymentStatus.DUE,
    payments: [],
    nextPaymentDate: "",
    priority: undefined,
    liveUrl: "",
    developmentLiveUrl: "",
    repositoryUrl: "",
};

const projectToFormValues = (project: IProject): CreateProjectFormValues => ({
  name: project.name,
  description: project.description ?? "",
  type: project.type,
  client: project.client?._id ?? "",
  projectManager: project.projectManager?._id ?? "",
  developers: project.developers?.map((dev) => dev._id) ?? [],
  budget: project.budget,
  startDate: project.startDate?.slice(0, 10) ?? "",
  endDate: project.endDate?.slice(0, 10) ?? "",
  technologies: project.technologies?.join(", ") ?? "",
  documents: project.documents?.map((doc) => ({
    requirement: doc.requirement,
    link: doc.link,
  })) ?? [],
  status: project.status,
  paymentStatus: project.paymentStatus ?? PaymentStatus.DUE,
  payments: project.payments?.map((p) => ({
    amount: p.amount,
    date: p.date?.slice(0, 10) ?? "",
    status: p.status,
    note: p.note ?? "",
  })) ?? [],
  nextPaymentDate: project.nextPaymentDate?.slice(0, 10) ?? "",
  priority: project.priority,
  liveUrl: project.liveUrl ?? "",
  developmentLiveUrl: project.developmentLiveUrl ?? "",
  repositoryUrl: project.repositoryUrl ?? "",
});


export function ProjectFormDialog({ mode, project, open, onOpenChange }: ProjectFormDialogProps) {
    const { createProject, updateProject } = useProjectMutations();
    const { data: usersResponse } = useAssignableUsers();
    const {data: clients} = useClients();

    const users = usersResponse?.data ?? [];
    const form = useForm<CreateProjectFormValues, unknown, CreateProjectFormOutput>({
        resolver: zodResolver(createProjectFormSchema),
        defaultValues: mode === "edit" && project ? projectToFormValues(project) : EMPTY_VALUES,
    });

    const documentsArray = useFieldArray({
        control: form.control,
        name: "documents",
    });

    const paymentsArray = useFieldArray({
        control: form.control,
        name: "payments",
    });

    useEffect(() => {
        if (open) {
            form.reset(mode === "edit" && project ? projectToFormValues(project) : EMPTY_VALUES);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, project, mode]);

    const watchedBudget = form.watch("budget");
    const watchedPayments = form.watch("payments");

    const { totalPaid, amountDue } = useMemo(() => {
        const paid = (watchedPayments ?? []).reduce((sum, p) => {
            const amount = Number(p?.amount);
            return sum + (Number.isFinite(amount) ? amount : 0);
        }, 0);
        const budget = Number(watchedBudget);
        const due = Number.isFinite(budget) ? Math.max(budget - paid, 0) : undefined;

        return { totalPaid: paid, amountDue: due };
    }, [watchedBudget, watchedPayments]);

    const isSubmitting = createProject.isPending || updateProject.isPending;

    const onSubmit = form.handleSubmit((values) => {
        const payload = {
            ...values,
            description: values.description || undefined,
            endDate: values.endDate || undefined,
            liveUrl: values.liveUrl || undefined,
            developmentLiveUrl: values.developmentLiveUrl || undefined,
            repositoryUrl: values.repositoryUrl || undefined,
            nextPaymentDate: values.nextPaymentDate || undefined,
            documents: values.documents?.filter((doc) => doc.requirement && doc.link),
            payments: values.payments?.filter((p) => p.amount !== undefined && p.date),
        };

        if (mode === "create") {
            createProject.mutate(payload, {
                onSuccess: () => {
                    toast.success("Project created successfully.");
                    onOpenChange(false);
                },
                onError: () => toast.error("Failed to create project."),
            });
        } else if (project) {
            updateProject.mutate(
                { id: project._id, payload },
                {
                    onSuccess: () => {
                        toast.success("Project updated successfully.");
                        onOpenChange(false);
                    },
                    onError: () => toast.error("Failed to update project."),
                },
            );
        }
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl overflow-y-auto bg-gray-100 dark:bg-slate-950">
                <DialogHeader>
                    <DialogTitle>{mode === "create" ? "Add Project" : "Edit Project"}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[80vh] pr-2">
                    <form onSubmit={onSubmit} className="flex flex-col gap-6">
                        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Project Name" error={form.formState.errors.name?.message}>
                                <Input {...form.register("name")} placeholder="Insurance Portal Revamp" />
                            </Field>
                            <Field label="Client" error={form.formState.errors.client?.message}>
                                <Select
                                    value={form.watch("client")}
                                    onValueChange={(value) => form.setValue("client", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select client" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {clients?.map((client) => (
                                            <SelectItem key={client._id} value={client._id}>
                                                {getUserFullName(client)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field
                                label="Project Leader"
                                error={form.formState.errors.projectManager?.message}
                            >
                                <Select
                                    value={form.watch("projectManager")}
                                    onValueChange={(value) => form.setValue("projectManager", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select project leader" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user) => (
                                            <SelectItem key={user._id} value={user._id}>
                                                {getUserFullName(user)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field label="Developers">
                                <DeveloperMultiSelect
                                    users={users}
                                    value={form.watch("developers") ?? []}
                                    onChange={(value) => form.setValue("developers", value)}
                                />
                            </Field>
                            <Field label="Type" error={form.formState.errors.type?.message}>
                                <Select
                                    value={form.watch("type")}
                                    onValueChange={(value) =>
                                        form.setValue("type", value as CreateProjectFormValues["type"])
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PROJECT_TYPE_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field label="Status">
                                <Select
                                    value={form.watch("status")}
                                    onValueChange={(value) =>
                                        form.setValue("status", value as CreateProjectFormValues["status"])
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PROJECT_STATUS_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field label="Project Value ($)">
                                <Input type="number" min={0} {...form.register("budget")} />
                            </Field>
                            <Field label="Priority" error={form.formState.errors.priority?.message}>
                                <Input
                                    type="number"
                                    min={1}
                                    step={1}
                                    {...form.register("priority")}
                                    placeholder="e.g. 1 = highest"
                                />
                            </Field>
                            <Field label="Start Date" error={form.formState.errors.startDate?.message}>
                                <Input type="date" {...form.register("startDate")} />
                            </Field>
                            <Field label="End Date">
                                <Input type="date" {...form.register("endDate")} />
                            </Field>
                        </section>

                        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Live URL">
                                <Input {...form.register("liveUrl")} placeholder="https://example.com" />
                            </Field>
                            <Field label="Development URL">
                                <Input
                                    {...form.register("developmentLiveUrl")}
                                    placeholder="https://dev.example.com"
                                />
                            </Field>
                            <Field label="Repository URL">
                                <Input
                                    {...form.register("repositoryUrl")}
                                    placeholder="https://github.com/org/repo"
                                />
                            </Field>
                            <Field
                                label="Technologies (comma separated)"
                                error={form.formState.errors.technologies?.message}
                            >
                                <Input
                                    {...form.register("technologies")}
                                    placeholder="Next.js, Node.js, MongoDB"
                                />
                            </Field>
                        </section>

                        <section className="grid grid-cols-1 gap-4">
                            <Field label="Description">
                                <Textarea
                                    rows={3}
                                    {...form.register("description")}
                                    placeholder="Project overview..."
                                />
                            </Field>
                        </section>

                        <Separator />

                        {/* Documents / Access Credentials */}
                        <section className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Documents &amp; Access Credentials
                                </h3>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="gap-1"
                                    onClick={() => documentsArray.append({ requirement: "", link: "" })}
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Add
                                </Button>
                            </div>

                            {documentsArray.fields.length === 0 && (
                                <p className="text-xs text-muted-foreground">
                                    No documents added yet.
                                </p>
                            )}

                            <div className="flex flex-col gap-3">
                                {documentsArray.fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-1 gap-2 rounded-md border bg-background p-3 sm:grid-cols-[1fr_1fr_auto]"
                                    >
                                        <Field label="Document Title">
                                            <Input
                                                {...form.register(`documents.${index}.requirement` as const)}
                                                placeholder="e.g. Server Access, Domain Login"
                                            />
                                        </Field>
                                        <Field label="Link">
                                            <Input
                                                {...form.register(`documents.${index}.link` as const)}
                                                placeholder="https://..."
                                            />
                                        </Field>
                                        <div className="flex items-end">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:bg-destructive/10"
                                                onClick={() => documentsArray.remove(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <Separator />

                        {/* Payment */}
                        <section className="flex flex-col gap-3">
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Payment
                            </h3>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label="Payment Status">
                                    <Select
                                        value={form.watch("paymentStatus")}
                                        onValueChange={(value) =>
                                            form.setValue("paymentStatus", value as CreateProjectFormValues["paymentStatus"])
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select payment status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PAYMENT_STATUS_OPTIONS.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field label="Next Payment Date">
                                    <Input type="date" {...form.register("nextPaymentDate")} />
                                </Field>
                            </div>

                            {/* Live paid / due summary */}
                            <div className="grid grid-cols-2 gap-3 rounded-md border bg-background p-3 sm:grid-cols-3">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs text-muted-foreground">Project Value</span>
                                    <span className="text-sm font-medium">
                                        {watchedBudget !== undefined && watchedBudget !== null && watchedBudget !== ("" as unknown)
                                            ? formatCurrency(Number(watchedBudget))
                                            : "—"}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs text-muted-foreground">Total Paid</span>
                                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                        {formatCurrency(totalPaid)}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs text-muted-foreground">Amount Due</span>
                                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                                        {amountDue !== undefined ? formatCurrency(amountDue) : "—"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Payment History</span>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="gap-1"
                                    onClick={() =>
                                        paymentsArray.append({
                                            amount: undefined as unknown as number,
                                            date: "",
                                            status: PaymentStatus.DUE,
                                            note: "",
                                        })
                                    }
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Add Payment
                                </Button>
                            </div>

                            {paymentsArray.fields.length === 0 && (
                                <p className="text-xs text-muted-foreground">
                                    No payments recorded yet.
                                </p>
                            )}

                            <div className="flex flex-col gap-3">
                                {paymentsArray.fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-1 gap-2 rounded-md border bg-background p-3 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]"
                                    >
                                        <Field label="Amount ($)">
                                            <Input
                                                type="number"
                                                min={0}
                                                {...form.register(`payments.${index}.amount` as const)}
                                            />
                                        </Field>
                                        <Field label="Date">
                                            <Input
                                                type="date"
                                                {...form.register(`payments.${index}.date` as const)}
                                            />
                                        </Field>
                                        <Field label="Status">
                                            <Select
                                                value={form.watch(`payments.${index}.status`)}
                                                onValueChange={(value) =>
                                                    form.setValue(
                                                        `payments.${index}.status`,
                                                        value as PaymentStatus,
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {PAYMENT_STATUS_OPTIONS.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                        <Field label="Note">
                                            <Input
                                                {...form.register(`payments.${index}.note` as const)}
                                                placeholder="Optional note"
                                            />
                                        </Field>
                                        <div className="flex items-end">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:bg-destructive/10"
                                                onClick={() => paymentsArray.remove(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                variant="default"
                                className="gap-2 text-white bg-indigo-600 transition-transform duration-500 ease-in-out hover:scale-105 hover:cursor-pointer hover:bg-cyan-800"
                            >
                                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                {mode === "create" ? "Create Project" : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <Label>{label}</Label>
            {children}
            {error && <span className="text-xs text-destructive">{error}</span>}
        </div>
    );
}