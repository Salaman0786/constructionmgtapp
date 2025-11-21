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
    errors.equipment= "Manpower is required";
  } else if (!/^[0-9]\d*$/.test(equipmentStr)) {
    errors.equipment = "Manpower must be a positive";
  }

  if (!form.workDone || form.workDone.length < 5)
    errors.workDone = "Minimum 5 characters required";

  if (!form.issues || form.issues.length < 5)
    errors.issues = "Minimum 5 characters required";

  return errors;
};
