export const isFieldTypePresent = (type: string) =>
    ["address", "checkbox", "radio", "select"].includes(type);


export const selectOptions = [
    { label: "Short Answer", value: "text" },
    { label: "Email", value: "email" },
    { label: "Number", value: "number" },
    { label: "Date", value: "date" },
    { label: "Multiple Choices", value: "checkbox" },
    { label: "Single Choice", value: "radio" },
    { label: "Dropdown", value: "select" },
    { label: "Address", value: "address" },
    { label: "File", value: "file" },
];
  


 