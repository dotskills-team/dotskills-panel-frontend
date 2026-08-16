// src/features/projects/components/project-form-dialog.tsx
"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
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

import type { IProject } from "@/types/project.types";
import { CreateProjectFormOutput, createProjectFormSchema, CreateProjectFormValues } from "@/features/project/schema/project.schema";
import { PROJECT_STATUS_OPTIONS, PROJECT_TYPE_OPTIONS } from "@/features/project/constants/project.constants";
import { useProjectMutations } from "@/features/project/hooks";
import { useAssignableUsers } from "@/features/users/hooks/useAssignableUsers";
import { DeveloperMultiSelect } from "./DeveloperMultiselect";
import { getUserFullName } from "@/features/users/utils/user.utils";

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
    requirements: "",
    status: PROJECT_STATUS_OPTIONS[0].value,
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
  requirements: project.requirements ?? "",
  status: project.status,
  liveUrl: project.liveUrl ?? "",
  developmentLiveUrl: project.developmentLiveUrl ?? "",
  repositoryUrl: project.repositoryUrl ?? "",
});


export function ProjectFormDialog({ mode, project, open, onOpenChange }: ProjectFormDialogProps) {
    const { createProject, updateProject } = useProjectMutations();
    const { data: usersResponse } = useAssignableUsers();
    const users = usersResponse?.data ?? [];

    const form = useForm<CreateProjectFormValues, unknown, CreateProjectFormOutput>({
        resolver: zodResolver(createProjectFormSchema),
        defaultValues: mode === "edit" && project ? projectToFormValues(project) : EMPTY_VALUES,
    });

    useEffect(() => {
        if (open) {
            form.reset(mode === "edit" && project ? projectToFormValues(project) : EMPTY_VALUES);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, project, mode]);

    const isSubmitting = createProject.isPending || updateProject.isPending;

    const onSubmit = form.handleSubmit((values) => {
        const payload = {
            ...values,
            description: values.description || undefined,
            endDate: values.endDate || undefined,
            requirements: values.requirements || undefined,
            liveUrl: values.liveUrl || undefined,
            developmentLiveUrl: values.developmentLiveUrl || undefined,
            repositoryUrl: values.repositoryUrl || undefined,
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
                                        {users.map((user) => (
                                            <SelectItem key={user._id} value={user._id}>
                                                {getUserFullName(user)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field
                                label="Project Manager"
                                error={form.formState.errors.projectManager?.message}
                            >
                                <Select
                                    value={form.watch("projectManager")}
                                    onValueChange={(value) => form.setValue("projectManager", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select project manager" />
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
                            <Field label="Budget ($)">
                                <Input type="number" min={0} {...form.register("budget")} />
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
                            <Field label="Requirements">
                                <Textarea
                                    rows={3}
                                    {...form.register("requirements")}
                                    placeholder="Scope, deliverables, constraints..."
                                />
                            </Field>
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