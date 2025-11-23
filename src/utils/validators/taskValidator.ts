export const validateTask = (task: any) => {
  const errors: any = {};

  // TITLE VALIDATION
  if (!task.title?.trim()) {
    errors.title = "Task is required";
  } else if (!/^[A-Za-z\s]+$/.test(task.title)) {
    errors.title = "Only characters are allowed";
  } else if (task.title.length < 1 || task.title.length > 100) {
    errors.title = "Title should not exceed 500 characters";
  }

  // DESCRIPTION VALIDATION
  if (!task.description?.trim()) {
    errors.description = "Description is required";
  } else if (!/^[A-Za-z\s]+$/.test(task.description)) {
    errors.description = "Only characters are allowed";
  } else if (task.description.length < 1 || task.description.length > 500) {
    errors.description = "Description should not exceed 500 characters";
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
