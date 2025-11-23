export const validateProject = (form: any, isEdit: boolean) => {
  const errors: any = {};

  // Project Name Validation
  if (!form.name.trim()) {
    errors.name = "Project name is required";
  } else if (!/^[A-Za-z\s]+$/.test(form.name)) {
    errors.name = "Only characters are allowed";
  } else if (form.name.length < 1 || form.name.length > 100) {
    errors.name = "Project name should not exceed 100 characters";
  }

  // Project Type Validation
  if (!form.type.trim()) {
    errors.type = "Project type is required";
  } else if (!/^[A-Za-z\s]+$/.test(form.type)) {
    errors.type = "Only characters are allowed";
  } else if (form.type.length < 1 || form.type.length > 100) {
    errors.type = "Project Type should not exceed 100 characters";
  }

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

  // City Validation
  if (!form.city.trim()) {
    errors.city = "City is required";
  } else if (!/^[A-Za-z\s]+$/.test(form.city)) {
    errors.city = "Only characters are allowed";
  } else if (form.city.length < 1 || form.city.length > 100) {
    errors.city = "City should not exceed 100 characters";
  }
  // if (!form.city.trim()) errors.city = "City is required";

  // Country Validation
  if (!form.country.trim()) {
    errors.country = "Country is required";
  } else if (!/^[A-Za-z\s]+$/.test(form.country)) {
    errors.country = "Only characters are allowed";
  } else if (form.country.length < 1 || form.country.length > 100) {
    errors.country = "Country should not exceed 100 characters";
  }
  // if (!form.country.trim()) errors.country = "Country is required";
  // if (!form.address.trim()) errors.address = "Address is required";

  // const address =  || "";

  if (!form.address?.trim()) {
    errors.address = "Address is required";
  } else if (form.address.length > 150) {
    errors.address = "Address should not exceed 150 characters";
  } else if (!/^[\p{L}0-9\s,.\-/#'()&]+$/u.test(form.address)) {
    errors.address = "Address contains invalid characters";
  }

  if (isEdit && !form.code) errors.code = "Project code missing";

  return errors;
};
