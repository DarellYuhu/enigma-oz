"use client";
import { badgeVariants } from "@/components/ui/badge";
import { MagicCard } from "@/components/ui/magic-card";
import useWorkspace from "@/hooks/features/workspace/useWorkspace";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import DeleteSectionDialog from "./DeleteSectionDialog";
import DeleteProjectDialog from "./DeleteProjectDialog";
import { useSession } from "next-auth/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import EditProjectSheet from "./EditProjectSheet";

const MainContent = () => {
  const params = useParams<{ id: string }>();
  const { data: session } = useSession();
  const { data, isLoading } = useWorkspace(params.id);
  const isManager = data?.data.Workspace_User.some(
    (item) => item.userId.toString() === session?.user.id
  );

  if (isLoading) return <div>Loading</div>;
  else if (!data) return null;

  return (
    <div
      className="p-10 text-center relative min-h-screen h-fulll overscroll-y-auto"
      style={{ backgroundColor: data.data.bgColor ?? "" }}
    >
      <div style={{ color: data.data.textColor ?? "" }}>
        <h1 className="text-6xl font-bold mt-8">{data.data.name}</h1>
        {data.data.description && (
          <h3 className="text-xl p-10">{data.data.description}</h3>
        )}
      </div>
      <div className="space-y-8">
        {Object.values(data.normalized).map((item) => (
          <div className="space-y-4" key={item.id}>
            <div className="flex flex-row justify-between">
              <h2 className="text-2xl font-bold">{item.name}</h2>
              {isManager && (
                <DeleteSectionDialog
                  section={{
                    id: item.id,
                    name: item.name,
                    workspaceId: item.workspaceId,
                  }}
                />
              )}
            </div>
            <div className="grid grid-cols-12 gap-10">
              {item.projects?.map((item, index) => (
                <MagicCard
                  className="relative col-span-3 transition-all ease-in-out duration-300 hover:scale-105 h-354 w-472 aspect-3/4 border-none shadow-md"
                  key={index}
                >
                  <img
                    alt="picture"
                    // loader={customLoader}
                    src={`/api/${item.imageUrl}`}
                    width={"100"}
                    height={"100"}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute group flex flex-col justify-end bottom-0 left-0 text-left h-full bg-gradient-to-t from-[rgba(255,255,255,1)]  to-40% to-[rgba(255,255,255,0)]  w-full"
                    style={{
                      background: `linear-gradient(to top, ${item.gradientBgColor}, transparent 40%)`,
                      color: item.textColor ?? "",
                    }}
                  >
                    <div className="p-4 group-hover:opacity-0 transition-all duration-500 ease-in-out">
                      <h4 className="text-lg font-semibold">{item.title}</h4>
                      <h5 className="text-sm">{item.description}</h5>
                    </div>
                    <div className="absolute transition-all duration-500 ease-in-out bottom-0 left-0 w-full h-0 group-hover:h-1/5  overflow-y-auto">
                      <ScrollArea className="h-full bg-white/30 backdrop-blur-md">
                        <div className="flex flex-col p-4 items-center gap-2 h-full">
                          {item.Link.map((item, index) => (
                            <Link
                              key={index}
                              className={cn(badgeVariants(), "col-span-4")}
                              href={item.url}
                              style={{
                                background: item.buttonColor ?? "",
                                color: item.textColor ?? "",
                              }}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                  {isManager && (
                    <div className="absolute top-2 right-2 space-x-1">
                      <EditProjectSheet projectId={item.id} />
                      <DeleteProjectDialog
                        projectId={item.id}
                        projectName={item.title}
                        workspaceId={data.data.id}
                      />
                    </div>
                  )}
                </MagicCard>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainContent;
