export const validateProject = (form: any, isEdit: boolean) => {
  const errors: any = {};

  if (!form.name.trim()) errors.name = "Project name is required";

  if (!form.type.trim()) errors.type = "Project type is required";

  if (!form.managerId) errors.managerId = "Please select project manager";

  // ✅ CORRECT BUDGET VALIDATION (only positive numbers, no +, no -, no letters)
  const budgetBaselineStr = String(form.budgetBaseline).trim();

  if (budgetBaselineStr === "") {
    errors.budgetBaseline = "Budget Baseline is required";
  } else if (!/^[0-9]\d*$/.test(budgetBaselineStr)) {
    errors.budgetBaseline = "Budget must be a positive";
  }

  if (!form.startDate) errors.startDate = "Start date is required";
  if (!form.endDate) errors.endDate = "End date is required";

  if (form.startDate && form.endDate && form.endDate < form.startDate) {
    errors.endDate = "End date must be after start date";
  }

  if (!form.city.trim()) errors.city = "City is required";
  if (!form.country.trim()) errors.country = "Country is required";
  if (!form.address.trim()) errors.address = "Address is required";

  if (isEdit && !form.code) errors.code = "Project code missing";

  return errors;
};
