export const isFieldTypePresent = (type: string) =>
    ["address", "checkbox", "radio", "select"].includes(type);


export const selectOptions = [
    { label: "Text", value: "text" },
    { label: "Email", value: "email" },
    { label: "Number", value: "number" },
    { label: "Date", value: "date" },
    { label: "Checkboxes", value: "checkbox" },
    { label: "Multiple Choice", value: "radio" },
    { label: "Dropdown", value: "select" },
    { label: "Address", value: "address" },
    { label: "File", value: "file" },
];
  


 