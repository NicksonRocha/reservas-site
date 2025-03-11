import DOMPurify from "dompurify";


export const sanitizeFormData = (formData) => {
  const sanitizedData = {};
  for (const key in formData) {
    if (typeof formData[key] === "string") {
      sanitizedData[key] = DOMPurify.sanitize(formData[key], {
        allowedTags: [], 
        allowedAttributes: {}, 
      });
    } else {
      sanitizedData[key] = formData[key]; 
    }
  }
  return sanitizedData;
};
