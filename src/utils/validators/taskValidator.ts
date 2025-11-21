export const validateTask = (task: any) => {
  const errors: any = {};

  if (!task.title || !task.title.trim()) {
    errors.title = "Title is required";
  }

  if (!task.description || !task.description.trim()) {
    errors.description = "Description is required";
  }

  if (!task.dueDate) {
    errors.dueDate = "Due date is required";
  }

  if (!task.selectedProject) {
    errors.project = "Project is required";
  }

  if (!task.selectedAssignee) {
    errors.assignee = "Assignee is required";
  }

  return errors;
};
