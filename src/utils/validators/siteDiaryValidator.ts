export const validateSiteDiary = (form: any) => {
  const errors: any = {};

  const manpowerStr = String(form.manpower);
  const equipmentStr = String(form.equipment);

  if (!form.date) errors.date = "Date is required";

  if (!form.projectId) errors.projectId = "Please select a project";

  if (manpowerStr.trim() === "") {
    errors.manpower = "Manpower is required";
  } else if (!/^[0-9]\d*$/.test(manpowerStr)) {
    errors.manpower = "Manpower must be a positive";
  }

  if (equipmentStr.trim() === "") {
    errors.equipment = "Manpower is required";
  } else if (!/^[0-9]\d*$/.test(equipmentStr)) {
    errors.equipment = "Manpower must be a positive";
  }

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
