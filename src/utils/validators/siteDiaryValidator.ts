export const validateSiteDiary = (form: any) => {
  const errors: any = {};

  if (!form.date) errors.date = "Date is required";

  if (!form.projectId) errors.projectId = "Please select a project";

  // WORK DONE
  if (!form.workDone?.trim()) {
    errors.workDone = "Work done is required";
  } else if (form.workDone.length < 1 || form.workDone.length > 100) {
    errors.workDone = "Work done should not exceed 100 characters";
  }

  // else if (!/^[A-Za-z\s]+$/.test(form.workDone)) {
  //   errors.workDone = "Only characters are allowed";
  // }

  // ISSUES
  if (!form.issues?.trim()) {
    errors.issues = "Issues are required";
  } else if (form.issues.length < 1 || form.issues.length > 500) {
    errors.issues = "Issues should not exceed 500 characters";
  }
  //  else if (!/^[A-Za-z\s]+$/.test(form.issues)) {
  //   errors.issues = "Only characters are allowed";
  // }

  return errors;
};
