// import { useEffect, useState } from "react";
// import { LuBellRing, LuCircleCheck } from "react-icons/lu";

// import {
//   getActivityTimeline,
//   type ActivityTimelineItem,
// } from "@/api/notificationsApi";
// import { cn } from "@/lib/utils";
// import { words } from "@/lib/utils/words";
// import { useAuth } from "@/hooks/useAuth";
// import { Large } from "@/components/typography";
// import UserAvatar from "@/components/UserAvatar";
// import { getStatusColor } from "@/lib/utils/colors";
// import { Separator } from "@/components/ui/separator";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Labels, Status } from "@/contexts/Notifications/components";

// const ActivityTimeline = () => {
//   const { user } = useAuth();
//   const [activity, setActivity] = useState<ActivityTimelineItem[]>([]);

//   useEffect(() => {
//     if (user?.id) {
//       getActivityTimeline(user?.id).then((response) =>
//         setActivity(response || [])
//       );
//     }
//   }, [user]);

//   return (
//     <div className="flex flex-col gap-2 pb-4 text-sm">
//       <Separator />
//       <Large className="px-4">Visualiza tu actividad</Large>
//       {activity.length > 0 && (
//         <ScrollArea className="sm:h-[calc(100vh-328px)]">
//           <ul className="relative z-10 grid w-full h-full gap-2 px-4">
//             {activity.map((item) => (
//               <div
//                 key={item.id}
//                 className={cn(
//                   "grid grid-cols-[auto,1fr] items-center gap-2 p-2 text-sm rounded-md border",
//                   item.notification === "task"
//                     ? // @ts-expect-error item.notification se incluye en items de tipo Task
//                       getStatusColor(item.status)
//                     : "bg-blue-50 dark:bg-blue-950 text-blue-950 dark:text-blue-50"
//                 )}
//               >
//                 <span className="z-20 p-1 bg-blue-400 dark:bg-blue-700 rounded-full text-[#fafafa]">
//                   {item.notification === "message" ? (
//                     <LuBellRing />
//                   ) : (
//                     <LuCircleCheck />
//                   )}
//                 </span>
//                 <div className="grid items-center gap-1">
//                   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//                     <span className="font-semibold line-clamp-1">
//                       {item.title}
//                     </span>
//                     <span className="text-xs text-accent-foreground line-clamp-1 sm:ml-auto">
//                       {words.dateToUpperCase(
//                         new Date(item.createdAt).toLocaleDateString("es-MX", {
//                           weekday: "short",
//                           year: "numeric",
//                           month: "long",
//                           day: "numeric",
//                         })
//                       )}
//                     </span>
//                   </div>
//                   <div className="flex flex-col gap-1">
//                     {/* Destinatario(s) */}
//                     <div className="flex items-center gap-1">
//                       <span className="text-xs text-accent-foreground">
//                         Para:
//                       </span>
//                       {item.userId && item.userId !== "all" ? (
//                         <UserAvatar
//                           userId={item.userId}
//                           rounded="rounded-full"
//                           className="w-6 h-6 border border-secondary"
//                           withTooltip
//                         />
//                       ) : item.userId === "all" ? (
//                         <span className="text-xs">Todos</span>
//                       ) : (
//                         item.groupIds &&
//                         item.groupIds.length > 0 && (
//                           <div className="flex items-center gap-1">
//                             {item.groupIds.map((userId, index) => (
//                               // Mostrar el avatar agrupado de los usuarios, uno frente al otro
//                               <UserAvatar
//                                 key={userId}
//                                 userId={userId}
//                                 rounded="rounded-full"
//                                 className="w-6 h-6 -ml-3 border border-secondary first:m-0"
//                                 withTooltip
//                                 styles={{
//                                   // @ts-expect-error se comprueba que groupIds es un array de strings
//                                   zIndex: item.groupIds.length - index,
//                                 }}
//                               />
//                             ))}
//                           </div>
//                         )
//                       )}
//                     </div>
//                     {item.notification === "task" ? (
//                       <div className="flex gap-1">
//                         <Status
//                           className="mr-auto"
//                           // @ts-expect-error item se incluye en items de tipo Task
//                           taskStatus={item.status}
//                         />
//                         <Labels
//                           className="flex-wrap"
//                           // @ts-expect-error item se incluye en items de tipo Task
//                           taskLabels={item.label}
//                         />
//                       </div>
//                     ) : null}
//                   </div>
//                   <p className="text-xs text-primary/75 line-clamp-1">
//                     <i>Tú: </i>
//                     {item.details}
//                   </p>
//                 </div>
//               </div>
//             ))}
//             <Separator
//               orientation="vertical"
//               className="left-[34px] z-10 w-[4px] absolute bg-blue-400 dark:bg-blue-700"
//             />
//           </ul>
//         </ScrollArea>
//       )}
//     </div>
//   );
// };

// export default ActivityTimeline;
