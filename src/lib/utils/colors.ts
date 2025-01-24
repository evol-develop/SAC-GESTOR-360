export const getStatusColor = (status: string) => {
  switch (status) {
    case "on hold":
      return "bg-yellow-50 text-yellow-950 dark:bg-yellow-950 dark:text-yellow-50";
    case "pending":
      return "bg-yellow-50 text-yellow-950 dark:bg-yellow-950 dark:text-yellow-50";
    case "in progress":
      return "bg-blue-50 text-blue-950 dark:bg-blue-950 dark:text-blue-50";
    case "review":
      return "bg-purple-50 text-purple-950 dark:bg-purple-950 dark:text-purple-50";
    case "done":
      return "bg-green-50 text-green-950 dark:bg-green-950 dark:text-green-50";
    default:
      return "bg-gray-50 text-gray-950 dark:bg-gray-950 dark:text-gray-50";
  }
};
