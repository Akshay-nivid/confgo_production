
import moment from "moment";
import { UseFormSetValue, UseFormGetValues } from "react-hook-form";


/**
 * Formats a given date into a string with the format "YYYY/MM/DD".
 *
 * @param date - The date to format.
 * @returns The formatted date string.
 */
export const formatDate = (date: any) => {

  return moment(date).format("YYYY/MM/DD");
}


/**
 * Checks if there are any programs selected for a given date.
 *
 * @param date - The date to check for.
 * @param watch - The watch object from react-hook-form.
 * @returns true if there are any programs selected for the given date, false otherwise.
 */
export const isAnyProgramSelectedForDate = (date: Date, watch: any) => {

  const fieldName = `${formatDate(date)}-programs`;

  const selectedPrograms = watch(fieldName) || [];

  return selectedPrograms.length > 0;

};


/**
 * Sorts and groups data by date.
 *
 * This function takes an array of data objects, sorts them by their start time,
 * and groups them into an object based on their date. The date is formatted
 * as "MMM-DD-YYYY".
 *
 * @param data - An array of data objects that have a startTime or an eventAddon.startTime property.
 * @returns An object where each key is a date string, and its value is an array of data objects
 *          that correspond to that date.
 */
const sortData = (data: any): any => {
  if (!data?.length) {
    return {};
  }
  return data
    .sort((a: any, b: any) => new Date(a?.startTime || a.eventAddon.startTime).getTime() - new Date(b?.startTime || b.eventAddon.startTime).getTime())
    .reduce((grouped: any, program: any) => {
      const date = moment(program?.startTime || program.eventAddon.startTime).format("MMM-DD-YYYY")

      if (!grouped[date]) {
        grouped[date] = [];
      }

      grouped[date].push(program);
      return grouped;
    }, {});
};



/**
 * Takes an array of programs and addons, sorts and groups them by date,
 * and returns an object where each key is a date string, and its value is
 * an object with three properties: programs, addons, and total. The
 * programs property is an array of program objects, the addons property is
 * an array of addon objects, and the total property is the sum of the
 * amounts of all programs and addons for that date. If the calculateTotal
 * option is false, the total property will be 0.
 *
 * @param {Object} options - An object with the following properties:
 *   programs: {Array} - An array of program objects
 *   addons: {Array} - An array of addon objects
 *   calculateTotal: {Boolean} - Whether or not to calculate the total
 *     amount for each date. Default is false.
 * @returns {Object} - An object where each key is a date string, and its
 *     value is an object with three properties: programs, addons, and total.
 */
export const handleGroupData = ({ programs, addons, calculateTotal = false }: { programs: any, addons: any, calculateTotal?: boolean }) => {

  const sortedPrograms = sortData(programs);
  const sortedAddons = sortData(addons);

  const formattedData = Object.entries(sortedPrograms).reduce((acc: any, [date, programData]) => {


    if (!sortedPrograms) {
      throw new Error('Programs data is required and must be an object');
    }

    if (!acc[date]) {
      acc[date] = { addons: [], programs: [], total: 0 };
    }

    if (calculateTotal) {
      if (Array.isArray(programData))
        programData.map(prgm => {
          acc[date].total = acc[date].total + parseFloat(prgm.amount)
        })
    }

    acc[date].programs.push(...(programData as any[]))

    if (sortedAddons[date]) {
      acc[date].addons.push(...sortedAddons[date]);
    }


    return acc;
  }, {});

  return formattedData
}


/**
 * Processes the form data from the program selection form.
 *
 * The function takes an object of form data and the id of the event, and
 * returns an object with the following properties:
 *   eventId: the id of the event
 *   programIds: an array of program ids selected
 *   addons: an array of addon objects, each with the following properties:
 *     addonId: the id of the addon
 *     propertyIds: an array of property ids selected for the addon
 *
 * The function iterates over the form data object, and for each key-value
 * pair, it checks if the key includes 'program', in which case it adds the
 * value to the programIds array. If the key includes 'addon-', it adds the
 * value to the addonGroup object, and if the key includes 'addonProp', it
 * adds the value to the propertyIds array of the corresponding addon object
 * in the addonGroup object.
 *
 * @param {Object} formData - The form data object.
 * @param {any} id - The id of the event.
 * @returns {Object} - The processed data object.
 */
export const processFormData = (formData: any, id: any,participantTypeId:string|number) => {

  const formattedData: any = {

    eventId: parseInt(id) || null,
    programIds: [],
    participantTypeId:participantTypeId || null

  };

  const addonGroup: any = {}

  Object.entries(formData).forEach(([key, value]: [string, any]) => {

    if (key.includes('program') && value !== undefined) {

      if (value.length > 0) {
        formattedData.programIds.push(...value)
      }

      return
    }

    if (key.includes('-addon-') && value !== undefined) {

      const addonKey = key.split('-')[2]



      if (value.length > 0) {

        addonGroup[addonKey] = {
          addonId: parseInt(addonKey)
        }

      }

      return
    }


    if (key.includes('addonProp')) {

      // const addonPropValue = parseInt(value)

      const addonKey = parseInt(key.split('-')[2])

      if (addonGroup[addonKey]) {

        if (!addonGroup[addonKey].propertyIds) {
          addonGroup[addonKey].propertyIds = []
        }
        if (value !== undefined) {
          addonGroup[addonKey].propertyIds = [...value]

        }

      }

      return
    }

  })

  if (Object.keys(addonGroup).length > 0) {

    formattedData.addons = Object.values(addonGroup)

  }

  return formattedData
}




/**
 * Toggles the program checkboxes by date.
 * 
 * This function takes a key parameter to determine the date and toggles
 * the corresponding checkboxes in the form data. It clears the values
 * of fields that match the date and have keys starting with "addon".
 * It also sets the form data by ID.
 * 
 * @param {Object} params - The parameters for the function.
 * @param {string} params.key - The key representing the date for which
 *   the checkboxes should be toggled.
 * @param {UseFormGetValues<any>} params.getValues - A function to get
 *   the current form values.
 * @param {UseFormSetValue<any>} params.setValue - A function to set
 *   the value of a form field.
 * @param {Function} params.setDataById - A function to set data by ID.
 */
export function toggleProgramCheckboxesByDate(
  { key,
    getValues,
    setValue,
  }: {
    key: string,
    getValues: UseFormGetValues<any>,
    setValue: UseFormSetValue<any>,
  }
) {


  const formData = getValues();

  if (formData[key].length === 0 || formData[key] === undefined) {


    const [date] = key.split("-");

    Object.keys(formData).forEach((fieldKey) => {

      if (fieldKey.startsWith(`${date}-addon`) || fieldKey.startsWith(`${date}-addonProp`)) {  // If the field key includes the specific date and matches programs, clear its value

        setValue(fieldKey, undefined);
      }
    });
 
  }

}
