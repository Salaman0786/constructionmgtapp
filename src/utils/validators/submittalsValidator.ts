export const validateSubmittals = (form: {
  projectId?: string;
  title?: string;
  category?: string;
  department?: string;
  date?: string;
  description?: string;
  linkedDrawingId?: string | null;
}): Record<string, string> => {
  const errs: Record<string, string> = {};

  if (!form.projectId) errs.projectId = "Project is required";
  // Title
  const title = form.title?.trim() || "";

  if (!title) {
    errs.title = "Title is required";
  } else if (title.length < 1) {
    // kept for parity with backend DTO (MinLength = 1)
    errs.title = "Title must be at least 1 character long";
  } else if (title.length > 250) {
    errs.title = "Title must not exceed 250 characters";
  } else if (!/^[A-Za-z0-9 .,_()\/&\-:+#'"\[\]]+$/.test(title)) {
    errs.title = "Title contains invalid characters";
  }

  if (!form.category) errs.category = "Category is required";
  if (!form.department) errs.department = "Department is required";
  if (!form.date) errs.date = "Date is required";

  //Description
  if (!form.description?.trim()) {
    errs.description = "Description is required";
  }else if (form.description.length > 500) {
    errs.description = "Description must not exceed 500 characters";
  }

  // optional rule example (uncomment if needed)
  // if (form.category === "Drawing" && !form.linkedDrawingId) {
  //   errs.linkedDrawingId = "Linked drawing is required for Drawing category";
  // }

  return errs;
};
