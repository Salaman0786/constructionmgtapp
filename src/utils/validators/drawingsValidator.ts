export const validateDrawings = (form: any, files: any[]) => {
  const errors: Record<string, string> = {};

  //Project
  if (!form.projectId) {
    errors.projectId = "Project is required";
  }

  //Drawing Name
  const name = form.drawingName?.trim() || "";

  if (!name) {
    errors.drawingName = "Drawing name is required";
  } else if (name.length < 1) {
    errors.drawingName = "Drawing name must be at least 1 character";
  } else if (name.length > 100) {
    errors.drawingName = "Drawing name must not exceed 100 characters";
  } else if (!/^[A-Za-z0-9 .,_()\/&\-:+#'"\[\]]+$/.test(name)) {
    errors.drawingName = "Drawing name contains invalid characters";
  }

  //Discipline
  if (!form.discipline) {
    errors.discipline = "Discipline is required";
  }

  //Revision
  if (!form.revision) {
    errors.revision = "Revision is required";
  }

  //Date
  if (!form.date) {
    errors.date = "Date is required";
  }

  //Description
  if (!form.description?.trim()) {
    errors.description = "Description is required";
  } else if (form.description.length > 500) {
    errors.description = "Description must not exceed 500 characters";
  }
  return errors;
};
