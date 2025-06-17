import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Pen, Trash } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import ProjectSchema, { UpdateProject } from "@/schemas/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ColorPicker } from "@/components/ui/color-picker";
import useSections from "@/hooks/features/workspace/useSections";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import useProject from "@/hooks/features/workspace/useProject";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { MagicCard } from "@/components/ui/magic-card";
import isEqual from "lodash/isEqual";
import useUpdateProject from "@/hooks/features/workspace/useUpdateProject";

const EditProjectSheet = ({ projectId }: { projectId: string }) => {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [initValues, setInitValues] = useState<UpdateProject>();
  const { mutateAsync, isPending } = useUpdateProject();
  const params: { id: string } = useParams();
  const { data: sections } = useSections(params.id);
  const { data: project, isPending: isProjectPending } = useProject({
    projectId,
    workspaceId: params.id,
    enabled: open,
  });
  const form = useForm<UpdateProject>({
    resolver: zodResolver(ProjectSchema.update),
    defaultValues: {
      projectId: "",
      sectionId: "",

      title: "",
      description: "",
      image: undefined,
      gradientBgColor: "",
      textColor: "",
      links: [{ label: "", url: "", buttonColor: "", textColor: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "links",
  });

  const onSubmit = (values: UpdateProject) => {
    const changedFields = Object.keys(values).filter(
      (key) =>
        !isEqual(
          initValues?.[key as keyof UpdateProject],
          values[key as keyof UpdateProject]
        )
    );

    mutateAsync({
      changedFields: changedFields as (keyof UpdateProject)[],
      values,
      workspaceId: params.id,
      projectId: projectId,
    }).then(() => closeRef.current?.click());
  };

  useEffect(() => {
    if (project && open) {
      const projectValues = {
        title: project.title,
        image: project.imageUrl,
        description: project.description ?? "",
        gradientBgColor: project.gradientBgColor ?? "",
        sectionId: project.sectionId.toString(),
        projectId: project.id,
        textColor: project.textColor ?? "",
        links: project.Link.map((item) => ({
          id: item.id,
          label: item.label,
          url: item.url,
          buttonColor: item.buttonColor ?? "",
          textColor: item.textColor ?? "",
        })),
      };
      form.reset(projectValues, { keepDefaultValues: true });
      setInitValues(projectValues);
    }
  }, [project, open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button variant={"outline"} size={"icon"}>
          <Pen />
        </Button>
      </SheetTrigger>
      <SheetContent className=" space-y-8 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Card?</SheetTitle>
          <SheetDescription>
            Please fill all the available form
          </SheetDescription>
        </SheetHeader>
        {isProjectPending ? (
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <div className="space-y-2" key={index}>
                <Skeleton className="h-6 w-14" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Image</FormLabel>
                    <FormControl>
                      {typeof form.watch("image") === "string" ? (
                        <MagicCard className="p-2" gradientColor={"#D9D9D955"}>
                          <div className="flex flex-row gap-2 items-center">
                            <img
                              src={`/api${form.getValues("image")}` as string}
                              className="size-16 object-cover border rounded-md"
                              alt="card image"
                            />
                            <Separator
                              orientation="vertical"
                              className="h-16"
                            />
                            <h3 className="text-sm font-semibold">
                              {form.getValues("image") as string}
                            </h3>
                            <Button
                              className=""
                              size={"icon"}
                              type="button"
                              variant={"destructive"}
                              onClick={() =>
                                form.resetField("image", {
                                  defaultValue: undefined,
                                })
                              }
                            >
                              <Trash />
                            </Button>
                          </div>
                        </MagicCard>
                      ) : (
                        <Input
                          multiple={false}
                          className="pe-3 file:me-3 file:border-0 file:border-e h-fit p-2"
                          type="file"
                          accept="image/*"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row gap-4">
                <FormField
                  control={form.control}
                  name="textColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Text Color</FormLabel>
                      <FormControl>
                        <ColorPicker
                          value={field.value!}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gradientBgColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gradient Color</FormLabel>
                      <FormControl>
                        <ColorPicker
                          value={field.value!}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="sectionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sections?.map((selection) => (
                          <SelectItem
                            key={selection.id}
                            value={selection.id.toString()}
                          >
                            {selection.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel>Links</FormLabel>
                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-2">
                    <div className="flex flex-row gap-2">
                      <FormField
                        control={form.control}
                        name={`links.${index}.label`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Input {...field} placeholder="Label" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        className="flex justify-self-end"
                        type="button"
                        variant={"destructive"}
                        onClick={() => remove(index)}
                      >
                        <Trash />
                      </Button>
                    </div>
                    <FormField
                      control={form.control}
                      name={`links.${index}.url`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="url"
                              {...field}
                              placeholder="https://"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-row gap-2">
                      <FormField
                        control={form.control}
                        name={`links.${index}.textColor`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Text Color</FormLabel>
                            <FormControl>
                              <ColorPicker
                                value={field.value!}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`links.${index}.buttonColor`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Button Color</FormLabel>
                            <FormControl>
                              <ColorPicker
                                value={field.value!}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant={"outline"}
                  type="button"
                  size={"sm"}
                  onClick={() =>
                    append({
                      label: "",
                      url: "",
                      textColor: "",
                      buttonColor: "",
                    })
                  }
                >
                  Add Link
                </Button>
              </div>

              <SheetFooter className="text-sm mt-4">
                <Button
                  type="submit"
                  className={buttonVariants()}
                  disabled={isPending}
                >
                  Update
                </Button>
                <SheetClose
                  ref={closeRef}
                  className={buttonVariants({ variant: "outline" })}
                  onClick={() => {
                    form.reset();
                  }}
                >
                  Cancel
                </SheetClose>
              </SheetFooter>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default EditProjectSheet;
